import React, { Fragment } from 'react';
import NoteForm from '../Form/NoteForm';
import { connect } from 'react-redux';
import { SAVE_REVIEWS, GET_REVIEWS } from '../../actions/types';

import {
    Link,
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    RouteComponentProps,
    useRouteMatch
} from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { ReviewType } from '../../model/ReviewType';
import { ReviewState } from '../../reducers/index';
import { reviewSelector } from '../../selectors';
import get from 'lodash/get';

interface State {
    submitted: boolean,
    response?: string;
    calledForReviews: boolean;
}

interface Props {
    regCode: string;
    courseId: string;
    createReview: (regCode: string, courseId: string, review: string) => void;
    getReviews: (regCode: string, courseId: string) => void;
    reviews: ReviewState;
}

class Review extends React.Component<Props, State> {
    constructor(props: any) {
        super(props);
        this.state = { submitted: false, response: ' ', calledForReviews: false}
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    onChange = (event) => this.setState({ response: event.target.value });

    handleSubmit() {
        this.props.createReview(this.props.regCode, this.props.courseId, this.state.response || "")
    }

    render() {
        const reviews = get(this.props.reviews, [this.props.regCode, this.props.courseId], undefined);
        if (!reviews && !this.state.calledForReviews) {
            this.props.getReviews(this.props.regCode, this.props.courseId);
            this.setState({calledForReviews: true})
            return <Fragment />;
        }
        if (reviews && typeof reviews !== "string" && reviews.length !== 0) {
            return <Typography variant="body1">You cannot submit a review for a given course in a given registration more than once.</Typography>
        }
        const errorFetchingReview = (
            <div>
                {reviews && typeof reviews === "string" && 
                    <Typography variant="body1">
                        We failed to fetch reviews. You may not be able to submit this 
                        review for this course in this registration if you have before.
                    </Typography>
                }
            </div>
        );

        return (
            <div className="verticalContainer">
                {errorFetchingReview}
                <div className="title"><Typography variant="h2">Please leave your review below: </Typography></div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        <div>
                            <textarea onChange={this.onChange} style={{ width: "50%", minHeight: "100px" }} />
                        </div>
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}

export default connect(state => {
    return {
        reviews: reviewSelector(state)
    }
}, dispatch => {
    return {
        createReview: (regCode: string, courseId: string, response: string) => dispatch({ type: "CREATE_REVIEW", payload: { regCode, courseId, response } }),
        getReviews: (regCode: string, courseId: string) => dispatch({ type: GET_REVIEWS, payload: { regCode, courseId } })
    }
})(Review);