import React from "react";
import { accountIdSelector, isInstructorSelector, loggedInSelector } from "../../selectors";
import { connect } from "react-redux";
import { ATTEMPT_SEND_EMAIL } from "../../actions/types";

interface CourseEmailTextProps {
    accountId: string;
    courseName: string;
    questionName: string;
    sendEmailAction: Function;
    username: string;
}

interface CourseEmailTextState {
    text: string;
}

const getEmailSubject = (username: string, courseName: string): string => `${username} - ${courseName}`
const getEmailBody = (questionName: string, responseToQuestion: string): string => `Student response to ${questionName}:\n\n${responseToQuestion}`;
// const sendEmail = (recipient: string, emailBody: string) => {
//     // send email here - for now just alert
//     alert("email sent to " + recipient + " with body " + emailBody);
// }

class CourseEmailTextComponent extends React.Component<CourseEmailTextProps, CourseEmailTextState> {
    public constructor(props: CourseEmailTextProps) {
        super(props);
        this.state = {
            text: ""
        }
    }

    render() {        
        const { accountId, courseName, questionName, username } = this.props;
        return (
            <div id="emailTextBoxContainer" className="verticalContainer">
                <textarea id="emailBody" onInput={(event) => this.setState({ text: event.currentTarget.value })}></textarea>
                <button onClick={() => this.props.sendEmailAction(accountId, getEmailSubject(username, courseName), getEmailBody(questionName, this.state.text))}>Send</button>
            </div>
        );
    };
};

export default CourseEmailTextComponent;