import { LOGIN_SUCCESS, SAVE_COURSES, SAVE_CURRICULUM, SAVE_GRADES, SAVE_QUIZ_STATUS, SAVE_ANSWERS, SAVE_REVIEWS } from "../actions/types";
import { Action } from "redux";

interface ActionWithPayload<T, Y> extends Action<Y> {
    payload: T
}

interface State {
    loggedIn: boolean;
}

const initialState: State = {
    loggedIn: false
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
            return { ...state, ...action.payload };
        default:
            return state ? state : initialState;
    }
}