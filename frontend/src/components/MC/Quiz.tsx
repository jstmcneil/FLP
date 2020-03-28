import React, { Fragment } from 'react';
import Question from './Question';
import { QuizType, AnswerType, QuestionType, MCQuizType, EmailType } from '../../model/CourseType';
import { connect } from 'react-redux';
import { SUBMIT_QUIZ } from '../../actions/types';

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
    submitQuiz: (regCode: string, courseId: string, answers: AnswerType[], emailResponse: string) => void;
}

class Quiz extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            questionIndex: 0,
            questions: (this.props.questions.mcQuestions.map(question => { return { ...question, type: "MC" } }))
                // @ts-ignore
                .concat(this.props.questions.emailQuestions.map(question => { return { ...question, type: "Email" } })),
            mcAnswers: {},
            submitted: false
        };
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

    nextQuestion() {
        const nextCount = this.state.questionIndex + 1;
        this.setState({
            questionIndex: nextCount >= this.state.questions.length ? this.state.questions.length : nextCount
        })
    }

    renderQuestions() {
        if (!this.props.questions || this.state.questionIndex >= this.state.questions.length) return <div>Error, no questions. Please contact system administrator.</div>
        let button;
        if (this.state.questionIndex === this.state.questions.length - 1) {
            button = <button onClick={this.handleSubmitClick}>Submit</button>;
        } else {
            button = <button onClick={this.nextQuestion}>Next</button>;
        }
        const question = this.state.questions[this.state.questionIndex];
        let questionBody: JSX.Element;
        if (question.type === "Email") {
            questionBody = <div id="emailTextBoxContainer" className="verticalContainer">
                <div>{question.questionContent}</div>
                <textarea id="emailBody" onInput={(event) => this.setState({ emailResponse: event.currentTarget.value })}></textarea>
            </div>
        } else if (question.type === "MC") {
            questionBody = <Question
                key={this.state.questionIndex}
                questionContent={question.questionContent}
                answerChoices={question.answerChoices}
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
    };

    render() {
        return (
            <div className="mc">
                <h2>Quiz Question:</h2>
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