import React from 'react';
import Quiz from '../MC/Quiz';
import { EmailTextComponent } from '../EmailTextBox';
import { RouteComponentProps } from 'react-router-dom';
import VideoPlayer from '../VideoPlayer';

interface PageProps extends RouteComponentProps<RouterProps> {
}

interface RouterProps {
    id: string | undefined;
}

class CoursePage extends React.Component<PageProps> {
    constructor(props: PageProps) {
        super(props);
    }

    routeChange = () => {
        window.location.href = "/course";
    }

    render() {
        return (
            <div>
                <button id="back" onClick={this.routeChange}>Back to Courses</button>
                <div className="space"></div>
                <h2>Course {this.props.match.params.id}</h2>
                <div>Summary of Text</div>
                <div id="placeholder"></div>
                <div>Quiz Title</div>
                <div id="placeholder"></div>
                <div>Video Example</div>
                <VideoPlayer videoId="jNQXAC9IVRw"/>
                <Quiz />
                <div className="space"></div>
                <EmailTextComponent professor="john" />
            </div>
        );
    }
}

export default CoursePage;