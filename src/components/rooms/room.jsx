import React, { useEffect, useState } from 'react';
import './room.css';
import { io } from "socket.io-client";
import Table from "../table/table";
import { Stage } from 'react-konva';
import axios from 'axios';
import styles from './roomStyle';
import * as Constants from '../../util/constants';
import Sidebar from '../sidebar/Sidebar';
import Header from '../header/header';

const url = process.env.NODE_ENV === 'production' ? "https://smartgamesandbox.herokuapp.com" : "http://localhost:8000";
const socket = io(url, { transports: ['websocket'] });

const Room = () => {
    const [imageUrl, setImageUrl] = useState('');
    const [username, setUsername] = useState(null);
    const [roomID, setRoomId] = useState(null);

    const handleMouseMove = (data) => {
        socket.emit("mouseMove",
            { x: data.evt.offsetX, y: data.evt.offsetY, username: username, roomID: roomID }, (err) => {
            if (err) {
                alert(err);
            }
        })
    };

    useEffect(() => {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        setRoomId(params.get('id'));
        setUsername(localStorage.getItem('username'));
        axios.get(`${url}/api/room?id=${roomID}`).then((response) => {
            setImageUrl(response.data.image);
            socket.emit("joinRoom", { roomID: roomID, username: username }, () => { });
        }).catch((error) => {
            console.log(error);
        });
    }, [imageUrl, username, roomID]);

    return (
        <>
            <div style={styles.roomWrapper}>
                <Header />
                <div style={styles.canvasWrapper}>
                    <div
                        style={styles.stageWrapper}
                    >
                        {
                            imageUrl !== undefined && imageUrl !== '' && imageUrl !== null &&
                            <img style={styles.board} alt="board" src={imageUrl} />
                        }
                        <Stage
                            width={Constants.CANVAS_WIDTH}
                            height={Constants.CANVAS_HEIGHT}
                            onMouseMove={(e) => handleMouseMove(e)}
                            
                        >
                            <Table socket={socket} username={username} />
                        </Stage>
                    </div>
                </div>
                <Sidebar />
            </div>
        </>
    );
}
export default Room;
