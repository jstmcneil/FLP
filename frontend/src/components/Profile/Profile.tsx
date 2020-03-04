import React, { Fragment } from 'react';
import Login from '../Login';
import Register from '../Register';
import StudentProfile from './StudentProfile';
import InstructorProfile from './InstructorProfile';
import { connect } from 'react-redux';
import { loggedInSelector, isInstructorSelector } from '../../selectors';


interface ProfileProps {
    loggedIn: boolean;
    isInstructor: boolean;
}

class Profile extends React.Component<ProfileProps> {

    renderProfile(loggedIn: boolean, isInstructor: boolean) {
        if (!loggedIn) {
            return <Fragment />;
        }
        if (isInstructor) {
            return <Fragment><div className="title">My Profile</div><InstructorProfile /></Fragment>;
        }
        return <Fragment><div className="title">My Profile</div><StudentProfile /></Fragment>
    }

    render() {
        return (
            // @ts-ignore
            <div style={{ "display": "flex", "flex-direction": "column" }}>
                {!this.props.loggedIn && <Login /> }
                {!this.props.loggedIn && <Register /> }
                {this.renderProfile(this.props.loggedIn, this.props.isInstructor)}
            </div>
        );
    }
}

export default connect(state => {
    return {
        loggedIn: loggedInSelector(state),
        isInstructor: isInstructorSelector(state)
    }
})(Profile);