import React from 'react';
import Question from './Question';
import { questionAPI } from '../../api/index';
import { exampleQuestions } from '../../api/mockData';
import { Answer } from '../../model/Answer';

interface State {
    counter: number,
    questionId: number,
    questionContent: string,
    answerOptions: Array<Answer>,
    answerKey: string,
    questionPoints: number,
    score: number,
    totalPoints: number,
    end: boolean
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
            answerOptions: [],
            answerKey: '',
            questionPoints: 0,
            score: 0,
            totalPoints: 0,
            end: false,
        };
    }

    public componentDidMount() {
        questionAPI.getQuestions()
            .then((exampleQuestions) => {
                this.setState({
                    questionContent: exampleQuestions[this.state.questionId].questionContent,
                    answerOptions: exampleQuestions[this.state.questionId].answerChoices,
                    answerKey: exampleQuestions[this.state.questionId].correctAnswer,
                    questionPoints: exampleQuestions[this.state.questionId].score,
                    totalPoints: exampleQuestions[this.state.questionId].score,
                });
            })
    }

    // captureUserSelection(event: MouseEvent) {
    //     this.setUserAnswer(event.currentTarget);
    //     if (this.state.counter >= exampleQuestions.length) {
    //         setTimeout(() => this.endQuiz(), 200);
    //     } else {
    //         setTimeout(() => this.nextQuestion(), 200);
    //     }
    // }


    // setUserAnswer(answer: string) {
    //     const currScore = this.state.score;
    //     this.setState((state, props) => {
    //         if (answer === this.state.answerKey) {
    //             score: currScore + this.state.questionPoints;
    //         } else {
    //             score: currScore
    //         }
    //     })
    // }

    nextQuestion() {
        const nextCount = this.state.counter + 1;
        const nextQuestion = this.state.questionId + 1;
        const currScore = this.state.score;
        this.setState({
            counter: nextCount,
            questionId: nextQuestion,
            questionContent: exampleQuestions[nextCount].questionContent,
            answerOptions: exampleQuestions[nextCount].answerChoices,
            answerKey: exampleQuestions[nextCount].correctAnswer,
            totalPoints: currScore + exampleQuestions[nextCount].score,
        });
    }

    endQuiz() {
        this.setState({
            end: true
        });
    }

    showResults() {
        return (
            <div>
                You got {this.state.score} out of {this.state.totalPoints}!
            </div>
        );
    }

    renderQuestions() {
        return (
            <Question
                questionId={this.state.questionId}
                questionContent={this.state.questionContent}
                answerChoices={this.state.answerOptions}
                answer={this.state.answerKey}
            />
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