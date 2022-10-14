import React from 'react';
import { Layer } from 'react-konva';
import Deck from '../deck/deck';
import CardImage from '../card/image';

// deck data
function generateCards() {
    return [...Array(52)].map((_, i) => ({
        id: i,
        x: 50,
        y: 50,
        imageSource: null,
        isFlipped: false,
    }));
}

const INITIAL_STATE = generateCards();

const Table = (socket) => {
    const [cards, setCards] = React.useState(INITIAL_STATE);

    return (
        <>
            <Layer>
                {/* <Deck socket={socket} /> */}
                {cards.map((card) => (
                    <CardImage src={`${process.env.PUBLIC_URL}/assets/images/PokerCardBack.png`}></CardImage>
                ))}
            </Layer>
            <Layer>
            </Layer>
        </>
    );
};

export default Table;
