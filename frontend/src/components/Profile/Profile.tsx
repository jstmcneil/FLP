import React from 'react';
import Login from '../Login';
import Register from '../Register';

class Profile extends React.Component {
    render() {
        return (
            // @ts-ignore
            <div style = { {"display": "flex", "flex-direction": "column"}}>
                <div className="title">My Profile</div>
                <Login />
                <Register />
            </div>
        );
    }
}

export default Profile;