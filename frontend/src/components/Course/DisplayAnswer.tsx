import React from 'react';
import { FinalAnswerType } from '../../model/CourseType';

interface AnswerProps {
    answer: FinalAnswerType
}

class DisplayAnswer extends React.Component<AnswerProps> {
    constructor(props: AnswerProps) {
        super(props);
    }
    render() {
        const arr = ["A", "B", "C", "D", "E", "F", "G"]
        return (
            <div className="mc">
                <div>Question Number {this.props.answer.questionId + 1}: {arr[this.props.answer.correctAnswerIndex]}</div>
            </div>
        );
    }
}

export default DisplayAnswer;