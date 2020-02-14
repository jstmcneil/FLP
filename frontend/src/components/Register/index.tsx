import React from 'react';
import { connect } from 'react-redux';
import { ATTEMPT_REGISTRATION } from '../../actions/types';

interface RegistrationProps {
    registerAction: Function;
}
interface RegistrationState {
    username: string;
    password: string;
    regCode: number;
    isInstructor: boolean;
}

class Register extends React.Component<RegistrationProps, RegistrationState> {
    public state = {
        username: "",
        password: "",
        regCode: -1,
        isInstructor: false
    };
    render() {
        const registerAction = this.props.registerAction;
        return (
            <div>
                <div>Register</div>
                <div>
                    <div>Username</div>
                    <input type="text" onInput={(event) => this.setState({ username: event.currentTarget.value })}></input>
                </div>
                <div>
                    <div>Password</div>
                    <input type="password" onInput={(event) => this.setState({ password: event.currentTarget.value })}></input>
                </div>
                <div>
                    <div>Registration Code</div>
                    <input type="text" onInput={(event) => {
                        const rawValue = event.currentTarget.value;
                        let parsedValue = -1;
                        try {
                            parsedValue = parseInt(rawValue, 10);
                        } catch (e) {
                            // no-op
                        }
                        this.setState({ regCode: parsedValue});
                    }}></input>
                </div>
                <input type="checkbox" onClick= {(event => {this.setState({isInstructor: event.currentTarget.checked})})}/>
                <button onClick={() => registerAction(this.state.username, this.state.password, this.state.regCode, this.state.isInstructor)}>Submit</button>
            </div>
        );
    }
}

export default connect(
    null,
    dispatch => {
        return {
            registerAction: (username: string, password: string, regCode: number, isInstructor: boolean) => dispatch({type: ATTEMPT_REGISTRATION, payload: { username, password, regCode, isInstructor }})
        }
    },
)(Register);
