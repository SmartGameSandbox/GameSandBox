import React from 'react';
import Card from '../card/card'
import * as Constants from '../../util/constants';
import { Rect } from 'react-konva';

// deck data
const Deck = ({ socket, cardsInDeck, playerDrawCardFromDeck, roomID, username }) => {
    const [deck, setDeck] = React.useState(cardsInDeck);

    React.useEffect(() => {
        setDeck(cardsInDeck.map((card) => {
            card.x = Constants.DECK_STARTING_POSITION_X;
            card.y = Constants.DECK_STARTING_POSITION_Y;
            return card;
        }));
    }, [cardsInDeck]);

    const onClickCard = (e, cardID) => {
        setDeck((prevCards) => {
            return prevCards.map((card) => {
                if (card.id === cardID) {
                    card.isFlipped = !card.isFlipped;
                    card.imageSource = card.isFlipped ? `${process.env.PUBLIC_URL}/assets/images/PokerCardBack.png` :
                        `${process.env.PUBLIC_URL}/assets/images/PokerCardFront/card_${cardID}.jpg`;
                }
                return card;
            });
        });
    }

    const onDragEnd = (e, cardID) => {
        const position = e.target.attrs;
        if (
            position.x >= Constants.DECK_STARTING_POSITION_X - Constants.CARD_WIDTH &&
            position.x <= Constants.DECK_STARTING_POSITION_X + Constants.DECK_AREA_WIDTH &&
            position.y >= Constants.DECK_STARTING_POSITION_Y - Constants.CARD_HEIGHT &&
            position.y <= Constants.DECK_STARTING_POSITION_Y + Constants.DECK_AREA_HEIGHT
        ) {
            setDeck([]);
            setDeck(cardsInDeck);
        } else {
            const targetCard = deck.find((card) => card.id === cardID);
            setDeck((prevCards) => {
                // remove card from cardsInHand
                return prevCards.filter((c) => {
                    return c.id !== cardID;
                });
            });
            playerDrawCardFromDeck(targetCard, e.target.attrs.x, e.target.attrs.y);

            // Add card to cards)
            socket.emit("cardDeckToTable",
                { username: username, roomID: roomID, card: targetCard }, (err) => {
                    if (err) {
                        console.error(err);
                    }
                }
            );
        }
    }

    return (
        <>
            <Rect
                x={Constants.DECK_STARTING_POSITION_X}
                y={Constants.DECK_STARTING_POSITION_Y}
                width={Constants.DECK_AREA_WIDTH}
                height={Constants.DECK_AREA_HEIGHT}
                cornerRadius={10}
                fill={"rgba(177, 177, 177, 0.6)"}
            />

            { /*Map cards in hand to visible hand
             TODO: make visible to player only */}

            {deck.map((card) => (
                <Card
                    src={card.imageSource}
                    id={card.id}
                    x={Constants.DECK_STARTING_POSITION_X + Constants.DECK_PADDING}
                    y={Constants.DECK_STARTING_POSITION_Y + Constants.DECK_PADDING}
                    socket={socket}
                    isOnTable={false}
                    isFlipped={card.isFlipped}
                    onClick={onClickCard}
                    onDragStart={() => { }}
                    onDragEnd={onDragEnd}
                    onDragMove={() => { }}
                    draggable
                />
            ))}
        </>
    );
};

export default Deck;
