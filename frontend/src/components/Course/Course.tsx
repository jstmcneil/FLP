import React from 'react';
import Class from './Class';
import {
    Link,
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';
import Quiz from '../MC/Quiz';
import { EmailTextComponent } from '../EmailTextBox';

class Course extends React.Component {
    render() {
        return (
            <div>
                <Router>
                    <div className="title">My Courses</div>
                    <Link to="course1"><Class courseName="Personal Finance" percent={10} /></Link>
                    <Link to="course2"><Class courseName="Offer Letter" percent={30} /></Link>
                    <Switch>
                        <Route exact path="/course1">
                            <Quiz />
                        </Route>
                        <Route path="/course2">
                            <EmailTextComponent professor="john"/>
                        </Route>
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default Course;