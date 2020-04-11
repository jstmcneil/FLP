import React from 'react';
import { connect } from 'react-redux';
import { LOG_OUT } from '../../actions/types';

interface LogOutProps {
    logOutAction: Function;
}

const LogOutButton = (props: LogOutProps) => {
    return <button id ="logoff" onClick={() => props.logOutAction()} style={{backgroundColor: "white"}}>Log Out</button>;
};

export default connect(null, 
    dispatch => { 
        return {
            logOutAction: () => dispatch({type: LOG_OUT}) 
        }
    })(LogOutButton);
