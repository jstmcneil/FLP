import React from 'react';

interface AnswerProps {
    key: number;
    mark: string;
    content: string;
}

interface AnswerState {
}

class AnswerOption extends React.Component<AnswerProps, AnswerState> {
    handleOnclick(event: React.MouseEvent<HTMLInputElement>) {
        event.preventDefault();
        alert(event.currentTarget.value);
    }
    render() {
        return (
            <div>
                <li className="answerOption" >
                    <input
                        type="checkbox"
                        value={this.props.mark}
                        onClick={this.handleOnclick}
                    />
                    <label className="radioCustomLabel">
                        {this.props.content}
                    </label>
                </li>
            </div>
        );
    }
}

export default AnswerOption;