import React from 'react';
import Quiz from '../MC/Quiz';
import CourseEmailTextComponent from '../EmailTextBox';
import { RouteComponentProps } from 'react-router-dom';
import VideoPlayer from '../VideoPlayer';
import { connect } from 'react-redux';
import { loggedInSelector, accountIdSelector, usernameSelector } from '../../selectors';
import { ATTEMPT_SEND_EMAIL } from '../../actions/types';

interface PageProps extends RouteComponentProps<RouterProps> {
    loggedIn: boolean;
    accountId: string;
    username: string;
    sendEmailAction: Function;
}

interface RouterProps {
    id: string | undefined;
}

class CoursePage extends React.Component<PageProps> {
    constructor(props: PageProps) {
        super(props);
    }

    routeChange = () => {
        window.location.href = "/course";
    }

    render() {
        if (!this.props.loggedIn) {
            return <div>You are not logged in. Please login to access courses.</div>
        }
        const { accountId, username, sendEmailAction } = this.props;
        return (
            <div>
                <button id="back" onClick={this.routeChange}>Back to Courses</button>
                <div className="space"></div>
                <h2>Course {this.props.match.params.id}</h2>
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
        );
    }
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