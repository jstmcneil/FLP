import React, { Fragment } from 'react';
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


interface InstructorProps {
    grades: GradeInstructorView[];
    regCodes: string[];
    courses: CourseType[];
    username: string;
    reviews: ReviewType[];
    getReviews: Function;
}


interface InstructorState {
}


class InstructorProfile extends React.Component<InstructorProps, InstructorState> {
    render() {
        if (!this.props.regCodes || !this.props.grades || !this.props.courses) return <Fragment />;
        const grade = this.props.grades.filter(item => item != null);
        const count = grade.length;
        const headers = [
            { label: "Course ID", key: "courseId" },
            { label: "Student Name", key: "username" },
            { label: "MC Grade", key: "mcGrade" },
            { label: "Email Response", key: "emailResponse" },
        ];
        const gradeByRegCodeByCourses: any = {};
        grade.forEach(grade => {
            if (!get(gradeByRegCodeByCourses, [grade.regCode, grade.courseId], undefined)) {
                set(gradeByRegCodeByCourses, [grade.regCode, grade.courseId], []);
            }
            gradeByRegCodeByCourses[grade.regCode][grade.courseId].push(grade);

        })

        return (
            <div className="report">
                <Typography variant="h6">Instructor Name: {this.props.username}</Typography>
                <RegCodeSelection />
                <div className="space"></div>
                <Typography variant="h3">Enrollments</Typography>
                {this.props.regCodes && this.props.grades
                    && this.props.regCodes.map(regCode => {
                        return (
                            <div>
                                <Paper style={{ padding: "15px", margin: "10px", backgroundColor: "#73C2FB" }}>
                                    <Typography variant="h4">{regCode}</Typography>
                                    <CourseSelection regCode={regCode} />
                                    <div>
                                        {Object.keys(gradeByRegCodeByCourses[regCode]).map((courseId): JSX.Element => {
                                            const course = this.props.courses.find(course => course.id === courseId);
                                            const grades = get(gradeByRegCodeByCourses, [regCode, courseId], []);
                                            const emailQuestion = ((course ?.quiz.emailQuestions.length || 0) > 0)
                                                ? (course ?.quiz.emailQuestions[0].questionContent || "")
                                                : "";
                                            return (
                                                <Paper style={{ margin: "10px", padding: "10px" }}>
                                                    <Typography variant="h5">{course ?.courseName || ""}</Typography>
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
                                                        filename={`FLP_class_grades_${regCode}_${course ?.courseName || ""}.csv`}>
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
                <CSVLink data={this.props.grades.map(grade => {
                    return { ...grade, emailResponse: getEmailQuestion(this.props.courses, grade) }
                })} headers={headers} filename={"FLP_class_grades.csv"}>
                    Download All Grades
                </CSVLink>
                <div className="space"></div>
                <Typography variant="h3">Student Reviews</Typography>
                {this.props.regCodes && this.props.regCodes.map(regCode => {
                    return (
                        <div>
                            <Paper style={{ padding: "15px", margin: "10px", backgroundColor: "#73C2FB" }}>
                                <Typography variant="h4">{regCode}</Typography>
                                <div>
                                    {Object.keys(gradeByRegCodeByCourses[regCode]).map((courseId): JSX.Element => {
                                        const course = this.props.courses.find(course => course.id === courseId);
                                        return (
                                            <Paper style={{ margin: "10px", padding: "10px" }}>
                                                <div></div>
                                                <button style={{ width: "auto", margin: '20px' }} onClick={() => this.props.getReviews(regCode, courseId)}>{"View Student Reviews: " + course ?.courseName || ""}</button>
                                                <div></div>
                                                {
                                                    (this.props.reviews) && this.props.reviews.map((re: ReviewType) => (
                                                        <div style={{ display: 'inline-block', justifyContent: 'center', flexWrap: 'wrap', padding: '5px' }}>
                                                            {(re.regCode == regCode && re.courseId == courseId) ? <Chip label={re.review} color="secondary" /> : <div></div>}
                                                        </div>
                                                    ))
                                                }
                                            </Paper>
                                        )
                                    })}
                                </div>
                            </Paper>
                        </div>
                    );
                })
                }
            </div >
        );
    }
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