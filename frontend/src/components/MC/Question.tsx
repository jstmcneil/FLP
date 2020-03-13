import React from 'react';
import { AnswerType } from '../../model/CourseType';
import Checkbox from '@material-ui/core/Checkbox';
import { FormControlLabel, FormControl } from '@material-ui/core';

interface QuestionProps {
  key: number;
  questionContent: string;
  answerChoices: string[];
  answer: (value: number) => void;
}

interface QuestionState {
  answered: boolean;
  checked: boolean[];
}

class Question extends React.Component<QuestionProps, QuestionState> {
  constructor(props: QuestionProps) {
    super(props);
    this.state = {
      answered: false,
      checked: [false, false, false, false],
    };
    this.getSelection = this.getSelection.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  getSelection = (value: number) => {
    console.log(value);
  }

  handleOnClick(i: number) {
    const myClonedArray = [...this.state.checked];
    myClonedArray[i] = !this.state.checked[i];
    this.setState(prevState => ({
      checked: myClonedArray
    }));
    this.props.answer(i);
  }

  render() {
    return (
      <div className="element">
        <h2 className="question">{this.props.questionContent}</h2>
        <FormControl>
          {this.props.answerChoices.map((key, i) => (
            <FormControlLabel
              control={<Checkbox
                key={i}
                value={i}
                checked={this.state.checked[i] || false}
                onChange={() => this.handleOnClick(i)}
              />}
              label={key}
            />
          ))}
        </FormControl>
      </div>
    );
  }
}

export default Question;
