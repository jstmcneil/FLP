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
import keyBy from 'lodash/keyBy';

interface ClassProps {
    id: number;
    courseName: string;
    path: string;
    regCode: string;
}

interface CourseProps extends RouteComponentProps {
    courses: CourseType[];
    regCodes: string[];
    curriculum: any;
}

const Class = (props: ClassProps): JSX.Element => {
    return (<div className="class">
        <div id="courseName">{props.courseName}</div>
        <div id="redirectClass"><Link to={{
            pathname: `${props.path}/${props.regCode}/${props.id}`,
        }}>Go To Course</Link></div>
    </div>);
}

const Course = (props: CourseProps): JSX.Element => {
    let { path, url } = useRouteMatch();
    if (!props.courses || !props.curriculum || !props.regCodes) return <Fragment />;
    const courses = keyBy(props.courses, "id");
    console.log(courses);
    return (
        <Switch>
            <Route exact path={path}>
                <div>
                    <div className="title">My Courses</div>
                    <div className="space"></div>
                    {
                        props.regCodes.map((key: string) => (
                            <div>
                                <div className="subtitle">RegCode: {key}</div>
                                {
                                    props.curriculum[key] && props.curriculum[key].courses.map((c: number[]) => {
                                        const course: any = courses[String(c)];
                                        return (<Class courseName={course.courseName} id={course.id} path={path} regCode={key} />)
                                    })
                                }
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
        }
    }
)(Course);