import React from 'react';
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

interface ClassProps {
    id: string;
    courseName: string;
    percent: number;
    color: string;
}

const Class = (props: ClassProps): JSX.Element => {
    return (<div className="class">
        <div id="courseName">{props.courseName}</div>
        <div id="percentage" style={{ backgroundColor: props.color }}>
            {props.percent + "%"}
        </div>
        <div><Link to={`/courses/${props.id}`}>Go To Course</Link></div>
    </div>);
}

const Course = (props: RouteComponentProps): JSX.Element => {
    let { path } = useRouteMatch();
    return (
    <div>
        <Switch>
            <Route path={`${path}/:id`} component={CoursePage} />
            <Route exact path={path}>
                <div>
                    <div className="title">My Courses</div>
                    <Class courseName="Personal Finance" percent={10} color="yellow" id="1"/>
                    <Class courseName="Offer Letter" percent={30} color="pink" id="2"/>
                </div>
            </Route>
        </Switch>
    </div>
    );
}

export default Course;