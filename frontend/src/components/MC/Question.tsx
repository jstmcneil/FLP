import React from 'react';
import AnswerOption from './AnswerOption';
import { Answer } from '../../model/Answer';

interface QuestionProps {
  questionId: number;
  questionContent: string;
  answerChoices: Array<Answer>;
  answer: string;
}

interface QuestionState {
  answered: boolean;
}

class Question extends React.Component<QuestionProps, QuestionState> {
  constructor(props: QuestionProps) {
    super(props);
    this.state = {
      answered: false,
    };
  }

  renderChoices(key: Answer) {
    let newID = 1;
    if (key.type === 'B') {
      newID = 2;
    } else if (key.type === 'C') {
      newID = 3;
    }
    return (
      <AnswerOption
        key={newID}
        mark={key.type}
        content={key.text}
      />
    );
  }

  render() {
    return (
      <div className="element">
        <h2 className="question">{this.props.questionContent}</h2>
        <ul className="options">
          {this.props.answerChoices.map(this.renderChoices)}
        </ul>
      </div>
    );
  }
}

export default Question;
