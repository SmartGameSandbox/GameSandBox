import { useEffect, useState, createRef } from 'react';
import './room.css';
import { io } from "socket.io-client";
import { Stage, Layer, Text } from 'react-konva';
import Card from '../card/card';

const url = process.env.NODE_ENV === 'production' ? "https://smartgamesandbox.herokuapp.com/" : "http://localhost:5000";
const socket = io(url, {
    transports: ['websocket']
});

const Room = () => {
    const [username, setUsername] = useState('');
    const [roomID, setroomID] = useState('');
    const [roomPassword, setRoomPassword] = useState('');
    const cardElement = createRef();

    const handleDragMove = (data) => {
        socket.emit("cardMove",
            { x: data.evt.offsetX, y: data.evt.offsetY, username: username, roomID: roomID }, (err) => {
                if (err) {
                    alert(err);
                }
            });
    }

    useEffect(() => {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        setroomID(params.get('id'));
        setRoomPassword(params.get('password'));

        socket.on("connect", () => {
            setUsername(Math.random().toString(36).substring(7));
            socket.emit("joinRoom", { id: roomID, password: roomPassword }, (err) => {
                if (err) {
                    alert(err);
                }
            });
            socket.on("cardPositionUpdate", (data) => {
                if (data.username !== username) {
                    cardElement.current.moveToPosition(data);
                }
            });
        });

        socket.on("error", (error) => {
            window.location.href = "/";
            console.error(error);
        });
    }, [roomID, roomPassword, username, cardElement]);

    return (
        <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer>
                <Text text="Try click on rect" />
                <Card ref={cardElement} onDragMove={handleDragMove} />
            </Layer>
        </Stage>
    );
}
export default Room;
