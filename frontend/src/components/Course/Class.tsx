import React from 'react';

interface ClassProps {
    courseName: string;
    percent: number;
    color: string;
}

interface ClassState {

}

class Class extends React.Component<ClassProps, ClassState> {
    render() {
        return (
            <div className="class">
                <div id="courseName">{this.props.courseName}</div>
                <div id="percentage" style={{backgroundColor: this.props.color}}>
                    {this.props.percent + "%"}
                </div>
            </div>
        );
    }
}

export default Class;