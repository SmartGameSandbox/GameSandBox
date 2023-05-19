import axios from 'axios';
import { useState, useRef } from "react";
import { TextField } from "@mui/material";
import { SMARTButton } from '../button/button';
import { BASE_URL } from '../../util/constants'
import styles from './dashboardStyle';
import Modal from "../modal/modal";
import BuildGameForm from "../buildGame/buildGameForm";
import Header from "../header/header";

const Dashboard = () => {
    const [showBuildGameModal, setBuildGameModal] = useState(false);
    const [roomLink, setroomLink] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const nodeRef = useRef(null);


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
                    onClick={() => window.location.href = '/games'}
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
                    nodeRef={nodeRef}
                    style={{ height: "500px",width: "700px" }}
                >
                    <BuildGameForm closePopup={() => setBuildGameModal(false)} />
                </Modal>
            </div>
        </div>
    );

    function handleRoomLinkTextInputChange(e) {
        setroomLink(e.target.value);
    };

    function joinRoom() {
        axios.get(`${BASE_URL}/api/room?id=${roomLink}`)
        .then(() => {
            window.location.href = `/room?id=${roomLink}`;
        }).catch((error) => {
            setErrorMessage(error.response.data.message);
        });
    }
}

export default Dashboard;