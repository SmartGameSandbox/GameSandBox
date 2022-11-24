import React from 'react';
import Card from '../card/card'
import * as Constants from '../../util/constants';
import { Rect } from 'react-konva';

// deck data
const Deck = ({ socket, cardsInDeck, cardDeckToTable, cardDeckToHand, roomID, username }) => {
    const [deck, setDeck] = React.useState(cardsInDeck);

    React.useEffect(() => {
        socket.on("cardChangeOnDeckUpdate", (data) => {
            if (data.username !== username) {
                // update card position
                setDeck((prevCards) => {
                    // remove target card from cards
                    const newCards = prevCards.filter((card) => card.id !== data.card.id);
                    return [...newCards, data.card];
                });
            }
        });

        return () => {
            socket.off("cardChangeOnDeckUpdate");
        }
    }, [socket, username]);

    React.useEffect(() => {
        setDeck(cardsInDeck);
    }, [cardsInDeck]);

    const onClickCard = (e, cardID) => {
        const targetCard = deck.find((card) => card.id === cardID);
        targetCard.isFlipped = !targetCard.isFlipped;
        targetCard.imageSource = targetCard.isFlipped ? `${process.env.PUBLIC_URL}/assets/images/PokerCardBack.png` :
            `${process.env.PUBLIC_URL}/assets/images/PokerCardFront/card_${cardID}.jpg`;
        setDeck((prevCards) => {
            return prevCards.map((card) => {
                if (card.id === cardID) {
                    return targetCard;
                }
                return card;
            });
        });
        socket.emit("cardChangeOnDeck",
            {
                username: username,
                roomID: roomID,
                card: targetCard
            }, (err) => {
                if (err) {
                    console.log(err);
                }
            });
    }

    const onDragMoveCard = (e, cardID) => {
        const targetCard = deck.find((card) => card.id === cardID);
        targetCard.x = e.target.attrs.x;
        targetCard.y = e.target.attrs.y;
        socket.emit("cardChangeOnDeck",
            {
                username: username,
                roomID: roomID,
                card: targetCard
            }, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        socket.emit("mouseMove", { x: e.evt.offsetX, y: e.evt.offsetY, username: username, roomID: roomID }, (err) => {
            if (err) {
                alert(err);
            }
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
            // deck area movement
            const targetCard = deck.find((card) => card.id === cardID);
            targetCard.x = Constants.DECK_STARTING_POSITION_X + Constants.DECK_PADDING;
            targetCard.y = Constants.DECK_STARTING_POSITION_Y + Constants.DECK_PADDING;
            const newCards = deck.filter((card) => card.id !== cardID);
            setDeck([]);
            setDeck([...newCards, targetCard]);
            socket.emit("cardChangeOnDeck",
                {
                    username: username,
                    roomID: roomID,
                    card: targetCard
                }, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
        } else if (position.y > Constants.CANVAS_HEIGHT - Constants.HAND_HEIGHT - 0.5 * Constants.CARD_HEIGHT) {
            // deck to hand
            const targetCard = deck.find((card) => card.id === cardID);
            cardDeckToHand(targetCard);
            socket.emit("cardDeckToHand",
                { username: username, roomID: roomID, card: targetCard }, (err) => {
                    if (err) {
                        console.error(err);
                    }
                }
            );
        } else {
            // deck to table
            const targetCard = deck.find((card) => card.id === cardID);
            cardDeckToTable(targetCard, position.x, position.y);
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
                key="deck_square"
                x={Constants.DECK_STARTING_POSITION_X}
                y={Constants.DECK_STARTING_POSITION_Y}
                width={Constants.DECK_AREA_WIDTH}
                height={Constants.DECK_AREA_HEIGHT}
                cornerRadius={10}
                fill={"rgba(177, 177, 177, 0.6)"}
            />

            {deck.map((card) => (
                <Card
                    key={"deck_card_" + card.id}
                    src={card.imageSource}
                    id={card.id}
                    x={card.x}
                    y={card.y}
                    socket={socket}
                    isFlipped={card.isFlipped}
                    onClick={onClickCard}
                    onDragStart={() => { }}
                    onDragEnd={onDragEnd}
                    onDragMove={onDragMoveCard}
                    draggable
                />
            ))}
        </>
    );
};

export default Deck;
