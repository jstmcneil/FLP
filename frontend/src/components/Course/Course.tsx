import React from 'react';
import Class from './Class';
import {
    Link,
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from 'react-router-dom';
import Quiz from '../MC/Quiz';
import { EmailTextComponent } from '../EmailTextBox';

class Course extends React.Component {

    render() {
        return (
            <div>
                <div className="title">My Courses</div>
                <Class courseName="Personal Finance" percent={10} color="yellow" id="1"/>
                <Class courseName="Offer Letter" percent={30} color="pink" id="2"/>
            </div>
        );
    }
}

export default Course;