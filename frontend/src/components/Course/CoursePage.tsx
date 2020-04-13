import React, { useState } from 'react';
import Quiz from '../MC/Quiz';
import CourseEmailTextComponent from '../EmailTextBox';
import { useParams, RouteComponentProps } from 'react-router-dom';
import VideoPlayer from '../VideoPlayer';
import { connect } from 'react-redux';
import { loggedInSelector, accountIdSelector, usernameSelector, coursesSelector, gradesSelector, answerSelector } from '../../selectors';
import { GET_ANSWERS } from '../../actions/types';
import keyBy from 'lodash/keyBy';
import { Video, CourseType } from '../../model/CourseType';
import TakeQuiz from './TakeQuiz';
import { Typography, isWidthDown } from '@material-ui/core';
import { Paper } from '@material-ui/core';
import { Grade } from '../../model/Grade';
import AutoSizer from 'react-virtualized-auto-sizer';

interface PageProps extends RouteComponentProps {
    loggedIn: boolean;
    courses: CourseType[];
    grades: Grade[];
    answers: any;
    viewAnswerAction: Function;
}

const hasQuizBeenTaken = (grades: Grade[], courseId: string, regCode: string): boolean =>
    grades.filter(grade => grade.courseId === courseId && grade.regCode === regCode).length > 0;

const CoursePage = (props: PageProps): JSX.Element => {
    const { courseId, regCode } = useParams();
    const [calledViewAnswers, setViewAnswers] = useState(false);
    if (!props.loggedIn || !props.courses || !props.grades || regCode === undefined || courseId === undefined) {
        return <Typography variant="body1">
            You are not able to access this material. Please make sure to login to access courses, and refresh if login is still valid.
        </Typography>
    }
    if (!calledViewAnswers) {
        props.viewAnswerAction(regCode,courseId);
        setViewAnswers(true);
    }
    const courses = keyBy(props.courses, "id");
    const course = courses[courseId || ""];
    const quizTaken = hasQuizBeenTaken(props.grades, courseId, regCode);
    if (quizTaken && props.answers === "outstanding_version") {
        alert('There is an outstanding instance of this course'
            +  'to be taken in a different registration code. Please '
            + 'take that before trying to view answers.');
        document.location.href='/course';
    }
    return (
        <AutoSizer>
            {({ width }) => {
                return (
                    <div className="verticalContainer" style={{ margin: "10px", width: width }}>
                        <Typography variant="h2">Course {course.id}</Typography>
                        <div style={{ marginBottom: "10px" }}>
                            <Paper elevation={3} style={{ padding: "10px" }}>
                                <Typography variant="h3">Summary of Information</Typography>
                                <div style={{ textAlign: "left" }}>
                                    <Typography variant="body1" style={{ overflowWrap: "break-word", margin: "10px" }}>{course.summaryText}</Typography>
                                </div>
                            </Paper>
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <Paper elevation={3} style={{ padding: "10px", width: "inherit" }}>
                                <Typography variant="h3">Videos</Typography>
                                <div style={{ overflowY: "scroll", width: "inherit" }}>
                                    {course.summaryVideo.map((video: Video) => (
                                        <div style={{ marginTop: "10px", marginBottom: "10px", width: "inherit" }}>
                                            <VideoPlayer videoId={video.id} width={width - 20}/>
                                        </div>
                                    ))}
                                </div>
                            </Paper>
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <Paper elevation={3} style={{ padding: "10px" }}>
                                <Typography variant="h3">Quiz</Typography>
                                <TakeQuiz regCode={regCode} courseId={course.id} />
                            </Paper>
                        </div>

                    </div>
                )
            }

            }
        </AutoSizer>
    )
}

export default connect(
    state => {
        return {
            answers: answerSelector(state),
            grades: gradesSelector(state),
            courses: coursesSelector(state),
            loggedIn: loggedInSelector(state)
        }
    },
    dispatch => {
        return {
            viewAnswerAction: (regCode: string, courseId: string) => dispatch({ type: GET_ANSWERS, payload: { regCode, courseId } })
        }
    }
)(CoursePage);