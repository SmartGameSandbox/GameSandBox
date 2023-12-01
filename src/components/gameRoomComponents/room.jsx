// This module holds the UI and logic of a live game room.
// Provides the stage of the room where table.jsx will then populate with components such as hand zone, game area,
// and individual game objects.

import { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import axios from 'axios';
import { Stage } from 'react-konva';
import Table from "./table";
import { BASE_URL, CANVAS_WIDTH, CANVAS_HEIGHT } from '../../util/constants'
import { canvasWrapper, stageWrapper, roomWrapper, inviteWrapper } from './roomStyle';
import Header from '../header/header';
import { SMARTButton } from "../button/button";

const socket = io(BASE_URL, { transports: ['websocket'] });

const Room = () => {
    const [username, setUsername] = useState(localStorage.getItem('username'));
    const [roomID, setRoomId] = useState(null);
    const [currentURL, setCurrentURL] = useState('');
    const [linkCopied, setLinkCopied] = useState(false);

    useEffect(() => {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        setRoomId(params.get('id'));
        if (!roomID) return;
        setUsername(localStorage.getItem('username'));
        axios.get(`${BASE_URL}/api/room?id=${roomID}`)
        .then(() => {
            socket.emit("joinRoom", { roomID, username });
        })
        .catch((error) => {
            console.log(error);
        });
        setCurrentURL(window.location.href); // Set current URL
    }, [username, roomID]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(currentURL); // Copy URL to clipboard
        setLinkCopied(true);
        setTimeout(() => {
            setLinkCopied(false);
        }, 3000);
    };

    return (
        <>
            <div style={roomWrapper}>
                <Header />
                <div style={canvasWrapper}>
                    <div style={inviteWrapper}>
                        <div>
                            <SMARTButton
                                type="submit"
                                theme="secondary"
                                size="large"
                                variant="contained"
                                onClick={copyToClipboard}
                            >
                                Invite
                            </SMARTButton>
                            <p style={{ opacity: linkCopied ? 1 : 0 }}>Link copied!</p>
                        </div>
                    </div>
                    <div style={stageWrapper}>
                        <Stage
                            width={CANVAS_WIDTH}
                            height={CANVAS_HEIGHT}
                            onMouseMove={(e) => handleMouseMove(e)}
                        >
                            <Table socket={socket} username={username} roomID={roomID} />
                        </Stage>
                    </div>
                </div>
            </div>
        </>
    );

    function handleMouseMove(data) {
        socket.emit("mouseMove",
            { x: data.evt.offsetX, y: data.evt.offsetY, username, roomID },
            (err) => {
            if (err) alert(err);
        })
    };
}
export default Room;
