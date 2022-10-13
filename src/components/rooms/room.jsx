import React from 'react';
import './room.css';
import { io } from "socket.io-client";
import { Stage, Layer, Text } from 'react-konva';
import Card from '../card/card';
import CardImage from '../card/cardImage';

const url = process.env.NODE_ENV === 'production' ? "https://smartgamesandbox.herokuapp.com" : "http://localhost:5000";
const socket = io(url, { transports: ['websocket'] });
let roomID = null;
let roomPassword = null;
let username = null;

const Room = () => {
    const cardElement = React.useRef(React.createRef());
    const handleDragMove = (data) => {
        socket.emit("cardMove",
            { x: data.evt.offsetX, y: data.evt.offsetY, username: username, roomID: roomID }, (err) => {
                if (err) {
                    alert(err);
                }
            });
    }

    const handleClick = (data) => {
        console.log(data);
        socket.emit("cardFlip",
            { x: data.evt.offsetX, y: data.evt.offsetY, isFlipped: data.isFlipped, username: username, roomID: roomID }, (err) => {
                if (err) {
                    alert(err);
                }
            }
        );
    }

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
            // TODO: Add REAL username to room
            username = Math.random().toString(36).substring(7);
            joinRoom(roomID, roomPassword);
        });

        socket.on("cardPositionUpdate", (data) => {
            if (data.username !== username) {
                cardElement.current.moveToPosition(data);
            }
        });

        socket.on("cardFlipUpdate", (data) => {
            console.log(data);
            // if (data.username !== username) {
            //     console.log(data);
            //     cardElement.current.flipCard(data);
            // }
        });

        socket.on("error", (error) => {
            alert("Invalid room ID or password");
            window.location.href = "/joinroom";
            console.error(error);
        });

        return () => {
            socket.off("connect");
            socket.off("cardPositionUpdate");
            socket.off("cardFlipUpdate");
            socket.off("error");
        }
    }, []);

    return (
        <div>
                <Stage width={window.innerWidth} height={500}>
                    <Layer>
                        {/* <Text text="Try click on rect" /> */}
                        <Card ref={cardElement} onDragMove={handleDragMove} />
                    </Layer>
                </Stage>
            <br />
            <CardImage></CardImage>
        </div>
        //<Card ref={cardElement} onDragMove={handleDragMove} onClick={handleClick} />
    );
}
export default Room;
