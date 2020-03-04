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
import { connect } from 'react-redux';
import { SETUP_APP } from '../../actions/types';
import { loggedInSelector, isInstructorSelector } from '../../selectors';

interface HeaderProps extends React.Props<Header> {
    setUpAction: Function;
    loggedIn: boolean;
    isInstructor: boolean;
}

class Header extends React.Component<HeaderProps, {}> {
    public componentDidMount() {
        this.props.setUpAction();
    }

    render() {
        return (
            <Router>
                <div className="header">
                    <div id="flp"><MonetizationOnIcon style={{ fontSize: 30, marginTop: 10, marginRight: 10 }} /><Link to="/">FLP</Link></div>
                    { this.props.loggedIn && !this.props.isInstructor && <div id="courseIcon"><BookIcon style={{ fontSize: 30, marginTop: 10, marginRight: 10 }} /><Link to="/course">Course</Link></div>}
                    <div id="profileIcon"><AccountBoxIcon style={{ fontSize: 30, marginTop: 10, marginRight: 10 }} /><Link to="/profile">Profile</Link></div>
                </div>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/course" component={Course} />
                    <Route path="/review" component={Review} />
                    <Route path="/profile" component={Profile} />
                </Switch>
            </Router>
        );
    }
}

export default connect(
    state => {
        return {
            loggedIn: loggedInSelector(state),
            isInstructor: isInstructorSelector(state)
        }
    },
    dispatch => {
        return {
            setUpAction: () => dispatch({ type: SETUP_APP })
        }
})(Header);