import React from 'react';
import { Layer } from 'react-konva';
import Deck from '../deck/deck';
import CardImage from '../card/image';
import PokerBack from "../../assets/images/PokerBack.png"
import PokerFront from "../../assets/images/PokerFront_2Heart.jpg"

// deck data
function generateCards() {
    return [...Array(52)].map((_, i) => ({
        id: i,
        x: 50,
        y: 50,
        imageSource: PokerBack
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
                    <CardImage src={card.imageSource}></CardImage>
                ))}
            </Layer>
            <Layer>
            </Layer>
        </>
    );
};

export default Table;
