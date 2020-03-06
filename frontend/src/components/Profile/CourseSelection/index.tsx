import React, { Fragment } from 'react';
import { Checkbox } from '@material-ui/core';
import { curriculumSelector, coursesSelector } from '../../../selectors';
import { SET_CURRICULUM } from '../../../actions/types';
import { connect } from 'react-redux';

interface CourseSelectionProps {
    regCode: string;
    curriculum: any;
    courses: any;
    setCurriculumAction: Function;
}

type CourseIdChanges = {[id: number]: boolean};

interface CourseSelectionState {
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

class CourseSelection extends React.Component<CourseSelectionProps, CourseSelectionState> {
    constructor(props: CourseSelectionProps) {
        super(props);
        this.state = {
            courseIdChanges: {}
        };
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
        if (!this.props.regCode || !this.props.curriculum || !this.props.courses || !this.props.setCurriculumAction) {
            return <Fragment />;
        }
        return (
            <div>
                <div>Registration Code: {this.props.regCode}</div>
                {this.renderRegCodeCourseSelection(this.props.curriculum[this.props.regCode].courses, this.props.courses, this.props.regCode)}
            </div>
        )
    }
};

export default connect(state => {
    return {
        curriculum: curriculumSelector(state),
        courses: coursesSelector(state)
    }
}, dispatch => {
    return {
        setCurriculumAction: (courseIds: number[], regCode: string) => dispatch({type: SET_CURRICULUM, payload: { courseIds, regCode }})
    }
})(CourseSelection);
