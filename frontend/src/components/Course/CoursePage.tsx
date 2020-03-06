import React from 'react';
import Quiz from '../MC/Quiz';
import CourseEmailTextComponent from '../EmailTextBox';
import { useParams, RouteComponentProps } from 'react-router-dom';
import VideoPlayer from '../VideoPlayer';
import { connect } from 'react-redux';
import { loggedInSelector, accountIdSelector, usernameSelector } from '../../selectors';
import { ATTEMPT_SEND_EMAIL } from '../../actions/types';
import { Video } from '../../model/Video';
import { EmailType } from '../../model/EmailType';

interface PageProps extends RouteComponentProps {
    loggedIn: boolean;
    accountId: string;
    username: string;
    sendEmailAction: Function;
}
const CoursePage = (props: PageProps): JSX.Element => {
    var { data }: any = props.location.state;
    const { courseId } = useParams();
    console.log(data)
    if (!props.loggedIn) {
        return <div>You are not logged in. Please login to access courses.</div>
    }
    console.log("CoursePage");
    const { accountId, username, sendEmailAction } = props;
    return (
        <div>
            <div className="space"></div>
            <h2>Course {courseId}</h2>
            <div>{data.summaryText}</div>
            {data.summaryVideo.map((video: Video) => (
                <VideoPlayer videoId={video.id} />
            ))}
            <div>Multiple Choice Quiz</div>
            <Quiz questions={data.quiz.mcQuestions} />
            <div>Short Answer</div>
            {data.quiz.emailQuestions.map((emailQ: EmailType) => (
                <div>
                    <div>{emailQ.questionContent}</div>
                    <CourseEmailTextComponent accountId={accountId} questionName={"example"} username={username} courseName={"courseName"} sendEmailAction={sendEmailAction} />
                </div>
            ))}
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
            sendEmailAction: (accountId: string, emailSubject: string, emailBody: string) => dispatch({ type: ATTEMPT_SEND_EMAIL, payload: { accountId, emailSubject, emailBody } })
        }
    }
)(CoursePage);