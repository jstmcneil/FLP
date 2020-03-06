import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import { Grade } from '../../model/Grade';
import { TableHead, Checkbox } from '@material-ui/core';
import LogOutButton from '../LogOutButton';
import { connect } from 'react-redux';
import { regCodesSelector, curriculumSelector, coursesSelector } from '../../selectors';
import { SET_CURRICULUM } from '../../actions/types';

interface InstructorProps {
    regCodes: string[];
    curriculum: any;
    courses: any;
    setCurriculumAction: Function;
}

type CourseIdChanges = {[id: number]: boolean};

interface InstructorState {
    reports: Grade[];
    courseIdChanges: CourseIdChanges;
}

const applyCheckboxChanges = (originalCourseIds: number[], courseIdChanges: CourseIdChanges): number[] => {
    let courseIds: number[] = [];
    originalCourseIds.forEach(courseId => {
        courseIds.push(courseId);
    })
    Object.keys(courseIdChanges).forEach(id => {
        const idAsNumber = parseInt(id);
        const idInOriginalCourseIds = originalCourseIds.indexOf(idAsNumber);
        if (courseIdChanges[idAsNumber] && idInOriginalCourseIds < 0) {
            courseIds.push(idAsNumber);
        } else if (!courseIdChanges[idAsNumber] && idInOriginalCourseIds >= 0) {
            courseIds.splice(idInOriginalCourseIds, 1);
        }
    });
    return courseIds;
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
            courseIdChanges: {}
        }
    }

    onCheckBoxChanged(_: React.ChangeEvent<HTMLInputElement>, checked: boolean, id: number) {
        this.state.courseIdChanges[id] = checked;
    }

    renderRegCodeCourseSelection(curriculumForRegCode: number[], allCourses: any, currRegCode: string) {
        return (
            <div>
                {
                allCourses.map((course: any): JSX.Element => {
                    return (
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <div>{course.courseName}</div>
                            <Checkbox 
                                id={`checkbox-${course.id}-${course.courseName}-${currRegCode}`} 
                                onChange={(event, checked) => this.onCheckBoxChanged(event, checked, course.id)} 
                                defaultChecked={curriculumForRegCode.includes(course.id)}
                            />
                        </div>
                    )
                })
            }
            <button onClick={() => 
                this.props.setCurriculumAction(
                    applyCheckboxChanges(curriculumForRegCode, 
                        this.state.courseIdChanges),
                    currRegCode)}>
                Set Course Selection
            </button>
            </div>
        );
    }

    render() {
        let validData = this.state.reports;
        return (
            <div className="report">
                <h1>Instructor Name: XYZ</h1>
                <LogOutButton />
                { this.props.curriculum 
                    && this.props.courses
                    && this.props.regCodes
                    && this.props.regCodes.map(regCode => {
                        return (
                        <div>
                            <div>
                                <div>Registration Code: {regCode}</div>
                                {this.renderRegCodeCourseSelection(this.props.curriculum.courses, this.props.courses, regCode)}
                            </div>
                            <div>
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
                            </div>
                        </div>
                        );
                    })
                }

            </div>
        );
    }
}

export default connect(state => {
    return {
        regCodes: regCodesSelector(state),
        curriculum: curriculumSelector(state),
        courses: coursesSelector(state)
    }
}, dispatch => {
    return {
        setCurriculumAction: (courseIds: number[], regCode: string) => dispatch({type: SET_CURRICULUM, payload: { courseIds, regCode }})
    }
})(InstructorProfile);