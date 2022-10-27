import React from 'react';
import './room.css';
import { io } from "socket.io-client";
import Table from "../table/table";
import { Stage } from 'react-konva';
import axios from 'axios';
import styles from './roomStyle';

const url = process.env.NODE_ENV === 'production' ? "https://smartgamesandbox.herokuapp.com" : "http://localhost:5000";
const socket = io(url, { transports: ['websocket'] });
let roomID = null;
let roomPassword = null;

const Room = () => {
    const [imageUrl, setImageUrl] = React.useState('');
    const joinRoom = (roomID, roomPassword) => {
        socket.emit("joinRoom", { id: roomID, password: roomPassword }, (err) => {
            if (err) {
                console.log(err);
            }
        });
    }

    React.useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected to server");
            const search = window.location.search;
            const params = new URLSearchParams(search);
            roomID = params.get('id');
            roomPassword = params.get('password');
            axios.get(`${url}/api/room?id=${roomID}&password=${roomPassword}`).then((response) => {
                console.log(response.data);
                setImageUrl(response.data.image);
            }).catch((error) => {
                console.log(error);
            });
            // TODO: Add REAL username to room
            joinRoom(roomID, roomPassword);
        });

        return () => {
            socket.off("connect");
        }
    }, []);

    return (
        <>
            <img style={styles.roomBackground} alt="board" src={imageUrl} />
            <Stage width={window.innerWidth} height={window.innerHeight}>
                <Table socket={socket} />
            </Stage>
        </>
    );
}
export default Room;
