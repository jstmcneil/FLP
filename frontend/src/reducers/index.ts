import { LOGIN_SUCCESS, SAVE_COURSES, SAVE_CURRICULUM, SAVE_GRADES, SAVE_QUIZ_STATUS, SAVE_ANSWERS, SAVE_REVIEWS } from "../actions/types";
import { Action } from "redux";
import { ReviewType } from "../model/ReviewType";

interface ActionWithPayload<T, Y> extends Action<Y> {
    payload: T
}

export type ReviewState = { [index: string]: {[index: string]: ReviewType[] | string} };

interface State {
    loggedIn: boolean;
    reviews: ReviewState;
}

const initialState: State = {
    loggedIn: false,
    reviews: {}
};

export const reducer = (state: State | undefined, action: ActionWithPayload<any, string>): State => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return { ...state, ...action.payload };
        case SAVE_COURSES:
            return { ...state, ...action.payload };
        case SAVE_CURRICULUM:
            return { ...state, ...action.payload };
        case SAVE_GRADES:
            return { ...state, ...action.payload };
        case SAVE_ANSWERS:
            return { ...state, ...action.payload };
        case SAVE_QUIZ_STATUS:
            return { ...state, ...action.payload };
        case SAVE_REVIEWS:
            const reviews = state ? { ...state.reviews} : {};
            console.log(action);
            console.log("before", reviews);
            reviews[action.payload["regCode"]] = {...reviews[action.payload["regCode"]], [action.payload["courseId"]]: action.payload["reviews"]}
            console.log("after", reviews);
            console.log(state);
            return { ...state, loggedIn: state?.loggedIn || false, reviews};
        default:
            return state ? state : initialState;
    }
}