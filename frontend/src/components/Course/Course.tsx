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
    path: string;
}

const Class = (props: ClassProps): JSX.Element => {
    return (<div className="class">
        <div id="courseName">{props.courseName}</div>
        <div id="percentage" style={{ backgroundColor: props.color }}>
            {props.percent + "%"}
        </div>
        <div><Link to={`${props.path}/${props.id}`}>Go To Course</Link></div>
    </div>);
}

const Course = (props: RouteComponentProps): JSX.Element => {
    let { path, url } = useRouteMatch();
    console.log(path);
    return (
        <Switch>
            <Route exact path={path}>
                <div>
                    <div className="title">My Courses</div>
                    <Class courseName="Personal Finance" percent={10} color="yellow" id="1" path={path}/>
                    <Class courseName="Offer Letter" percent={30} color="pink" id="2" path={path}/>
                </div>
            </Route>
            <Route path={`${path}/:courseId`} component={CoursePage} />
        </Switch>
    );
}

export default Course;