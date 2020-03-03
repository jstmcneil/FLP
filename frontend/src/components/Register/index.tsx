import React from 'react';
import { connect } from 'react-redux';
import { ATTEMPT_REGISTRATION } from '../../actions/types';
import { loggedInSelector } from '../../selectors';

interface RegistrationProps {
    registerAction: Function;
    loggedIn: boolean
}
interface RegistrationState {
    username: string;
    password: string;
    regCode: string;
    isInstructor: boolean;
}

class Register extends React.Component<RegistrationProps, RegistrationState> {
    public state = {
        username: "",
        password: "",
        regCode: "",
        isInstructor: false
    };
    render() {
        if (!this.props.loggedIn) {
        const registerAction = this.props.registerAction;
        return (
            <div>
                <div>Register</div>
                <div>
                    <div>Email</div>
                    <input type="text" onInput={(event) => this.setState({ username: event.currentTarget.value })}></input>
                </div>
                <div>
                    <div>Password</div>
                    <input type="password" onInput={(event) => this.setState({ password: event.currentTarget.value })}></input>
                </div>
                <div>
                    <div>Registration Code</div>
                    <input type="text" onInput={(event) => this.setState({ regCode: event.currentTarget.value})}></input>
                </div>
                <input type="checkbox" onClick= {(event => {this.setState({ isInstructor: event.currentTarget.checked })})}/>
                <button onClick={() => registerAction(this.state.username, this.state.password, this.state.regCode, this.state.isInstructor)}>Submit</button>
            </div>
        );
        }
        return (<div></div>)
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
            registerAction: (username: string, password: string, regCode: string, isInstructor: boolean) => dispatch({type: ATTEMPT_REGISTRATION, payload: { username, password, regCode, isInstructor }})
        }
    },
)(Register);
