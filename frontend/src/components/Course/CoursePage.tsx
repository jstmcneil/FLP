import React from 'react';
import Quiz from '../MC/Quiz';
import CourseEmailTextComponent from '../EmailTextBox';
import { useParams, RouteComponentProps } from 'react-router-dom';
import VideoPlayer from '../VideoPlayer';
import { connect } from 'react-redux';
import { loggedInSelector, accountIdSelector, usernameSelector, coursesSelector } from '../../selectors';
import { ATTEMPT_SEND_EMAIL } from '../../actions/types';
import keyBy from 'lodash/keyBy';
import { Video, CourseType } from '../../model/CourseType';
import TakeQuiz from './TakeQuiz';

interface PageProps extends RouteComponentProps {
    loggedIn: boolean;
    courses: CourseType[];
}
const CoursePage = (props: PageProps): JSX.Element => {
    const { courseId, regCode } = useParams();
    if (!props.loggedIn || !props.courses || regCode === undefined || courseId === undefined) {
        return <div>You are not logged in. Please login to access courses.</div>
    }
    const courses = keyBy(props.courses, "id");
    const course = courses[courseId || ""];
    return (
        <div>
            <div className="space"></div>
            <h2>Course {course.id}</h2>
            <div>{course.summaryText}</div>
            {course.summaryVideo.map((video: Video) => (
                <VideoPlayer videoId={video.id} />
            ))}
            <div>Quiz</div>
            <TakeQuiz regCode={regCode} courseId={course.id} />
        </div>
    )
}

export default connect(
    state => {
        return {
            courses: coursesSelector(state),
            loggedIn: loggedInSelector(state)
        }
    },
    dispatch => {
        return {

        }
    }
)(CoursePage);