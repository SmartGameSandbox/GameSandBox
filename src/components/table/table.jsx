import React from 'react';
import { Layer, Group } from 'react-konva';
import Card from '../card/card';
import Hand from '../hand/hand';
import * as Constants from '../../util/constants'
import useWindowDimensions from '../../util/windowDimensions';

// deck data
function generateCards() {
    return [...Array(52)].map((_, i) => ({
        id: i.toString(),
        x: Constants.DECK_STARTING_POSITION_X,
        y: Constants.DECK_STARTING_POSITION_Y,
        imageSource: `${process.env.PUBLIC_URL}/assets/images/PokerCardBack.png`,
        isFlipped: false,
    }));
}

function shuffleCards(cards) {
    let currentIndex = cards.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [cards[currentIndex], cards[randomIndex]] = [
            cards[randomIndex], cards[currentIndex]];
    }

    return cards;
}

const INITIAL_STATE = generateCards();

const Table = (socket) => {
    const [cards, setCards] = React.useState(INITIAL_STATE);
    const playerHand = [...cards]

    const { height, width } = useWindowDimensions();

    // when card reaches certain coordinate, or overlaps with hand, add it to the hand container data structure
    function placeCardInHand(card) {
        playerHand.push(card);
        return card;
    }

    const handleClick = (event) => {
        const id = String(event.target.parent.index);
        setCards(
            cards.map((card) => {
                if (card.id === id) {
                    return {
                        ...card,
                        imageSource: card.isFlipped ? `${process.env.PUBLIC_URL}/assets/images/PokerCardBack.png` : `${process.env.PUBLIC_URL}/assets/images/PokerCardFront/card_${id}.jpg`,
                        isFlipped: card.isFlipped ? false : true
                    };
                } else {
                    return {
                        ...card
                    }
                }
            })
        );
    }

    return (
        <>
            <Layer>
                <Group>
                    <Hand
                        placeCardInHand={placeCardInHand}
                    />
                </Group>
            </Layer>
            <Layer>
                {/* <Deck socket={socket} /> */}
                {playerHand.map((card) => (
                    <Group onClick={handleClick}>
                        <Card
                            src={card.imageSource}
                            key={card.id}
                            id={card.id}
                            x={Constants.DECK_STARTING_POSITION_X}
                            y={Constants.DECK_STARTING_POSITION_Y}
                            tableHeight={height}
                            tableWidth={width}
                        />
                    </Group>
                ))}
            </Layer>
        </>
    );
};

export default Table;
