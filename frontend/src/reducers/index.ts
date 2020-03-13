import { LOGIN_SUCCESS, SAVE_COURSES, SAVE_CURRICULUM, SAVE_GRADES } from "../actions/types";

interface State {
    loggedIn: boolean;
}

const initialState: State = {
    loggedIn: false
};

export const reducer = (state: State | undefined, action: any): State => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return { ...state, ...action.payload };
        case SAVE_COURSES:
            return { ...state, ...action.payload };
        case SAVE_CURRICULUM:
            return { ...state, ...action.payload };
        case SAVE_GRADES:
            return { ...state, ...action.payload };
        default:
            return state ? state : initialState;
    }
}