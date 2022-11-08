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

const Room = () => {
    const [imageUrl, setImageUrl] = React.useState('');
    const joinRoom = (roomID, roomPassword) => {
        socket.emit("joinRoom", { id: roomID, password: roomPassword }, () => {});
    }
    const [width, setWidth] = React.useState();
    const [height, setHeight] = React.useState();

    const getScreenSize = () => {
        const newWidth = (window.innerWidth - Constants.WINDOW_BUFFER_WIDTH);
        setWidth(newWidth);
    
        const newHeight = (window.innerHeight - Constants.WINDOW_BUFFER_HEIGHT);
        setHeight(newHeight);
      };

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
            }).catch((error) => {
                console.log(error);
            });

            // fixed size!!!
            setWidth(window.innerHeight);
            setHeight(window.innerWidth);
            // TODO: Add REAL username to room
            
        });

        return () => {
            socket.off("connect");
        }
    }, []);

    React.useEffect(() => {
        window.addEventListener("resize", getScreenSize);
      }, []);

    console.log(width, height)

    return (
        <>  {
                imageUrl !== undefined && imageUrl !== '' && imageUrl !== null &&
                <img style={styles.roomBackground} alt="board" src={imageUrl} />
            }
            <Stage width={width} height={height}>
                <Table socket={socket}/>
            </Stage>
        </>
    );
}
export default Room;
