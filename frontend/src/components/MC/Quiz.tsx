import React from 'react';
import Question from './Question';
import { questionAPI } from '../../api/index';
import { exampleQuestions } from '../../api/mockData';
import { Answer } from '../../model/Answer';
import { MCQuizType } from '../../model/MCQuizType';

interface State {
    counter: number,
    questionId: number,
    questionContent: string,
    questionPoints: number,
    answerOptions: string[],
    answerKey: number,
    myAnswer: number,
    myScore: number,
    totalPoints: number,
    end: boolean,
}

interface Props {
    questions: MCQuizType[];
}

class Quiz extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            counter: 0,
            questionId: 0,
            questionContent: '',
            questionPoints: 0,
            answerOptions: [],
            answerKey: 0,
            myAnswer: 0,
            myScore: 0,
            totalPoints: 0,
            end: false,
        };
        this.nextQuestion = this.nextQuestion.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    public componentDidMount() {
        this.setState({
            questionContent: this.props.questions[this.state.questionId].questionContent,
            answerOptions: this.props.questions[this.state.questionId].answerChoices,
            answerKey: this.props.questions[this.state.questionId].correctAnswerIndex,
        });
    }

    handleClick(value: number) {
        console.log(value - 1);
        this.setState({
            myAnswer: value - 1
        });
    }

    nextQuestion() {
        let newScore = this.state.myScore;
        console.log(this.state.answerKey)
        if (this.state.myAnswer === this.state.answerKey) {
            console.log("Yay");
            newScore += 1
        }
        const nextCount = this.state.counter + 1;
        const nextQuestion = this.state.questionId + 1;
        if (nextCount >= this.props.questions.length) {
            this.setState({
                myScore: newScore,
                end: true
            });
        } else {
            this.setState({
                counter: nextCount,
                questionId: nextQuestion,
                questionContent: this.props.questions[nextCount].questionContent,
                questionPoints: 1,
                answerOptions: this.props.questions[nextCount].answerChoices,
                answerKey: this.props.questions[nextCount].correctAnswerIndex,
                myScore: newScore,
                totalPoints: this.state.totalPoints + 1,
            });
        }
    }

    showResults() {
        return (
            <div>
                You got {this.state.myScore} out of {this.state.totalPoints}!
            </div>
        );
    }

    renderQuestions() {
        return (
            <div>
                <Question
                    key={this.state.questionId}
                    questionContent={this.state.questionContent}
                    answerChoices={this.state.answerOptions}
                    answer={this.handleClick}
                />
                <button onClick={this.nextQuestion}>Next</button>
            </div>
        );
    };

    render() {
        return (
            <div className="mc">
                <h2>Quiz Question:</h2>
                {this.state.end ? this.showResults() : this.renderQuestions()}
            </div>
        );
    }
}

export default Quiz;