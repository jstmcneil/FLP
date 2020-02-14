import React from 'react';
import { connect } from 'react-redux';
import { ATTEMPT_LOGIN } from '../../actions/types';

interface LoginProps {
    loginAction: Function;
}
interface LoginState {
    username: string;
    password: string;
}

class Login extends React.Component<LoginProps, LoginState> {
    public state = {
        username: "",
        password: ""
    };
    render() {
        const loginAction = this.props.loginAction;
        return (
            <div>
                <div>Login</div>
                <div>
                    <div>Username</div>
                    <input type="text" onInput={(event) => this.setState({ username: event.currentTarget.value })}></input>
                </div>
                <div>
                    <div>Password</div>
                    <input type="password" onInput={(event) => this.setState({ password: event.currentTarget.value })}></input>
                </div>
                <button onClick={() => loginAction(this.state.username, this.state.password)}>Submit</button>
            </div>
        );
    }
}

export default connect(
    null,
    dispatch => {
        return {
            loginAction: (username: string, password: string) => dispatch({type: ATTEMPT_LOGIN, payload: { username, password }})
        }
    },
)(Login);
