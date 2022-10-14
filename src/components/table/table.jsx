import React from 'react';
import { Layer, Group } from 'react-konva';
import Deck from '../deck/deck';
import Card from '../card/card';
import Hand from '../hand/hand';

// deck data
function generateCards() {
    return [...Array(52)].map((_, i) => ({
        id: i.toString(),
        x: 50,
        y: 50,
        imageSource: `${process.env.PUBLIC_URL}/assets/images/PokerCardBack.png`,
        isFlipped: false,
    }));
}

const INITIAL_STATE = generateCards();

const Table = (socket) => {
    const [cards, setCards] = React.useState(INITIAL_STATE);

    const handleClick = (e) => {
        const targetedGroup = e.target.getGroup();
        console.log(targetedGroup);
        // const id = e.target.id();
        // setCards(
        //     cards.map((card) => {
        //       return {
        //         ...card,
        //         imageSource: card.id === id && card.isFlipped ? `${process.env.PUBLIC_URL}/assets/images/PokerCardBack.png` : `${process.env.PUBLIC_URL}/assets/images/PokerCardFront/card_${id}.jpg`,
        //         isFlipped: card.id === id && card.isFlipped ? false : true
        //       };
        //     })
        // );
    }

    return (
        <>
            <Layer>
                <Deck socket={socket} />
                {cards.map((card) => (
                    <Group onClick={handleClick} key={card.id} id={card.id}>
                        <Card
                        src={card.imageSource}
                        key={card.id}
                        id={card.id}
                        />
                    </Group>
                ))}
            </Layer>
            <Layer>
                <Hand></Hand>
            </Layer>
        </>
    );
};

export default Table;
