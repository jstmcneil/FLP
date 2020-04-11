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

                <div className="verticalContainer" style={{ textAlign: "center" }}>
                    <Typography variant="h5">Register</Typography>
                    <div style={{ display: "inline-block", textAlign: "center" }}>
                        <div style={{ display: "inline-block" }}>
                            <div className="labelInputGrid" style={{ marginTop: "10px" }}>
                                <div className="labelInputGridLabel"><Typography variant="body1">Email:</Typography></div>
                                <div className="labelInputGridInput"><TextField id="outlined-basic" variant="outlined"  onChange={(event) => this.setState({ username: event.currentTarget.value })} /></div>
                                <div className="labelInputGridLabel"><Typography variant="body1" >Password:</Typography></div>
                                <div className="labelInputGridInput"><TextField id="outlined-basic" variant="outlined"  onChange={(event) => this.setState({ password: event.currentTarget.value })} type="password" /></div>
                                <div className="labelInputGridLabel"><Typography variant="body1" >Registration Code:</Typography></div>
                                <div className="labelInputGridInput"><TextField id="outlined-basic" variant="outlined" onChange={(event) => this.setState({ regCode: event.currentTarget.value })} /></div>
                                
                            </div>
                            {/* <div><Typography variant="body1" style={{ marginBlockStart: "auto", marginBlockEnd: "auto" }}>Registering as Instructor?</Typography></div> */}
                            <div>
                                <FormControlLabel 
                                    control={<Checkbox onChange={(event) => this.setState({ isInstructor: event.currentTarget.checked })}/>}
                                    label="Registering as an Instructor?"
                                    labelPlacement="start"
                                />
                            </div>
                        </div>
                        <div><button onClick={() => registerAction(this.state.username, this.state.password, this.state.regCode, this.state.isInstructor)}>Submit</button></div>
                    </div>
                    {/* <div>Register</div>
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
                        <input type="text" onInput={(event) => this.setState({ regCode: event.currentTarget.value })}></input>
                    </div>
                    <div>
                        <div>Registering As An Instructor?</div>
                        <div><Checkbox onClick={(event => { this.setState({ isInstructor: event.currentTarget.checked }) })} /></div>
                    </div> */}
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
