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
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import BookIcon from '@material-ui/icons/Book';
import SpeakerNotesIcon from '@material-ui/icons/SpeakerNotes';
import AccountBoxIcon from '@material-ui/icons/AccountBox';


class Header extends React.Component<React.Props<Header>, {}> {
    render() {
        return (
            <Router>
                <div className="header">
                    <div id="flp"><MonetizationOnIcon style={{ fontSize: 30, marginTop: 10, marginRight: 10 }} /><Link to="/">FLP</Link></div>
                    <div id="courseIcon"><BookIcon style={{ fontSize: 30, marginTop: 10, marginRight: 10 }} /><Link to="/course">Course</Link></div>
                    <div id="reviewIcon"><SpeakerNotesIcon style={{ fontSize: 30, marginTop: 10, marginRight: 10 }} /><Link to="/review">Review</Link></div>
                    <div id="profileIcon"><AccountBoxIcon style={{ fontSize: 30, marginTop: 10, marginRight: 10 }} /><Link to="/profile">Profile</Link></div>
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