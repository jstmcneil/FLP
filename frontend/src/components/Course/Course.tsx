import React, { Fragment } from 'react';
import {
    Link,
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    RouteComponentProps,
    useRouteMatch
} from 'react-router-dom';
import CoursePage from './CoursePage';
import { CourseType } from '../../model/CourseType';
import { connect } from 'react-redux';
import { courseSelector, regCodesSelector, curriculumSelector, isInstructorSelector, loggedInSelector, gradesSelector } from '../../selectors/index';
import keyBy from 'lodash/keyBy';
import { CurriculumType } from '../../model/CurriculumType';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Grade } from '../../model/Grade';
import { Typography } from '@material-ui/core';
import { Paper } from '@material-ui/core'
// @ts-ignore
import randomColor from "randomcolor";

interface ClassProps {
    id: string;
    courseName: string;
    path: string;
    regCode: string;
    classFinished: boolean;
}

interface CourseProps extends RouteComponentProps {
    courses: CourseType[];
    regCodes: string[];
    curriculum: CurriculumType;
    isInstructor: boolean;
    loggedIn: boolean;
    grades: Grade[];
}

// doesn't have to be perfectly unique,
// just want to obtain same color for a given word and don't want it to be same all the time
const colorForClass = (courseName: string) => {
    let seed = 0;
    for (let i = 0; i < courseName.length; i++) {
        seed += courseName.charCodeAt(i);
    }
    return randomColor({ seed, luminosity: 'light' });
}

const Class = (props: ClassProps): JSX.Element => {
    return (
        <div style={{
            display: "grid",
            gridTemplateRows: "1fr 1fr 1fr",
            gridTemplateColumns: "1fr 1fr 1fr",
            border: "1px solid black",
            marginRight: "10px",
            marginBottom: "10px",
            marginTop: "10px",
            borderRadius: "10px",
            minWidth: "250px",
        }}>
            <div style={{ gridArea: "1 / 1 / 1 / 4", backgroundColor: colorForClass(props.courseName), borderRadius: "10px 10px 0px 0px", textAlign: "center" }}><Typography variant="body1">{props.courseName}</Typography></div>
            <div style={{ gridArea: "3 / 3 / 3 / 4" }}>
                <Link to={{
                    pathname: `${props.path}/${props.regCode}/${props.id}`,
                }}>
                    <div>
                        <div style={{ width: "wrap-content", textAlign: "center" }}>
                            {props.classFinished ? <RadioButtonUncheckedIcon color="primary" /> : <CheckCircleIcon color="primary" />}
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}

const gradeExists = (grades: Grade[], regCode: string, courseId: string) => {
    console.log(grades);
    console.log(regCode, courseId, grades.filter(grade => grade.regCode === regCode && grade.courseId === courseId));
    return grades.filter(grade => grade.regCode === regCode && grade.courseId === courseId).length === 0;
}

const Course = (props: CourseProps): JSX.Element => {
    let { path, url } = useRouteMatch();
    if (!props.courses || !props.curriculum || !props.regCodes || !props.grades) return <Fragment />;
    if (props.loggedIn && props.isInstructor) return <div></div>;
    const courses = keyBy(props.courses, "id");
    return (
        <Switch>
            <Route exact path={path}>
                <div className="verticalContainer">
                    <div className="title">My Courses</div>
                    {
                        props.regCodes.map((key: string) => (
                            <div className="verticalContainer" style={{ margin: "20px" }}>
                                <Paper elevation={3}>
                                    <div style={{padding: "15px"}}>
                                        <div style={{ textAlign: "left" }}>
                                            <Typography variant="h4">{key}</Typography>
                                        </div>
                                        <div style={{ textAlign: "left" }}>
                                            {
                                                (props.curriculum[key] && props.curriculum[key].courses.length > 0) ?
                                                    <div className="horizontalContainer" style={{ flexWrap: "wrap" }}>
                                                        {props.curriculum[key] && props.curriculum[key].courses.map((c: number) => {
                                                            const course: CourseType = courses[String(c)];
                                                            return (<Class courseName={course.courseName} id={course.id} path={path} regCode={key} classFinished={gradeExists(props.grades, key, course.id)} />)
                                                        })}
                                                    </div> :
                                                    <Typography variant="body1">No courses found for registration code {key}.</Typography>
                                            }
                                        </div>
                                    </div>
                                </Paper>

                            </div>
                        ))
                    }
                </div>
            </Route>
            <Route path={`${path}/:regCode/:courseId`} render={(props) => <CoursePage {...props} />} />
        </Switch>
    );
}

export default connect(
    state => {
        return {
            courses: courseSelector(state),
            regCodes: regCodesSelector(state),
            curriculum: curriculumSelector(state),
            isInstructor: isInstructorSelector(state),
            loggedIn: loggedInSelector(state),
            grades: gradesSelector(state)
        }
    }
)(Course);