import React from 'react';
import Quiz from '../MC/Quiz';
import CourseEmailTextComponent from '../EmailTextBox';
import { useParams } from 'react-router-dom';
import VideoPlayer from '../VideoPlayer';
import { connect } from 'react-redux';
import { loggedInSelector, accountIdSelector, usernameSelector } from '../../selectors';
import { ATTEMPT_SEND_EMAIL } from '../../actions/types';

interface PageProps {
    loggedIn: boolean;
    accountId: string;
    username: string;
    sendEmailAction: Function;
}
const CoursePage = (props: PageProps) => {
    const { courseId } = useParams();
    if (!props.loggedIn) {
        return <div>You are not logged in. Please login to access courses.</div>
    }
    console.log("CoursePage");
    const { accountId, username, sendEmailAction } = props;
    return (
        <div>
                <div className="space"></div>
                <h2>Course {courseId}</h2>
                <div>Summary of Text</div>
                <div id="placeholder"></div>
                <div>Quiz Title</div>
                <div id="placeholder"></div>
                <div>Video Example</div>
                <VideoPlayer videoId="jNQXAC9IVRw"/>
                <Quiz />
                <div className="space"></div>
                <CourseEmailTextComponent accountId={accountId} questionName={"example"} username={username} courseName={"courseName"} sendEmailAction={sendEmailAction}/>
            </div>
    )
}

export default connect(
    state => {
        return {
            loggedIn: loggedInSelector(state),
            accountId: accountIdSelector(state),
            username: usernameSelector(state),
        }
    },
    dispatch => {
        return {
            sendEmailAction: (accountId: string, emailSubject: string, emailBody: string) => dispatch({type: ATTEMPT_SEND_EMAIL, payload: {accountId, emailSubject, emailBody}})
        }
    }
)(CoursePage);