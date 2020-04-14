import React, { Fragment } from 'react';
import Login from '../Login';
import Register from '../Register';
import StudentProfile from './StudentProfile';
import InstructorProfile from './InstructorProfile';
import { connect } from 'react-redux';
import { loggedInSelector, isInstructorSelector } from '../../selectors';
import { Typography } from '@material-ui/core';


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
            return <Fragment><Typography variant="h2">My Profile</Typography><InstructorProfile /></Fragment>;
        }
        return <Fragment><Typography variant="h2">My Profile</Typography><StudentProfile /></Fragment>
    }

    render() {
        return (
            // @ts-ignore
            <div style={{ "display": "flex", "flex-direction": "column" }}>
                <div style={{textAlign: "center"}}>
                    <div style={{display: "inline-block"}}>
                        {!this.props.loggedIn && <Login /> }
                        {!this.props.loggedIn && <Register /> }
                    </div> 
                </div>
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