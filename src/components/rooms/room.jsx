import React from 'react';
import './room.css';
import { io } from "socket.io-client";
import Table from "../table/table";
import { Stage } from 'react-konva';
import axios from 'axios';
import styles from './roomStyle';
import * as Constants from '../../util/constants';

const url = process.env.NODE_ENV === 'production' ? "https://smartgamesandbox.herokuapp.com" : "http://localhost:5000";
const socket = io(url, { transports: ['websocket'] });
let roomID = null;
let roomPassword = null;
let username = Date.now().toString();

const Room = () => {
    const [imageUrl, setImageUrl] = React.useState('');

    const handleMouseMove = (data) => {
        socket.emit("mouseMove", { x: data.evt.offsetX, y: data.evt.offsetY, username: username, roomID: roomID }, (err) => {
            if (err) {
                alert(err);
            }
        })
    }

    React.useEffect(() => {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        roomID = params.get('id');
        roomPassword = params.get('password');
        axios.get(`${url}/api/room?id=${roomID}&password=${roomPassword}`).then((response) => {
            setImageUrl(response.data.image);
            socket.emit("joinRoom", { roomID: roomID, password: roomPassword, username: username }, () => { });
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    return (
        <>
            <div style={styles.roomWrapper}>
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
                        <Table socket={socket} username={username}/>
                    </Stage>
                </div>
            </div>
        </>
    );
}
export default Room;
