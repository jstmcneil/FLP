import { LOGIN_SUCCESS } from "../actions/types";

interface State {
    loggedIn: boolean;
}

const initialState: State = {
    loggedIn: false
};

export const reducer = (state: State | undefined, action: any): State => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {...state, ...action.payload};
        default:
            return initialState;
    }
}