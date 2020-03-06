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
import { courseSelector } from '../../selectors/index';

interface ClassProps {
    id: number;
    courseName: CourseType;
    path: string;
}

interface CourseProps extends RouteComponentProps {
    courses: CourseType[];
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
    if (!props.courses) return <Fragment />;
    return (
        <Switch>
            <Route exact path={path}>
                <div>
                    <div className="title">My Courses</div>
                    {props.courses.map((c, index) => (
                        <Class courseName={c} id={c.id} path={path} />
                    ))}
                </div>
            </Route>
            <Route path={`${path}/:courseId`} render={(props) => <CoursePage {...props} />} />
        </Switch>
    );
}

export default connect(
    state => {
        return {
            courses: courseSelector(state)
        }
    }
)(Course);