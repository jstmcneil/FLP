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
import { courseSelector, regCodesSelector, curriculumSelector } from '../../selectors/index';

interface ClassProps {
    id: number;
    courseName: CourseType;
    path: string;
}

interface CourseProps extends RouteComponentProps {
    courses: CourseType[];
    regCodes: string[];
    curriculum: any;
}

const Class = (props: ClassProps): JSX.Element => {
    return (<div className="class">
        <div id="courseName">{props.courseName.id}</div>
        <div id="redirectClass"><Link to={{
            pathname: `${props.path}/${props.id}`,
            state: {
                data: props.courseName
            }
        }}>Go To Course</Link></div>
    </div>);
}

const Course = (props: CourseProps): JSX.Element => {
    let { path, url } = useRouteMatch();
    if (!props.courses || !props.curriculum) return <Fragment />;
    let myMap = new Map();
    for (var k in props.curriculum) {
        if (props.curriculum.hasOwnProperty(k) && props.regCodes.includes(k)) {
            myMap.set(k, props.curriculum[k].courses);
        }
    }
    let keys: string[] = [];
    let vals: CourseType[][] = [];
    myMap.forEach((value: string[], key: string) => {
        let validCourse: CourseType[] = [];
        value.forEach(v => {
            props.courses.forEach(c => {
                if (c.id === +v) {
                    validCourse.push(c);
                }
            })
        })
        keys.push(k);
        vals.push(validCourse);
    });
    return (
        <Switch>
            <Route exact path={path}>
                <div>
                    <div className="title">My Courses</div>
                    <div className="space"></div>
                    {
                        keys.map((key: string, index: number) => (
                            <div>
                                <div className="subtitle">RegCode: {key}</div>
                                {
                                    vals[index].map((c) => (
                                        <Class courseName={c} id={c.id} path={path} />
                                    ))
                                }
                            </div>
                        ))
                    }
                </div>
            </Route>
            <Route path={`${path}/:courseId`} render={(props) => <CoursePage {...props} />} />
        </Switch>
    );
}

export default connect(
    state => {
        return {
            courses: courseSelector(state),
            regCodes: regCodesSelector(state),
            curriculum: curriculumSelector(state),
        }
    }
)(Course);