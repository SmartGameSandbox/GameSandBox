import { TextField } from "@mui/material";
import React from "react";
import {SMARTButton} from '../button/button';
import styles from './dashboardStyle';
import Sidebar from "../sidebar/Sidebar";

const Dashboard = () => {
    return (
      <div style={styles.main}>
        <Sidebar></Sidebar>
        <div style={styles.btnGroup}>
          <div style={styles.joinRoom}>
            <SMARTButton
              theme="secondary"
              variant="contained"
              size="large"
              sx={styles.joinBtn}
            >
              Join Room
            </SMARTButton>
            <TextField
              id="roomlink"
              variant="filled"
              label="Enter link"
              sx={styles.linkField}
              fullwidth
              InputProps={{ disableUnderline: true }}
            />
          </div>
          <SMARTButton
            sx={styles.hostRoom}
            theme="primary"
            variant="contained"
            size="large"
          >
            Host Room
          </SMARTButton>
          <SMARTButton
            sx={styles.buildRoom}
            theme="primary"
            variant="contained"
            size="large"
          >
            Build Games
          </SMARTButton>
          <SMARTButton
            sx={styles.myGames}
            theme="primary"
            variant="contained"
            size="large"
          >
            My Games
          </SMARTButton>
        </div>
      </div>
    );
}

export default Dashboard;