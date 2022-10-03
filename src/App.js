import React, { Component } from 'react';
import './App.css';
import { io } from "socket.io-client";
import { Stage, Layer, Text } from 'react-konva';
import Card from './components/card/card';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.cardElement = React.createRef();
  }
  state = {
    connected: false,
    username: null,
    socket: null
  };

  componentDidMount() {
    const socket = io('http://localhost:5000', {
      transports: ['websocket']
    });
    socket.on("connect", () => {
      this.setState({
        connected: true,
        socket: socket,
        username: Math.random().toString()
      });
      socket.on("cardPositionUpdate", (data) => {
        console.log("received", data);
        if (data.username !== this.state.username) {
          this.cardElement.current.moveToPosition(data);
        }
      });
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
