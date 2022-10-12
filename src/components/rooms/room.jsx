import React, { Component } from 'react';
import './room.css';
import { io } from "socket.io-client";
import { Stage, Layer, Text } from 'react-konva';
import Card from '../card/card';

export default class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connected: false,
            username: null,
            socket: null,
            roomID: null
        };
        this.cardElement = React.createRef();
    }

    componentDidMount() {
        let search = window.location.search;
        let params = new URLSearchParams(search);
        this.setState({ roomID: params.get('id') });
        let password = params.get('password');
        const url = process.env.NODE_ENV === 'production' ? "https://smartgamesandbox.herokuapp.com/" : "http://localhost:5000";
        const socket = io(url,
            {
                transports: ['websocket'],
                query: {
                    id: this.state.roomID,
                    password: password,
                    username: this.state.username
                }
            }
        );

        socket.on("connect", () => {
            this.setState({
                connected: true,
                socket: socket,
                username: Math.random().toString()
            });
            socket.on("cardPositionUpdate", (data) => {
                if (data.username !== this.state.username) {
                    this.cardElement.current.moveToPosition(data);
                }
            });
        });

        socket.on("error", (error) => {
            console.error(error);
        });
    }

    handleDragMove = (data) => {
        this.state.socket.emit("cardMove",
            { x: data.evt.offsetX, y: data.evt.offsetY, username: this.state.username }, (err) => {
                if (err) {
                    alert(err);
                }
            });
    }

    render() {
        // Stage is a div container
        // Layer is actual canvas element (so you may have several canvases in the stage)
        // And then we have canvas shapes inside the Layer
        return (
            <Stage width={window.innerWidth} height={window.innerHeight}>
                <Layer>
                    <Text text="Try click on rect" />
                    <Card ref={this.cardElement} onDragMove={this.handleDragMove} />
                </Layer>
            </Stage>
        );
    }
}