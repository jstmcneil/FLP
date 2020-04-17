import React, { Fragment } from 'react';
import Question from './Question';
import { QuizType, AnswerType, QuestionType, MCQuizType, EmailType } from '../../model/CourseType';
import { connect } from 'react-redux';
import { SUBMIT_QUIZ } from '../../actions/types';
import { Typography } from '@material-ui/core';
import VideoPlayer from '../VideoPlayer';

interface State {
    questionIndex: number,
    mcAnswers: { [questionId: number]: number },
    emailResponse?: string,
    questions: (MCQuizType | EmailType)[],
    submitted: boolean
}

interface Props {
    questions: QuizType;
    regCode: string;
    courseId: string;
    submittedAnswers?: number[];
    submitQuiz: (regCode: string, courseId: string, answers: AnswerType[], emailResponse: string) => void;
}

class Quiz extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        const questions = this.props.questions.mcQuestions.map(question => { return { ...question, type: "MC" } })
            // @ts-ignore
            .concat(this.props.questions.emailQuestions.map(question => { return { ...question, type: "Email" } }))
            // : this.props.questions.mcQuestions.map(question => { return { ...question, type: "MC" } });

        this.state = {
            questionIndex: 0,
            questions: questions,
            mcAnswers: {},
            submitted: false
        };
        this.props.questions.mcQuestions.forEach(question => this.state.mcAnswers[question.questionId] = 0);
        this.backQuestion = this.backQuestion.bind(this);
        this.nextQuestion = this.nextQuestion.bind(this);
        this.handleSubmitClick = this.handleSubmitClick.bind(this);
    }

    handleSubmitClick() {
        const answers: AnswerType[] = []
        Object.keys(this.state.mcAnswers).forEach((key) => {
            const keyAsNumber = parseInt(key);
            answers.push({ questionId: keyAsNumber, answerIndex: this.state.mcAnswers[keyAsNumber] });
        });
        this.props.submitQuiz(this.props.regCode, this.props.courseId, answers, this.state.emailResponse || "");
    }

    backQuestion() {
        const backCount = this.state.questionIndex - 1;
        if (backCount >= 0) {
            this.setState({
                questionIndex: backCount
            })
        }
    }
    nextQuestion() {
        const nextCount = this.state.questionIndex + 1;
        this.setState({
            questionIndex: nextCount >= this.state.questions.length ? this.state.questions.length : nextCount
        })
    }

    buttonGrid(showSubmitButton: boolean) {
        const nextButton = <button onClick={this.nextQuestion}>Next Question</button>;
        const submitButton = <button onClick={this.handleSubmitClick}>Submit</button>;
        const backButton = <button onClick={this.backQuestion}>Previous Question</button>;
        if (this.state.questions.length === 1) {
            return showSubmitButton ? <div>{submitButton}</div> : <div></div>
        }
        if (this.state.questionIndex === 0) {
            return <div>{nextButton}</div>
        }
        if (this.state.questionIndex === this.state.questions.length - 1) {
            return (
                <div>
                    <div className="horizontalContainer" style={{ justifyContent: "center" }}>
                        {backButton}
                        {showSubmitButton && submitButton}
                    </div>
                </div>
            );
        }
        return (
            <div>
                <div className="horizontalContainer" style={{ justifyContent: "center" }}>
                    {backButton}
                    {nextButton}
                </div>
            </div>
        );

    }

    renderQuestions() {
        if (!this.props.questions || this.state.questionIndex >= this.state.questions.length) return <div>Error, no questions. Please contact system administrator.</div>
        if (!this.props.submittedAnswers) {
            const button = this.buttonGrid(true);
            const question = this.state.questions[this.state.questionIndex];
            let questionBody: JSX.Element;
            if (question.type === "Email") {
                questionBody = <div id="emailTextBoxContainer" className="verticalContainer">
                    {question.videoId && question.videoType === "youtube" && <VideoPlayer videoId={question.videoId} width={400}/>}
                    <Typography variant="h5">{question.questionContent}</Typography>
                    <textarea id="emailBody" onInput={(event) => this.setState({ emailResponse: event.currentTarget.value })}>{this.state.emailResponse || ""}</textarea>
                </div>
            } else if (question.type === "MC") {
                questionBody = <Question
                    key={this.state.questionIndex}
                    questionContent={question.questionContent}
                    answerChoices={question.answerChoices}
                    selectedAnswer={this.state.mcAnswers[question.questionId] !== undefined ? this.state.mcAnswers[question.questionId] : 0}
                    answer={(checkedIndex: number) => this.state.mcAnswers[question.questionId] = checkedIndex}
                />
            } else {
                return <div></div>;
            }

            return (
                <div>
                    {questionBody}
                    {button}
                </div>
            );
        }
        const button = this.buttonGrid(false);
        const question = this.state.questions[this.state.questionIndex];
        if (question.type === "Email") {
            return (
                <div>
                    {question.videoId && question.videoType === "youtube" && <VideoPlayer videoId={question.videoId} width={400}/>}
                    <Typography variant="h5">{question.questionContent}</Typography>
                    <Typography variant="h6">Note: There is no default answer to this question.</Typography>
                    {button}
                </div>
            );
        }
        const questionBody = <Question
            key={this.state.questionIndex}
            questionContent={question.questionContent}
            answerChoices={question.answerChoices}
            selectedAnswer={this.props.submittedAnswers[this.state.questionIndex]}
            disabled
            answer={(checkedIndex: number) => { }}
        />
        return (
            <div>
                {questionBody}
                {button}
            </div>
        )

    };

    render() {
        return (
            <div className="mc">
                {this.renderQuestions()}
            </div>
        );
    }
}

export default connect(null, dispatch => {
    return {
        submitQuiz: (regCode: string, courseId: string, answers: AnswerType[], emailResponse: string) => dispatch({ type: SUBMIT_QUIZ, payload: { regCode, courseId, answers, emailResponse } })
    }
})(Quiz);