import React, { useState } from 'react';
import Quiz from '../MC/Quiz';
import CourseEmailTextComponent from '../EmailTextBox';
import { useParams, RouteComponentProps } from 'react-router-dom';
import VideoPlayer from '../VideoPlayer';
import { connect } from 'react-redux';
import { loggedInSelector, accountIdSelector, usernameSelector, coursesSelector, gradesSelector, answerSelector, curriculumSelector } from '../../selectors';
import { GET_ANSWERS } from '../../actions/types';
import keyBy from 'lodash/keyBy';
import { Video, CourseType } from '../../model/CourseType';
import TakeQuiz from './TakeQuiz';
import { Typography, isWidthDown } from '@material-ui/core';
import { Paper } from '@material-ui/core';
import { Grade } from '../../model/Grade';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useLocation } from 'react-router-dom'
import {
    Link,
    Route,
    Switch,
    useRouteMatch
} from 'react-router-dom';
import Review from '../Review/Review'
import get from 'lodash/get';
import { CurriculumType } from '../../model/CurriculumType';

interface ReviewProps {
    id: string;
    regCode: string;
    courseName: string;
}

const Review_Button = (props: ReviewProps): JSX.Element => {
    let { path, url } = useRouteMatch();
    return (
        <Link to={{
            pathname: `${url}/review`,
        }}>
            <div style={{
                display: "grid",
                border: "1px solid black",
                marginRight: "10px",
                paddingLeft: "10px",
                marginBottom: "10px",
                marginTop: "10px",
                borderRadius: "10px",
            }}>
                <h3> Click here to review {props.courseName}! </h3>
            </div>
        </Link>
    );
}


interface PageProps extends RouteComponentProps {
    loggedIn: boolean;
    courses: CourseType[];
    curriculum: CurriculumType;
    grades: Grade[];
    answers: any;
    viewAnswerAction: Function;
}

const hasQuizBeenTaken = (grades: Grade[], courseId: string, regCode: string): boolean =>
    grades.filter(grade => grade.courseId === courseId && grade.regCode === regCode).length > 0;

const CoursePage = (props: PageProps): JSX.Element => {
    let { path, url } = useRouteMatch();
    const { courseId, regCode } = useParams();
    const [calledViewAnswers, setViewAnswers] = useState(false);
    if (!props.loggedIn || !props.courses || !props.grades || !props.curriculum || regCode === undefined || courseId === undefined) {
        return <Typography variant="body1">
            You are not able to access this material. Please make sure to login to access courses, and refresh if login is still valid.
        </Typography>
    }
    if (!get(props.curriculum, [regCode, "courses"], [] as string[]).find(course => course === courseId)) {
        return <Typography variant="body1">
            You do not have access to this material. Please make sure you are in a valid enrollment.
        </Typography>
    }

    if (!calledViewAnswers) {
        props.viewAnswerAction(regCode, courseId);
        setViewAnswers(true);
    }
    const courses = keyBy(props.courses, "id");
    const course = courses[courseId || ""];
    const quizTaken = hasQuizBeenTaken(props.grades, courseId, regCode);
    if (quizTaken && props.answers === "outstanding_version") {
        alert('There is an outstanding instance of this course'
            + 'to be taken in a different registration code. Please '
            + 'take that before trying to view answers.');
        document.location.href = '/course';
    }
    return (
        <Switch>
            <Route exact path={`${url}/review`} render={(props) => <Review regCode={regCode} courseId={courseId} />} />
            <Route exact path={path}>
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
                                                    <VideoPlayer videoId={video.id} width={width - 20} />
                                                </div>
                                            ))}
                                        </div>
                                    </Paper>
                                </div>
                                <div style={{ marginBottom: "10px" }}>
                                    <Paper elevation={3} style={{ padding: "1   0px" }}>
                                        <Typography variant="h3">Quiz</Typography>
                                        <TakeQuiz regCode={regCode} courseId={course.id} />
                                    </Paper>
                                </div>
                                {props.answers && props.answers !== "course_not_taken" && <Review_Button courseName={course.courseName} regCode={regCode} id={courseId} />}
                            </div>
                        )
                    }

                    }
                </AutoSizer>
            </Route>
        </Switch>
    )
}

export default connect(
    state => {
        return {
            answers: answerSelector(state),
            grades: gradesSelector(state),
            courses: coursesSelector(state),
            loggedIn: loggedInSelector(state),
            curriculum: curriculumSelector(state)
        }
    },
    dispatch => {
        return {
            viewAnswerAction: (regCode: string, courseId: string) => dispatch({ type: GET_ANSWERS, payload: { regCode, courseId } })
        }
    }
)(CoursePage);