import { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import axios from 'axios';
import { Stage } from 'react-konva';
import Table from "../table/table";
import { BASE_URL, CANVAS_WIDTH, CANVAS_HEIGHT } from '../../util/constants'
import styles from './roomStyle';
import Header from '../header/header';

const socket = io(BASE_URL, { transports: ['websocket'] });

const Room = () => {
    const [imageUrl, setImageUrl] = useState('');
    const [username, setUsername] = useState(localStorage.getItem('username'));
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
        if (!roomID) return;
        setUsername(localStorage.getItem('username'));
        axios.get(`${BASE_URL}/api/room?id=${roomID}`).then((response) => {
            setImageUrl(response.data.image);
            socket.emit("joinRoom", { roomID: roomID, username: username });
        // })
        // .catch((error) => {
        //     console.log(error);
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
}
export default Room;
