import React from 'react';
import './room.css';
import { io } from "socket.io-client";
import Table from "../table/table";
import { Stage } from 'react-konva';
import axios from 'axios';
import styles from './roomStyle';
import { CardTravelSharp } from '@mui/icons-material';

const url = process.env.NODE_ENV === 'production' ? "https://smartgamesandbox.herokuapp.com" : "http://localhost:5000";
const socket = io(url, { transports: ['websocket'] });
let roomID = null;
let roomPassword = null;

const Room = () => {
    const [imageUrl, setImageUrl] = React.useState('');

    const joinRoom = (roomID, roomPassword) => {
        socket.emit("joinRoom", { id: roomID, password: roomPassword, username: socket.id }, () => {});
    }

    const handleMouseMove = (data) => {
        socket.emit("mouseMove", { x: data.evt.offsetX, y: data.evt.offsetY, username: socket.id, roomID: roomID}, (err) => {
            if (err) {
                alert(err);
            }
        })
    }

    React.useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected to server");
            const search = window.location.search;
            const params = new URLSearchParams(search);
            roomID = params.get('id');
            roomPassword = params.get('password');
            axios.get(`${url}/api/room?id=${roomID}&password=${roomPassword}`).then((response) => {
                setImageUrl(response.data.image);
                joinRoom(roomID, roomPassword);
                //emit joine room event to add a cursor
            }).catch((error) => {
                console.log(error);
            });
            // TODO: Add REAL username to room
        });

        return () => {
            socket.off("connect");
        }
    }, []);

    return (
        <>  {
                imageUrl !== undefined && imageUrl !== '' && imageUrl !== null &&
                <img style={styles.roomBackground} alt="board" src={imageUrl} />
            }
            <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                onMouseMove={(e) => handleMouseMove(e)}
            >
                <Table socket={socket}/>
            </Stage>
        </>
    );
}
export default Room;
