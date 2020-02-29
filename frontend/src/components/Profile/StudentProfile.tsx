import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Grade } from '../../model/Grade';
import { textAlign } from '@material-ui/system';

interface StudentProps {

}
interface StudentState {
  grades: Grade[];
}

class StudentProfile extends React.Component<StudentProps, StudentState> {
  constructor(props: StudentProps) {
    super(props);
    this.state = {
      grades: [
        {
          studentUsername: 'abc',
          instructor: 'x',
          courseNumber: 1,
          courseGrade: 90
        },
        {
          studentUsername: 'abc',
          instructor: 'x',
          courseNumber: 2,
          courseGrade: 100
        },
        {
          studentUsername: 'abc',
          instructor: 'x',
          courseNumber: 3,
          courseGrade: 80
        },
        {
          studentUsername: 'abc',
          instructor: 'x',
          courseNumber: 4,
          courseGrade: 95
        },
        {
          studentUsername: 'abc',
          instructor: 'x',
          courseNumber: 5,
          courseGrade: 90
        },
        {
          studentUsername: 'abc',
          instructor: 'x',
          courseNumber: 6,
          courseGrade: 100
        },
      ],
    }
  }
  render() {
    return (
      <div className="report">
        <h1>Student Name: XYZ</h1>
        <Table style={{ width: 500, textAlign: "center" }}>
          <TableHead>
            <TableRow>
              <TableCell>Course Number</TableCell>
              <TableCell align="right">Your Grades</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.grades.map(row => (
              <TableRow key={row.courseNumber}>
                <TableCell component="th" scope="row">
                  {row.courseNumber}
                </TableCell>
                <TableCell align="right">{row.courseGrade}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <button id="logoff">Log Off</button>
      </div>
    );
  }
}

export default StudentProfile;