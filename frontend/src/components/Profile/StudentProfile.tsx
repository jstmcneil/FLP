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
import { gradesSelector, regCodesSelector, courseSelector, usernameSelector } from '../../selectors';
import RegCodeSelection from './RegCodeSelection';
import keyBy from 'lodash/keyBy';
import { CourseType, EmailType } from '../../model/CourseType';
import { Paper, Typography } from '@material-ui/core';

interface StudentProps {
  grades: Grade[];
  regCodes: string[];
  courses: CourseType[];
  username: string;
}
interface StudentState {

}

export const getEmailQuestion = (courses: CourseType[], obj: {courseId: string, emailResponse: string}): string => {
  const arr: EmailType[] | undefined = courses.find(course => course.id === obj.courseId)?.quiz.emailQuestions;
  if (!arr || arr.length === 0) {
    return obj.emailResponse;
  }
  return arr[0].questionContent + ": " + obj.emailResponse;
}

class StudentProfile extends React.Component<StudentProps, StudentState> {
  render() {
    var dict = Object();
    if (!this.props.regCodes || !this.props.grades || !this.props.courses) return <Fragment />;
    this.props.regCodes.forEach((key) => {
      var arr = this.props.grades.filter((g) => g != null && g.regCode == key);
      dict[key] = arr;
    })
    return (
      <div className="report">
        <Typography variant="h6">Student Name: {this.props.username}</Typography>
        <RegCodeSelection />
        <Typography variant="h3" style={{ marginTop: "50px" }}>Grades</Typography>
        {
          this.props.regCodes.map((key) => (
            <Paper style={{ padding: "15px", margin: "10px", backgroundColor: "#73C2FB" }}>
              <Typography variant="h4">{key}</Typography>
              <Paper elevation={3} style={{ margin: "15px", padding: "10px" }}>
                <div className="verticalContainer" style={{ textAlign: "left" }}>
                  <Table style={{ width: 500, textAlign: "left" }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Course Name</TableCell>
                        <TableCell align="right">Your Grades</TableCell>
                        <TableCell align="right">Open Ended Question</TableCell>
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
                            <TableCell align="right">{getEmailQuestion(this.props.courses, obj)}</TableCell>
                          </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                </div>
              </Paper>
            </Paper>
          ))}
      </div>
    );
  }
}

export default connect(
  state => {
    return {
      username: usernameSelector(state),
      grades: gradesSelector(state),
      regCodes: regCodesSelector(state),
      courses: courseSelector(state)
    }
  }
)(StudentProfile);