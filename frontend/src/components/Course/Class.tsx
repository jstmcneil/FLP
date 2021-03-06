import React from 'react';
import { Redirect, Link } from 'react-router-dom';

interface ClassProps {
    id: string;
    courseName: string;
    percent: number;
    color: string;
}

interface ClassState {

}

class Class extends React.Component<ClassProps, ClassState> {
    constuctor() {
        this.routeChange = this.routeChange.bind(this);
    }
    routeChange = (id: string) => {
        let path = `/course/${id}`;
        window.location.href = path;
    }

    render() {
        return (
            <div className="class">
                <div id="courseName">{this.props.courseName}</div>
                <div id="percentage" style={{ backgroundColor: this.props.color }}>
                    {this.props.percent + "%"}
                </div>
                <div id="redirectClass"><Link to={`/courses/${this.props.id}`} /></div>
            </div>
        );
    }
}

export default Class;