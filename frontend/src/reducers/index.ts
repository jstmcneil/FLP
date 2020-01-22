interface State {
    loggedIn: boolean;
}

const initialState: State = {
    loggedIn: false
};

export const reducer = (state: State | undefined, action: any): State => {
    return state ? state: initialState;
}