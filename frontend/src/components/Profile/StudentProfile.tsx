import React, { Fragment } from 'react';
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
import { gradesSelector, regCodesSelector } from '../../selectors';
import RegCodeSelection from './RegCodeSelection';
import keyBy from 'lodash/keyBy';

interface StudentProps {
  grades: Grade[];
  regCodes: string[];
}
interface StudentState {

}

class StudentProfile extends React.Component<StudentProps, StudentState> {
  render() {
    var dict = Object();
    if (!this.props.regCodes || !this.props.grades) return <Fragment />;
    this.props.regCodes.forEach((key) => {
      var arr = this.props.grades.filter((g) => g != null && g.regCode == key);
      dict[key] = arr;
    })
    return (
      <div className="report">
        <h1>Student Name: XYZ</h1>
        <RegCodeSelection />
        {
          this.props.regCodes.map((key) => (
            <div>
              <div className="subtitle">RegCode: {key}</div>
              <Table style={{ width: 500, textAlign: "center" }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Course Number</TableCell>
                    <TableCell align="right">Your Grades</TableCell>
                    <TableCell align="right">Email Response</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    dict[key].map((obj: Grade) => (
                      <TableRow key={obj.courseId}>
                        <TableCell component="th" scope="row">
                          {obj.courseId}
                        </TableCell>
                        <TableCell align="right">{obj.mcGrade}</TableCell>
                        <TableCell align="right">{obj.emailResponse}</TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
              <div className="space"></div>
            </div>
          ))}
        <LogOutButton />
      </div>
    );
  }
}

export default connect(
  state => {
    return {
      grades: gradesSelector(state),
      regCodes: regCodesSelector(state),
    }
  }
)(StudentProfile);