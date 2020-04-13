import React from 'react';
import { AnswerType } from '../../model/CourseType';
import Checkbox from '@material-ui/core/Checkbox';
import { FormControlLabel, FormControl, RadioGroup, Radio } from '@material-ui/core';
import { Typography } from '@material-ui/core';

interface QuestionProps {
  key: number;
  questionContent: string;
  answerChoices: string[];
  answer: (value: number) => void;
  selectedAnswer: number;
  disabled?: boolean;
}

interface QuestionState {
  // checked: boolean[];
  currentAnswer: number;
}

class Question extends React.Component<QuestionProps, QuestionState> {
  constructor(props: QuestionProps) {
    super(props);
    this.state = {
      // checked: [false, false, false, false],
      currentAnswer: this.props.selectedAnswer
    };
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick(i: number) {
    // const myClonedArray = [...this.state.checked];
    // myClonedArray[i] = !this.state.checked[i];
    // this.setState(prevState => ({
    //   checked: myClonedArray
    // }));
    this.props.answer(i);
    this.setState({ currentAnswer: i });
    console.log(i, this.props.answerChoices[i]);
  }

  render() {
    return (
      <div>
        <Typography variant="h5">{this.props.questionContent}</Typography>
        <FormControl>
          <RadioGroup onChange={(event) => this.handleOnClick(Number(event.target.value))} value={this.state.currentAnswer}>
            {this.props.answerChoices.map((key, i) => (
              <FormControlLabel
                disabled={this.props.disabled}
                control={<Radio />}
                value={i}
                label={<Typography variant="body1">{key}</Typography>}
              />)
          )}
          </RadioGroup>
        </FormControl>
      </div>
    );
  }
}

export default Question;
