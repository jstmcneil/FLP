import React from 'react';
import { connect } from 'react-redux';
import { ATTEMPT_LOGIN } from '../../actions/types';
import { loggedInSelector } from '../../selectors';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
interface LoginProps {
    loginAction: Function;
    loggedIn: boolean;
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
        if (!this.props.loggedIn) {
            const loginAction = this.props.loginAction;
            return (
                <div className="verticalContainer" style={{ textAlign: "center" }}>
                    <Typography variant="h5">Login</Typography>
                    <div style={{ display: "inline-block", textAlign: "center" }}>
                        <div style={{display: "inline-block"}}>
                            <div className="labelInputGrid" style={{ marginTop: "10px" }}>
                                <div className="labelInputGridLabel"><Typography variant="body1">Email:</Typography></div>
                                <div className="labelInputGridInput"><TextField id="outlined-basic" variant="outlined" onChange={(event) => {this.setState({ username: event.currentTarget.value })}}/></div>
                                <div className="labelInputGridLabel"><Typography variant="body1">Password:</Typography></div>
                                <div className="labelInputGridInput"><TextField id="outlined-basic" variant="outlined" onChange={(event) => this.setState({ password: event.currentTarget.value })} type="password"/></div>
                            </div>
                        </div>
                    </div>
                    <div style={{marginTop: "10px"}}><button onClick={() => loginAction(this.state.username, this.state.password)}>Submit</button></div>
                </div>
            );
        }
        return (<div>Hello There!</div>);
    }
}

export default connect(
    state => {
        return {
            loggedIn: loggedInSelector(state)
        }
    },
    dispatch => {
        return {
            loginAction: (username: string, password: string) => dispatch({ type: ATTEMPT_LOGIN, payload: { username, password } })
        }
    },
)(Login);
