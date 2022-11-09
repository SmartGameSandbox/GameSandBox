import React from 'react';
import { Layer, Group } from 'react-konva';
import Card from '../card/card';
import * as Constants from '../../util/constants'
import Cursors from '../cursor/cursors';
import Hand from '../hand/hand';

const generateCards = () => {
    return [...Array(52)].map((_, i) => ({
        id: i.toString(),
        x: Constants.DECK_STARTING_POSITION_X,
        y: Constants.DECK_STARTING_POSITION_Y,
        imageSource: `${process.env.PUBLIC_URL}/assets/images/PokerCardBack.png`,
        isFlipped: true,
    }));
}

const search = window.location.search;
const params = new URLSearchParams(search);
const roomID = params.get('id');
const INITIAL_STATE = generateCards();
const HAND_STATE = [];

const Table = ({ socket, username }) => {
    const height = window.innerHeight;
    const width = window.innerWidth;
    const [currentUsername] = React.useState(username);
    const [cards, setCards] = React.useState(INITIAL_STATE);
    const [cursors, setCursors] = React.useState([]);
    const [cardsInHand, setCardsInHand] = React.useState(HAND_STATE);

    React.useEffect(() => {
        socket.on('cardPositionUpdate', (data) => {
            if (data.username !== currentUsername) {
                setCards((prevCards) => {
                    return prevCards.map((card) => {
                        if (card.id === data.cardID) {
                            card.x = data.x;
                            card.y = data.y;
                        }
                        return card;
                    });
                });
            }
        });

        socket.on('cardFlipUpdate', (data) => {
            if (data.username !== currentUsername) {
                setCards((prevCards) => {
                    return prevCards.map((card) => {
                        if (card.id === data.cardID) {
                            setCardFlip(card, data.isFlipped);
                        }
                        return card;
                    });
                });
            }
        });

        socket.on("mousePositionUpdate", (data) => {
            if (data.username !== currentUsername) {
                // update cursor position in object inside cursors
                setCursors((prevCursors) => {
                    const found = prevCursors.find((cursor) => cursor.username === data.username);
                    if (found) {
                        return prevCursors.map((cursor) => {
                            if (cursor.username === data.username) {
                                cursor.x = data.x;
                                cursor.y = data.y;
                            }
                            return cursor;
                        });
                    } else {
                        prevCursors.push({ username: data.username, x: data.x, y: data.y });
                        return prevCursors;
                    }
                });
            }
        });

        socket.on('cardDrawUpdate', (data) => {
            if (data.username !== currentUsername) {
                // Remove card from cards
                setCards((prevCards) => {
                    return prevCards.filter((card) => {
                        return card.id !== data.cardID;
                    });
                });
            }
        })

        // TODO:change func
        socket.on('playerDiscardCardUpdate', (data) => {
            if (data.username !== currentUsername) {
            }
        })

        return () => {
            socket.off('cardPositionUpdate');
            socket.off('cardFlipUpdate');
            socket.off("mousePositionUpdate");
            socket.off("userJoinSignal");
            socket.off('cardHandUpdate');
            socket.off('playerDiscardCard');
        }
    }, [socket, currentUsername]);

    const playerDiscardCard = (card, positionX, positionY) => {
        // . Add card to cards
        setCards((prevCards) => {
            card.x = positionX - Constants.CARD_DRAW_WIDTH_OFFSET;
            card.y = positionY - Constants.CARD_DRAW_HEIGHT_OFFSET;
            return [...prevCards, card];
        });

        // socket.emit('playerDiscardCard', { cardID: card.id, username: username });
        // Remove card from cardsInHand
        setCardsInHand((prevCards) => {
            return prevCards.filter((c) => {
                return c.id !== card.id;
            });
        });

    }

    const setCardFlip = (inputCard, isFlipped) => {
        inputCard.isFlipped = isFlipped;
        inputCard.imageSource = inputCard.isFlipped ? `${process.env.PUBLIC_URL}/assets/images/PokerCardBack.png` :
            `${process.env.PUBLIC_URL}/assets/images/PokerCardFront/card_${inputCard.id}.jpg`;
    }

    const handleClick = (card) => {
        setCards((prevCards) => {
            return prevCards.map((element) => {
                if (element.id === card.id) {
                    setCardFlip(element, !element.isFlipped);
                }
                return element;
            });
        });
        socket.emit("cardFlip",
            { isFlipped: card.isFlipped, username: username, roomID: roomID, cardID: card.id }, (err) => {
                if (err) {
                    console.error(err);
                }
            });
    }

    const onDragMove = (e, card) => {
        socket.emit("cardMove",
            { x: e.evt.offsetX, y: e.evt.offsetY, username: username, roomID: roomID, cardID: card.id }, (err) => {
                if (err) {
                    console.error(err);
                }
            });
    }

    const onDragEnd = (e, card) => {
        console.log('Drag end');

        // Update psuedo-z-index of card
        setCards((prevCards) => {
            return prevCards.filter((element) => {
                return element.id !== card.id;
            });
        });
        setCards((prevCards) => {
            card.x = e.evt.offsetX - Constants.CARD_DRAW_WIDTH_OFFSET;
            card.y = e.evt.offsetY - Constants.CARD_DRAW_HEIGHT_OFFSET;
            return [...prevCards, card];
        });

        // Area check for card draw
        if ((e.evt.clientX >= width / Constants.CARD_HAND_HITBOX_WIDTH_DIVIDER) &&
            (e.evt.clientY >= height / Constants.CARD_HAND_HITBOX_HEIGHT_DIVIDER)) {
            setCardsInHand((prevCards) => {
                setCardFlip(card, false);
                return [...prevCards, card];
            });

            // Remove card from cards
            setCards((prevCards) => {
                return prevCards.filter((element) => {
                    return element.id !== card.id;
                });
            });

            socket.emit("cardDraw",
                { username: username, roomID: roomID, cardID: card.id }, (err) => {
                    if (err) {
                        console.error(err);
                    }
                }
            );

        }
    }

    return (
        <>
            <Layer>
                <Cursors cursors={cursors} username={currentUsername} />
                <Hand
                    playerDiscardCard={playerDiscardCard}
                    cardsInHand={cardsInHand}
                />

                {cards.map((card) => (
                    <Group
                        key={`cardGroup_${card.id}`}
                        draggable
                        onClick={() => handleClick(card)}
                        onDragMove={(e) => onDragMove(e, card)}
                        onDragEnd={(e) => onDragEnd(e, card)}
                    >
                        <Card
                            key={`card_${card.id}`}
                            src={card.imageSource}
                            id={card.id}
                            x={card.x}
                            y={card.y}
                        />
                    </Group>
                ))}
            </Layer>
        </>
    );
};

export default Table;
