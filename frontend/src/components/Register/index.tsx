import React from 'react';
import { connect } from 'react-redux';
import { ATTEMPT_REGISTRATION } from '../../actions/types';
import { loggedInSelector } from '../../selectors';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { Checkbox, FormControlLabel } from '@material-ui/core';

interface RegistrationProps {
    registerAction: Function;
    loggedIn: boolean
}
interface RegistrationState {
    username: string;
    confirmUsername: string;
    password: string;
    confirmPassword: string;
    regCode: string;
    isInstructor: boolean;
}

class Register extends React.Component<RegistrationProps, RegistrationState> {
    public state = {
        username: "",
        confirmUsername: "",
        password: "",
        confirmPassword: "",
        regCode: "",
        isInstructor: false
    };
    render() {
        if (!this.props.loggedIn) {
            const registerAction = this.props.registerAction;

            return (
                <div className="verticalContainer" style={{ textAlign: "center" }}>
                    <Typography variant="h5">Register</Typography>
                    <div style={{ display: "inline-block", textAlign: "center" }}>
                        <div style={{ display: "inline-block" }}>
                            <div className="labelInputGrid" style={{ marginTop: "10px" }}>
                                <div className="labelInputGridLabel"><Typography variant="body1">Email:</Typography></div>
                                <div className="labelInputGridInput"><TextField id="outlined-basic" variant="outlined"  onChange={(event) => this.setState({ username: event.currentTarget.value })} /></div>
                                <div className="labelInputGridLabel"><Typography variant="body1">Confirm Email:</Typography></div>
                                <div className="labelInputGridInput"><TextField id="outlined-basic" variant="outlined"  onChange={(event) => this.setState({ confirmUsername: event.currentTarget.value })} /></div>
                                <div className="labelInputGridLabel"><Typography variant="body1" >Password:</Typography></div>
                                <div className="labelInputGridInput"><TextField id="outlined-basic" variant="outlined"  onChange={(event) => this.setState({ password: event.currentTarget.value })} type="password" /></div>
                                <div className="labelInputGridLabel"><Typography variant="body1" >Confirm Password:</Typography></div>
                                <div className="labelInputGridInput"><TextField id="outlined-basic" variant="outlined"  onChange={(event) => this.setState({ confirmPassword: event.currentTarget.value })} type="password" /></div>
                                <div className="labelInputGridLabel"><Typography variant="body1" >Registration Code:</Typography></div>
                                <div className="labelInputGridInput"><TextField id="outlined-basic" variant="outlined" onChange={(event) => this.setState({ regCode: event.currentTarget.value })} /></div>
                                
                            </div>
                            <div>
                                <FormControlLabel 
                                    control={<Checkbox onChange={(event) => this.setState({ isInstructor: event.currentTarget.checked })}/>}
                                    label="Registering as an Instructor?"
                                    labelPlacement="start"
                                />
                            </div>
                        </div>
                        <div><button onClick={() => {
                            if (this.state.password !== this.state.confirmPassword) {
                                alert("The password field does not equal the confirm password field. Please check these fields.");
                                return;
                            }
                            if (this.state.confirmUsername !== this.state.username) {
                                alert("The email field does not equal the confirm email field. Please check these fields.");
                                return;
                            }
                            registerAction(this.state.username, this.state.password, this.state.regCode, this.state.isInstructor);
                        }}>Submit</button></div>
                    </div>
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
            registerAction: (username: string, password: string, regCode: string, isInstructor: boolean) => dispatch({ type: ATTEMPT_REGISTRATION, payload: { username, password, regCode, isInstructor } })
        }
    },
)(Register);
