import React from 'react';
import Login from '../Login';

class Profile extends React.Component {
    render() {
        return (
            // @ts-ignore
            <div style = { {"display": "flex", "flex-direction": "column"}}>
                <div className="title">My Profile</div>
                <Login />
            </div>
        );
    }
}

export default Profile;