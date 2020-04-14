import React from 'react';
import NoteForm from '../Form/NoteForm';
import { connect } from 'react-redux';
import { SAVE_REVIEWS } from '../../actions/types';

import {
    Link,
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    RouteComponentProps,
    useRouteMatch
} from 'react-router-dom';

interface State {
    submitted: boolean,
    response?: string;
}

interface Props {
    regCode: string;
    courseId: string;
    createReview: (regCode: string, courseId: string, review: string) => void;
}

class Review extends React.Component<Props, State> {
    constructor(props: any) {
        super(props)
        this.state = {submitted: false, response: ' '}
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    onChange = (event) => this.setState({ response: event.target.value });

    handleSubmit() {
        this.props.createReview(this.props.regCode, this.props.courseId, this.state.response || "")
    }
    
    render() {
        return (
        <div className="verticalContainer">
            <div className="title"><h2>Please leave your review below: </h2></div>
            <form onSubmit={this.handleSubmit}>
                <label>
                    <div>
                        <input type="text" value={this.state.response} onChange={this.onChange} />
                    </div>
                </label>
                <input type="submit" value="Submit" />
            </form>
        </div>     
        );
    }
}

export default connect(null, dispatch => {
    return {
        createReview: (regCode: string, courseId: string, response: string) => dispatch({ type: "CREATE_REVIEW", payload: { regCode, courseId, response } })
    }
})(Review);