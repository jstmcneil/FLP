import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import { Grade } from '../../model/Grade';
import { TableHead } from '@material-ui/core';

interface InstructorProps {

}

interface InstructorState {
    reports: Grade[];
    coursesEnrolled: number[];
}

class InstructorProfile extends React.Component<InstructorProps, InstructorState> {
    constructor(props: InstructorProps) {
        super(props);
        const s1: Grade = {
            studentUsername: 'abc',
            instructor: 'x',
            courseNumber: 1,
            courseGrade: 90
        }
        const s2: Grade = {
            studentUsername: 'abc',
            instructor: 'x',
            courseNumber: 2,
            courseGrade: 100
        }
        const s3: Grade = {
            studentUsername: 'abc',
            instructor: 'x',
            courseNumber: 3,
            courseGrade: 80
        }
        const s4: Grade = {
            studentUsername: 'abc',
            instructor: 'x',
            courseNumber: 4,
            courseGrade: 95
        }
        this.state = {
            reports: [s1, s2, s3, s4],
            coursesEnrolled: [1, 2]
        }
    }
    render() {
        let allow = this.state.coursesEnrolled;
        let validData = this.state.reports.filter(function (r) {
            return allow.includes(r.courseNumber);
        });
        return (
            <div className="report">
                <h1>Instructor Name: XYZ</h1>
                <Table style={{ width: 500, textAlign: "center" }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Course Number</TableCell>
                            <TableCell align="right">Student Name</TableCell>
                            <TableCell align="right">Student Grade</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {validData.map(d => (
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    {d.courseNumber}
                                </TableCell>
                                <TableCell align="right">{d.studentUsername}</TableCell>
                                <TableCell align="right">{d.courseGrade}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <button id="logoff">Log Off</button>
            </div>
        );
    }
}

export default InstructorProfile;