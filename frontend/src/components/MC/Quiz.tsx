import React from 'react';
import Question from './Question';
import { questionAPI } from '../../api/index';
import { exampleQuestions } from '../../api/mockData';
import { Answer } from '../../model/Answer';

interface State {
    counter: number,
    questionId: number,
    questionContent: string,
    questionPoints: number,
    answerOptions: Array<Answer>,
    answerKey: number,
    myAnswer: number,
    myScore: number,
    totalPoints: number,
    end: boolean,
}

interface Props {

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
        questionAPI.getQuestions()
            .then((exampleQuestions) => {
                this.setState({
                    questionContent: exampleQuestions[this.state.questionId].questionContent,
                    questionPoints: exampleQuestions[this.state.questionId].score,
                    answerOptions: exampleQuestions[this.state.questionId].answerChoices,
                    answerKey: exampleQuestions[this.state.questionId].correctAnswer,
                    totalPoints: exampleQuestions[this.state.questionId].score,
                });
            })
    }

    handleClick(value: number) {
        console.log(value);
        this.setState({
            myAnswer: value
        });
    }

    nextQuestion() {
        let newScore = this.state.myScore;
        if (this.state.myAnswer === this.state.answerKey) {
            newScore += this.state.questionPoints
        }
        console.log(newScore);

        const nextCount = this.state.counter + 1;
        const nextQuestion = this.state.questionId + 1;
        if (nextCount >= exampleQuestions.length) {
            this.setState({
                myScore: newScore,
                end: true
            });
        } else {
            this.setState({
                counter: nextCount,
                questionId: nextQuestion,
                questionContent: exampleQuestions[nextCount].questionContent,
                questionPoints: exampleQuestions[nextCount].score,
                answerOptions: exampleQuestions[nextCount].answerChoices,
                answerKey: exampleQuestions[nextCount].correctAnswer,
                myScore: newScore,
                totalPoints: this.state.totalPoints + exampleQuestions[nextCount].score,
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