import React from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';
import cardBackImage from '../../assets/images/PokerBack.png'

const deckData = {
    x: 50,
    y: 50
}

const deckRef = React.createRef();
const Deck = ({ socket }) => {
    // const socketSetting = socket.socket;
    const [image] = useImage(cardBackImage);
    const handleDragMove = (data) => {
        // TODO: Send data to server
        // socketSetting.emit("cardMove",
        //     { x: data.evt.offsetX, y: data.evt.offsetY, username: Math.random().toString(), roomID: "9HQT" }, (err) => {
        //         if (err) {
        //             alert(err);
        //         }
        //     });
    }
    // socketSetting.on("cardPositionUpdate", (data) => {
    //     // TODO: Get data to server
    //     console.log("data", data);
    //     deckRef.current.position(data);
    // });
    return (
        <Image
            ref={deckRef}
            x={deckData.x}
            y={deckData.y}
            image={image}
            draggable
            onDragMove={handleDragMove}
        />
    );
}

export default Deck;