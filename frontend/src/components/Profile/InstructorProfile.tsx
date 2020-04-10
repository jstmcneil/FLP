import React, { Fragment } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import { TableHead } from '@material-ui/core';
import LogOutButton from '../LogOutButton';
import RegCodeSelection from './RegCodeSelection';
import { connect } from 'react-redux';
import { regCodesSelector, instructorGradesSelector, curriculumSelector } from '../../selectors';
import CourseSelection from './CourseSelection';
import { GradeInstructorView } from '../../model/GradeInstructorView';
import { CSVLink } from "react-csv";
import { CurriculumType } from '../../model/CurriculumType';
import { ReviewType } from '../../model/ReviewType';

interface InstructorProps {
    grades: GradeInstructorView[];
    regCodes: string[];
    curriculum: CurriculumType;
}


interface InstructorState {
}

class InstructorProfile extends React.Component<InstructorProps, InstructorState> {
    render() {
        if (!this.props.regCodes || !this.props.grades) return <Fragment />;
        const grade = this.props.grades.filter(item => item != null);
        const count = grade.length;
        const headers = [
            { label: "Course ID", key: "courseId" },
            { label: "Student Name", key: "username" },
            { label: "MC Grade", key: "mcGrade" },
            { label: "Email Response", key: "emailResponse" },
        ];
        return (
            <div className="report">
                <h1>Instructor Name: XYZ</h1>
                <RegCodeSelection />
                {this.props.regCodes && this.props.grades
                    && this.props.regCodes.map(regCode => {
                        return (
                            <div>
                                <CourseSelection regCode={regCode} />
                                <div>
                                    <Table style={{ width: 500, textAlign: "center" }}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Course ID</TableCell>
                                                <TableCell align="right">Student Name</TableCell>
                                                <TableCell align="right">MC Grade</TableCell>
                                                <TableCell align="right">Email Response</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                (count > 0) && grade && grade.map((g: GradeInstructorView) => (
                                                    <TableRow>
                                                        <TableCell component="th" scope="row">
                                                            {g.courseId}
                                                        </TableCell>
                                                        <TableCell component="th" scope="row">
                                                            {g.username}
                                                        </TableCell>
                                                        <TableCell align="right">{g.mcGrade}</TableCell>
                                                        <TableCell align="right">{g.emailResponse}</TableCell>
                                                    </TableRow>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        );
                    })
                }
                <CSVLink data={this.props.grades} headers={headers} filename={"FLP_class_grades.csv"}>
                    Download Grades
                </CSVLink>
                <LogOutButton />
            </div>
        );
    }
}

export default connect(state => {
    return {
        regCodes: regCodesSelector(state),
        grades: instructorGradesSelector(state),
        curriculum: curriculumSelector(state)
    };
})(InstructorProfile);