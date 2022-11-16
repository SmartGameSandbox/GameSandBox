import React from 'react';
import { Rect, Group } from 'react-konva';
import Card from '../card/card'
import * as Constants from '../../util/constants';

// deck data
const Deck = ({ cardsInDeck, playerDiscardCardFromDeck}) => {
    const [deck, setDeck] = React.useState(cardsInDeck);

    React.useEffect(() => {
        setDeck(cardsInDeck.map((card) => {
            card.x= Constants.DECK_STARTING_POSITION_X + 2;
            card.y= Constants.DECK_STARTING_POSITION_Y;
            return card;
        }));
    }, [cardsInDeck]);

    const handleClick = (card) => {
        setDeck((prevHands) => {
            return prevHands.map((hand) => {
                if (hand.id === card.id) {
                    hand.isFlipped = !hand.isFlipped;
                    hand.imageSource = hand.isFlipped ? `${process.env.PUBLIC_URL}/assets/images/PokerCardBack.png` :
                        `${process.env.PUBLIC_URL}/assets/images/PokerCardFront/card_${hand.id}.jpg`;
                }
                return hand;
            });
        });
    }

    const onDragEnd = (e, card) => {
        console.log(e.evt.clientX, e.evt.clientY);
        console.log(Constants.DECK_STARTING_POSITION_X , Constants.DECK_STARTING_POSITION_Y)
        // Discard card from deck if card outside deck
        if (e.evt.clientX <= Constants.DECK_STARTING_POSITION_X || e.evt.clientX >= Constants.DECK_STARTING_POSITION_X + Constants.DECK_AREA_WIDTH ||
            e.evt.clientY <= Constants.DECK_STARTING_POSITION_Y || e.evt.clientY >= Constants.DECK_STARTING_POSITION_Y + Constants.DECK_AREA_HEIGHT) {
            playerDiscardCardFromDeck(card, e.evt.offsetX - 0.5 * Constants.CARD_WIDTH, e.evt.offsetY - 0.5 * Constants.CARD_HEIGHT);
        } else {
            setDeck([]);
            setDeck(deck);
        }
    }

    return (
        <>
            <Rect
                x={Constants.DECK_STARTING_POSITION_X}
                y={Constants.DECK_STARTING_POSITION_Y}
                width={Constants.DECK_AREA_WIDTH}
                height={Constants.DECK_AREA_HEIGHT}
                fill={"rgba(177, 177, 177, 1)"}
            />

            { /*Map cards in hand to visible hand
             TODO: make visible to player only */}

            {deck.map((card) => (
                <Group
                    key={card.id}
                    draggable
                    onDragEnd={(e) => onDragEnd(e, card)}
                    onClick={() => handleClick(card)}
                >
                    <Card
                        src={card.imageSource}
                        id={card.id}
                        x={card.x}
                        y={card.y}
                    />
                </Group>
            ))}


        </>

    );
};

export default Deck;
