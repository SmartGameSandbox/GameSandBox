import { TextField } from "@mui/material";
import React from "react";
import {SMARTButton} from '../button/button';
import styles from './dashboardStyle';
// import Slider from '../sidebar/Sidebar';

const Dashboard = () => {
    return (
            <div style={styles.btnGroup}>
                <div>
                    <SMARTButton theme="secondary" variant="contained" size="large">Join Room</SMARTButton>
                    <TextField id="roomlink" variant="filled" label="Enter link"/>
                </div>
                <SMARTButton theme="primary" variant="contained" size="large">Host Room</SMARTButton>
                <SMARTButton theme="primary" variant="contained" size="large">Build Room</SMARTButton>
                <SMARTButton theme="primary" variant="contained" size="large">My Games</SMARTButton>
            </div>
    )
}

export default Dashboard;