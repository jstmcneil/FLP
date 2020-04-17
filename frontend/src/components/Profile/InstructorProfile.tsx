import React, { Fragment, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow, TableHead, Paper, Typography, Chip, styled } from '@material-ui/core';
import LogOutButton from '../LogOutButton';
import RegCodeSelection from './RegCodeSelection';
import { connect } from 'react-redux';
import { regCodesSelector, instructorGradesSelector, curriculumSelector, courseSelector, usernameSelector } from '../../selectors';
import CourseSelection from './CourseSelection';
import { GradeInstructorView } from '../../model/GradeInstructorView';
import { CSVLink } from "react-csv";
import { CurriculumType } from '../../model/CurriculumType';
import { ReviewType } from '../../model/ReviewType';
import { CourseType } from '../../model/CourseType';
import set from 'lodash/set';
import get from 'lodash/get';
import { getEmailQuestion } from './StudentProfile';
import { reviewSelector } from '../../selectors/index';
import dispatch from '../Review/Review';
import { GET_REVIEWS } from '../../actions/types';
import { ReviewState } from '../../reducers';


interface InstructorProps {
    grades: GradeInstructorView[];
    regCodes: string[];
    courses: CourseType[];
    username: string;
    reviews: ReviewState;
    getReviews: Function;
}

const reviewForCourseExists = (reviews: ReviewState, courseId: string): boolean => {
    const reviewsForCourse = get(reviews, ["*", courseId], false);
    if (!reviewsForCourse) {
        return false;
    }
    return true;
}

const showReviews = (reviews: ReviewState, courseId: string): JSX.Element => {
    const relevantReviews = get(reviews, ["*", courseId], undefined);
    if (!relevantReviews) {
        return <Typography variant="body1"></Typography>;
    }
    if (typeof relevantReviews === "string") {
        return <Typography variant="body1">There was an error in fetching the reviews for this course.</Typography>;
    }
    if (relevantReviews.length === 0) {
        return <Typography variant="body1">No reviews loaded.</Typography>
    }
    return (
        <Fragment>
            {
                (relevantReviews as ReviewType[]).map(review => {
                    return (
                        <TableRow>
                            <TableCell component="td" scope="row">
                                {review.review}
                            </TableCell>
                        </TableRow>
                    );

                })
            }
        </Fragment>
    );
}

const InstructorProfile = (props: InstructorProps) => {
    if (!props.regCodes || !props.grades || !props.courses) return <Fragment />;
    const grade = props.grades.filter(item => item != null);
    const count = grade.length;
    const headers = [
        { label: "Course ID", key: "courseId" },
        { label: "Student Name", key: "username" },
        { label: "MC Grade", key: "mcGrade" },
        { label: "Email Response", key: "emailResponse" },
    ];
    const gradeByRegCodeByCourses: any = {};
    grade.forEach(grade => {
        if (grade != null && grade != undefined) {
            if (!get(gradeByRegCodeByCourses, [grade.regCode, grade.courseId], undefined)) {
                set(gradeByRegCodeByCourses, [grade.regCode, grade.courseId], []);
            }
            gradeByRegCodeByCourses[grade.regCode][grade.courseId].push(grade);
        }
    });
    const courseIdsSet = new Set<string>();
    grade.map(g => g.courseId).forEach(courseId => {
        if (!reviewForCourseExists(props.reviews, courseId)) {
            courseIdsSet.add(courseId);
        }
    })
    return (
        <div className="report">
            <Typography variant="h6">Instructor Name: {props.username}</Typography>
            <RegCodeSelection />
            <div className="space"></div>
            <Typography variant="h3">Enrollments</Typography>
            {props.regCodes && props.grades
                && props.regCodes.map(regCode => {
                    return (
                        <div>
                            <Paper style={{ padding: "15px", margin: "10px", backgroundColor: "#73C2FB" }}>
                                <Typography variant="h4">{regCode}</Typography>
                                <CourseSelection regCode={regCode} />
                                <div>
                                    {Object.keys(gradeByRegCodeByCourses).length > 0 && gradeByRegCodeByCourses[regCode] && Object.keys(gradeByRegCodeByCourses[regCode]).length > 0 && Object.keys(gradeByRegCodeByCourses[regCode]).map((courseId): JSX.Element => {
                                        const course = props.courses.find(course => course.id === courseId);
                                        const grades = get(gradeByRegCodeByCourses, [regCode, courseId], []);
                                        const emailQuestion = ((course?.quiz.emailQuestions.length || 0) > 0)
                                            ? (course?.quiz.emailQuestions[0].questionContent || "")
                                            : "";
                                        return (
                                            <Paper style={{ margin: "10px", padding: "10px" }}>
                                                <Typography variant="h5">{course?.courseName || ""}</Typography>
                                                <Table style={{ width: 500, textAlign: "center" }}>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell align="right">Student Name</TableCell>
                                                            <TableCell align="right">MC Grade</TableCell>
                                                            {emailQuestion !== "" && <TableCell align="right">{emailQuestion}</TableCell>}
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {
                                                            (grades.length > 0) && grades.map((g: GradeInstructorView) => (
                                                                <TableRow>
                                                                    <TableCell component="th" scope="row">
                                                                        {g.username}
                                                                    </TableCell>
                                                                    <TableCell align="right">{g.mcGrade}</TableCell>
                                                                    {emailQuestion !== "" && <TableCell align="right">{g.emailResponse}</TableCell>}
                                                                </TableRow>
                                                            ))
                                                        }
                                                    </TableBody>
                                                </Table>
                                                <CSVLink
                                                    data={grades}
                                                    headers={headers.map(
                                                        header => header.label === "Email Response" && emailQuestion !== "" ?
                                                            { ...header, label: emailQuestion } :
                                                            header)}
                                                    filename={`FLP_class_grades_${regCode}_${course?.courseName || ""}.csv`}>
                                                    Download Grades
                                                    </CSVLink>
                                            </Paper>
                                        )
                                    })}
                                </div>
                            </Paper>
                        </div>
                    );
                })
            }
            <CSVLink data={props.grades.map(grade => {
                return { ...grade, emailResponse: getEmailQuestion(props.courses, grade) }
            })} headers={headers} filename={"FLP_class_grades.csv"}>
                Download All Grades
                </CSVLink>
            <div className="space"></div>
            <Typography variant="h3">Student Reviews</Typography>
            <div>
                <Paper style={{ padding: "15px", margin: "10px", backgroundColor: "#73C2FB" }}>
                    <div>
                        {props.courses && props.courses.map((course: CourseType) => {
                            return (
                                <Paper style={{ margin: "10px", padding: "10px" }}>
                                    <Typography variant="h5">{course?.courseName || ""}</Typography>
                                    <Table style={{ width: 500, textAlign: "center" }}>
                                        <TableHead>
                                            <button style={{ width: "auto", margin: '20px' }} onClick={() => props.getReviews("*", course.id)}>View Student Reviews</button>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                showReviews(props.reviews, course.id)
                                            }
                                        </TableBody>
                                    </Table>

                                </Paper>
                            )
                        })}
                    </div>
                </Paper>
            </div>
        </div >
    );
}


export default connect(state => {
    return {
        regCodes: regCodesSelector(state),
        grades: instructorGradesSelector(state),
        courses: courseSelector(state),
        username: usernameSelector(state),
        reviews: reviewSelector(state),
    };
}, dispatch => {
    return {
        getReviews: (regCode: string, courseId: string) => dispatch({ type: GET_REVIEWS, payload: { regCode, courseId } })
    }
})(InstructorProfile);