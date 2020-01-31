import {
    Link,
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';
import React from 'react';
import Home from '../Home/Home';
import Course from '../Course/Course';
import Review from '../Review/Review';
import Profile from '../Profile/Profile';


class Header extends React.Component<React.Props<Header>, {}> {
    render() {
        return (
            <Router>
                <div className="header">
                    <div id="flp"><Link to="/">FLP</Link></div>
                    <div id="courseIcon"><Link to="/course">Course</Link></div>
                    <div id="reviewIcon"><Link to="/review">Review</Link></div>
                    <div id="profileIcon"><Link to="/profile">Profile</Link></div>
                </div>
                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route path="/course">
                        <Course />
                    </Route>
                    <Route path="/review">
                        <Review />
                    </Route>
                    <Route path="/profile">
                        <Profile />
                    </Route>
                </Switch>
            </Router>
        );
    }
}

export default Header;