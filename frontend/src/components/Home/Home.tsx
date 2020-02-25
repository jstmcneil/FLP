import React from 'react';
import logo from '../../img/buzz.png';
import Login from '../Login';
import VideoPlayer from '../VideoPlayer';

class Home extends React.Component {
    render() {
        return (
            <div>
                <div className="title">Home</div>
                <img src={logo} alt="buzz" />
                <h2>Welcome to Georgia Tech Financial Learning Curriculum</h2>
            </div>
        );
    }
}

export default Home;
