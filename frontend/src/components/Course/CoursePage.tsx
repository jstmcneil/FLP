import React from 'react';
import Quiz from '../MC/Quiz';
import { EmailTextComponent } from '../EmailTextBox';
import { RouteComponentProps } from 'react-router-dom';

interface PageProps extends RouteComponentProps<RouterProps> {
}

interface RouterProps {
    id: string | undefined;
}

class CoursePage extends React.Component<PageProps> {
    constructor(props: PageProps) {
        super(props);
    }
    render() {
        return (
            <div>
                <h2>Course {this.props.match.params.id}</h2>
                <div>Summary of Text</div>
                <div id="placeholder"></div>
                <div>Quiz Title</div>
                <div id="placeholder"></div>
                <Quiz />
                <div className="space"></div>
                <EmailTextComponent professor="john" />
            </div>
        );
    }
}

export default CoursePage;