import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Grade } from '../../model/Grade';
import { textAlign } from '@material-ui/system';
import LogOutButton from '../LogOutButton';
import { connect } from 'react-redux';
import { gradesSelector } from '../../selectors';
import RegCodeSelection from './RegCodeSelection';

interface StudentProps {

}
interface StudentState {
  grades: Grade[];
}

class StudentProfile extends React.Component<StudentProps, StudentState> {
  constructor(props: StudentProps) {
    super(props);
    this.state = {
      grades: [],
    };
  }
  render() {
    return (
      <div className="report">
        <h1>Student Name: XYZ</h1>
        <RegCodeSelection />
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
        <LogOutButton />
      </div>
    );
  }
}

export default connect(
  state => {
    return {
      grades: gradesSelector(state),
    }
  }
)(StudentProfile);