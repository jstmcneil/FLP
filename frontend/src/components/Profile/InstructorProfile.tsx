import React, { Fragment } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import { TableHead, Paper, Typography } from '@material-ui/core';
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


interface InstructorProps {
    grades: GradeInstructorView[];
    regCodes: string[];
    courses: CourseType[];
    username: string;
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
        console.log(gradeByRegCodeByCourses);
        return (
            <div className="report">
                <Typography variant="h6">Instructor Name: {this.props.username}</Typography>
                <RegCodeSelection />
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
                                                            {...header, label: emailQuestion} : 
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
                <CSVLink data={this.props.grades.map(grade => {
                    return {...grade, emailResponse: getEmailQuestion(this.props.courses, grade)}
                })} headers={headers} filename={"FLP_class_grades.csv"}>
                    Download All Grades
                </CSVLink>
            </div >
        );
    }
}

export default connect(state => {
    return {
        regCodes: regCodesSelector(state),
        grades: instructorGradesSelector(state),
        courses: courseSelector(state),
        username: usernameSelector(state)
    };
})(InstructorProfile);