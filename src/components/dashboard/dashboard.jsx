import { TextField } from "@mui/material";
import React from "react";
import {SMARTButton} from '../button/button';
import styles from './dashboardStyle';
import Sidebar from "../sidebar/Sidebar";
import Modal from "../modal/modal";
import BuildGameForm from "../buildGame/buildGameForm";
import Header from "../header/header";
import axios from 'axios';

const Dashboard = () => {
    const [showBuildGameModal, setBuildGameModal] = React.useState(false);
    const [roomLink, setroomLink] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState("");
    const handleRoomLinkTextInputChange = event => {
        setroomLink(event.target.value);
    };
    const joinRoom = () => {
        const url = process.env.NODE_ENV === 'production' ? "https://smartgamesandbox.herokuapp.com" : "http://localhost:8000";

        axios.get(`${url}/api/room?id=${roomLink}`).then((response) => {
            window.location.href = `/room?id=${roomLink}`;
        }).catch((error) => {
            setErrorMessage(error.response.data.message);
        });
    }
    
    return (
        <div style={styles.body}>
            <Header />
            <div style={styles.main}>
                <Sidebar />
                <div style={styles.btnGroup}>
                    <div style={styles.joinRoom}>
                        <div style={styles.joinRoomInput}>
                            <SMARTButton
                                theme="secondary"
                                variant="contained"
                                size="large"
                                sx={styles.joinBtn}
                                onClick={() => {joinRoom();}}
                            >
                            Join Room
                            </SMARTButton>
                            <TextField
                                id="roomlink"
                                variant="filled"
                                label="Enter link"
                                sx={styles.linkField}
                                fullwidth="true"
                                required
                                InputProps={{ disableUnderline: true }}
                                value={roomLink}
                                onChange={handleRoomLinkTextInputChange}
                            />
                        </div>
                        <p style={styles.errorMessageStyle}>{errorMessage}</p>
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
                    onClick={() => setBuildGameModal(true)}
                >
                    Build Games
                </SMARTButton>
                <SMARTButton
                    sx={styles.myGames}
                    theme="primary"
                    variant="contained"
                    size="large"
                    onClick={() => window.location.href = '/mygames'}
                >
                    My Games
                </SMARTButton>
                </div>

                {/* Modals */}
                <Modal
                    title="Build Game"
                    onClose={() => setBuildGameModal(false)}
                    show={showBuildGameModal}
                    style={{
                    height: "500px",
                    width: "700px",
                    }}
                >
                    <BuildGameForm closePopup={() => setBuildGameModal(false)} />
                </Modal>
            </div>
        </div>
    );
}

export default Dashboard;