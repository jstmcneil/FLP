import React from "react";

interface EmailTextProps {
    professor?: string;
}

interface EmailTextState {
    text: string;
}

const sendEmail = (recipient: string, emailBody: string) => {
    // send email here - for now just alert
    alert("email sent to " + recipient + " with body "+ emailBody);
}

export class EmailTextComponent extends React.Component<EmailTextProps, EmailTextState> {
    public constructor(props: EmailTextProps) {
        super(props);
        this.state = {
            text: ""
        }
    }

    render() {
        if (!this.props.professor) {
            return <div>Please contact professor for help.</div>
        }
        const professor = this.props.professor;
        return (
            <div id = "emailTextBoxContainer" className="verticalContainer">
                <textarea id="emailBody" onInput={(event) => this.setState({ text: event.currentTarget.value})}></textarea>
                <button onClick={() => sendEmail(professor, this.state.text)}></button>
            </div>
        );
    };
};

