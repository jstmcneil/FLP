import React from 'react';
import logo from '../../img/buzz.png';
import Login from '../Login';
import VideoPlayer from '../VideoPlayer';
import { Typography } from '@material-ui/core';
import AutoSizer from 'react-virtualized-auto-sizer';

class Home extends React.Component {
    render() {
        return (
            <div style={{width:"100%", height:"500px"}}>
                <AutoSizer>
                    {({ width }) => {
                        return (
                            <div className="verticalContainer" style={{ width, textAlign: "center" }}>
                                <Typography component={"div"} variant="h2" style={{width: "100%"}}>Welcome to Georgia Tech Financial Learning Curriculum</Typography>
                                <div style={{display: "block", marginRight: "auto", marginLeft: "auto"}}>
                                    <img src={logo} alt="buzz" style={{maxWidth: "800px"}}/>
                                </div>
                                
                            </div>
                        )
                    }
                    }
                </AutoSizer>


            </div>
        );
    }
}

export default Home;
