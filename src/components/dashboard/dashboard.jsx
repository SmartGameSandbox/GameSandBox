/*
    File: dashboard.jsx

    Description: Contains the Dashboard component. It represents the dashboard page
    where users can join rooms through a shared link, host rooms, build games, and view their saved games
*/

import axios from 'axios';
import { useState, useRef } from "react";
import { TextField } from "@mui/material";
import { SMARTButton } from '../button/button';
import { BASE_URL } from '../../util/constants'
import styles from './dashboardStyle';
import Modal from "../modal/modal";
import BuildGameForm from "../buildGame/buildGameComponents/buildGameForm";
import Header from "../header/header";

const Dashboard = () => {
    const [showBuildGameModal, setBuildGameModal] = useState(false); // toggle for build game modal
    const [roomLink, setroomLink] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const nodeRef = useRef(null); // reference to the build game modal


    return (
        <div style={styles.body}>
            <Header />
            <div style={styles.main}>
                <div style={styles.btnGroup}>
                    <div style={styles.joinRoom}>
                        <div style={styles.joinRoomInput}>
                            <SMARTButton
                                theme="secondary"
                                variant="contained"
                                size="large"
                                sx={styles.joinBtn}
                                onClick={() => {joinRoom();}} // join room button. redirects to room page from link
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
                    onClick={() => window.location.href = '/games'} // host room button. redirects to games page
                >
                    Host Room
                </SMARTButton>
                <SMARTButton
                    sx={styles.buildRoom}
                    theme="primary"
                    variant="contained"
                    size="large"
                    onClick={() => setBuildGameModal(true)} // build game button. opens build game modal
                >
                    Build Games
                </SMARTButton>
                <SMARTButton
                    sx={styles.myGames}
                    theme="primary"
                    variant="contained"
                    size="large"
                    onClick={() => window.location.href = '/mygames'} // my games button. redirects to mygames page
                >
                    My Games
                </SMARTButton>
                </div>

                {/* Modals */}
                <Modal
                    title="Build Game"
                    onClose={() => setBuildGameModal(false)}
                    show={showBuildGameModal}
                    nodeRef={nodeRef}
                    style={{ height: "500px",width: "700px" }}
                >
                    <BuildGameForm closePopup={() => setBuildGameModal(false)} />
                </Modal>
            </div>
        </div>
    );

    // function to handle the change in the room link text input
    function handleRoomLinkTextInputChange(e) {
        setroomLink(e.target.value); // set the room link to the value of the text input
    };

    // Join a room based on the provided room link
    function joinRoom() {
        // Make a GET request to the server to join the room using the provided room link
        axios.get(`${BASE_URL}/api/room?id=${roomLink}`)
        .then(() => {
            window.location.href = `/room?id=${roomLink}`; // redirect to the specific room page
        }).catch((error) => {
            setErrorMessage(error.response.data.message);
        });
    }
}

export default Dashboard;