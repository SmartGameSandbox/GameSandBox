import React from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';
import cardBackImage from '../../assets/images/PokerBack.png'

const cardData = {
    x: 50,
    y: 50
}

const cardRef = React.createRef();
const Card = ({ socket }) => {
    // const socketSetting = socket.socket;
    const [image] = useImage(cardBackImage);

    return (
        <Image
            ref={cardRef}
            x={cardData.x}
            y={cardData.y}
            image={image}
            draggable
        />
    );
}

export default Card;