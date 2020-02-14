import React from 'react';
import { Redirect } from 'react-router-dom';

interface ClassProps {
    id: string;
    courseName: string;
    percent: number;
    color: string;
}

interface ClassState {

}

class Class extends React.Component<ClassProps, ClassState> {
    toCoursePage(id: string) {
        <Redirect to={`/course/${id}`} />
    }

    render() {
        return (
            <div className="class">
                <div id="courseName">{this.props.courseName}</div>
                <div id="percentage" style={{ backgroundColor: this.props.color }}>
                    {this.props.percent + "%"}
                </div>
                <button onClick={() => this.toCoursePage(this.props.id)}></button>
            </div>
        );
    }
}

export default Class;