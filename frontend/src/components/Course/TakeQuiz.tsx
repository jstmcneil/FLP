import React from 'react';
import { connect } from 'react-redux';
import { answerSelector, quizCompletionSelector, coursesSelector } from '../../selectors';
import { GET_QUIZ_STATUS, GET_ANSWERS } from '../../actions/types';
import { FinalAnswerType, CourseType, QuizStats } from '../../model/CourseType';
import DisplayAnswer from './DisplayAnswer';
import Quiz from '../MC/Quiz';
import { keyBy } from 'lodash';

interface QuizProps {
    completed: QuizStats;
    answers?: FinalAnswerType[];
    quizStatusAction: Function;
    regCode: string;
    courseId: string;
    courses: CourseType[];
}

interface QuizState {
    answers: FinalAnswerType[];
    show: boolean;
}

class TakeQuiz extends React.Component<QuizProps, QuizState> {
    constructor(props: QuizProps) {
        super(props);
        this.state = {
            answers: [],
            show: false,
        }
    }

    componentDidUpdate(nextProps: QuizProps) {
        if (nextProps.answers !== undefined && nextProps.answers !== this.props.answers) {
            this.setState({ answers: nextProps.answers })
        }
    }

    changeShow() {
        this.setState({
            show: true
        });
    }


    render() {
        const courses = keyBy(this.props.courses, "id");
        const course = courses[this.props.courseId || ""];
        // let completedStatus: string[] = []
        // if (this.props.completed != undefined) {
        //     completedStatus = this.props.completed.msg.split(" ")
        // }
        let answers = this.props.answers;
        if (answers && typeof answers === "string") answers = undefined;
        return (
            <div className="mc" >
                {!this.state.show && 
                    <div>
                        <div>{answers ? "You have completed this quiz. Click here to see what the correct answers to the multiple choice questions were!" : "Ready for your quiz?"}</div>
                        <button onClick={() => {
                            this.changeShow();
                        }}>{answers ? "View Answers" : "Begin Quiz"}</button>
                    </div>
                }
                {this.state.show && <Quiz questions={course.quiz} regCode={this.props.regCode} courseId={course.id} submittedAnswers={answers && answers.map(answer => answer.correctAnswerIndex)}/>}
                <br />
                {/* {this.state.show && this.props.completed != undefined && this.props.completed.completed && completedStatus[0] === this.props.regCode && completedStatus[1] === this.props.courseId &&
                    <div>
                        <div>You have submitted this quiz before. You can view both the questions and answers at this time but you cannot submit again.</div>
                        <button onClick={() => this.props.viewAnswerAction(this.props.regCode, course.id)}>View Answer</button>
                        {this.props.answers != undefined && this.props.answers.map((a: FinalAnswerType) => <DisplayAnswer answer={a} />)}
                    </div>
                } */}
            </div>
        );
    }

}

export default connect(
    state => {
        return {
            completed: quizCompletionSelector(state),
            answers: answerSelector(state),
            courses: coursesSelector(state)
        }
    },
    dispatch => {
        return {
            quizStatusAction: (regCode: string, courseId: string) => dispatch({ type: GET_QUIZ_STATUS, payload: { regCode, courseId } }),
        }
    }
)(TakeQuiz);