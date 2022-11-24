import React from 'react';
import { Layer, Rect } from 'react-konva';
import Card from '../card/card';
import * as Constants from '../../util/constants'
import Cursors from '../cursor/cursors';
import Hand from '../hand/hand';
import Deck from '../deck/deck';

const search = window.location.search;
const params = new URLSearchParams(search);
const roomID = params.get('id');

const Table = ({ socket, username }) => {
    const [currentUsername] = React.useState(username);
    const [cards, setCards] = React.useState([]);
    const [cardsInDeck, setCardsInDeck] = React.useState([]);
    const [cursors, setCursors] = React.useState([]);
    const [cardsInHand, setCardsInHand] = React.useState([]);

    React.useEffect(() => {
        socket.on("roomCardData", (data) => {
            setCardsInDeck(data.deck);
            setCards(data.cards);
            setCardsInHand(data.hands[currentUsername]);
        });

        socket.on("cardChangeOnTableUpdate", (data) => {
            if (data.username !== currentUsername) {
                // update card position
                setCards((prevCards) => {
                    // remove target card from cards
                    const newCards = prevCards.filter((card) => card.id !== data.card.id);
                    return [...newCards, data.card];
                });
            }
        });

        socket.on("cardDeckToTableUpdate", (data) => {
            if (data.username !== currentUsername) {
                cardDeckToTable(data.card, data.card.x, data.card.y);
            }
        });

        socket.on("cardDeckToHandUpdate", (data) => {
            if (data.username !== currentUsername) {
                // Remove card from hand
                setCardsInDeck((prevCards) => {
                    return prevCards.filter((element) => {
                        return element.id !== data.card.id;
                    });
                });
            }
        });

        socket.on("cardHandToDeckUpdate", (data) => {
            if (data.username !== currentUsername) {
                // add card to Deck
                setCardsInDeck((prevCards) => {
                    return [...prevCards, data.card];
                });
            }
        });

        socket.on("cardTableToDeckUpdate", (data) => {
            if (data.username !== currentUsername) {
                cardTableToDeck(data.card);
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

        socket.on('cardTableToHandUpdate', (data) => {
            if (data.username !== currentUsername) {
                // remove card from deck
                setCards((prevCards) => {
                    return prevCards.filter((card) => card.id !== data.card.id);
                });
            }
        })

        socket.on('cardHandToTableUpdate', (data) => {
            if (data.username !== currentUsername) {
                // add card in data to cards
                setCards((prevCards) => {
                    return prevCards.concat(data.card);
                });
            }
        })

        return () => {
            socket.off("roomCardData");
            socket.off("cardChangeOnDeckUpdate");
            socket.off("cardChangeOnTableUpdate");
            socket.off("cardDeckToTableUpdate");
            socket.off("cardTableToDeckUpdate");
            socket.off("cardTableToHandUpdate");
            socket.off("cardHandToTableUpdate");
            socket.off("cardDeckToHandUpdate");
            socket.off("cardHandToDeckUpdate");
            socket.off("mousePositionUpdate");
        }
    }, [socket, currentUsername]);

    const onDragMoveCard = (e, cardID) => {
        const targetCard = cards.find((card) => card.id === cardID);
        targetCard.x = e.target.attrs.x;
        targetCard.y = e.target.attrs.y;
        socket.emit("cardChangeOnTable",
            {
                username: currentUsername,
                roomID: roomID,
                card: targetCard
            }, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        socket.emit("mouseMove", { x: e.evt.offsetX, y: e.evt.offsetY, username: currentUsername, roomID: roomID }, (err) => {
            if (err) {
                alert(err);
            }
        });
    }

    const onClickCard = (e, cardID) => {
        let targetCard;
        setCards((prevCards) => {
            return prevCards.map((card) => {
                if (card.id === cardID) {
                    card.isFlipped = !card.isFlipped;
                    card.imageSource = card.isFlipped ? `${process.env.PUBLIC_URL}/assets/images/PokerCardBack.png` :
                        `${process.env.PUBLIC_URL}/assets/images/PokerCardFront/card_${cardID}.jpg`;
                    targetCard = card;
                }
                return card;
            });
        });
        socket.emit("cardChangeOnTable",
            {
                username: currentUsername,
                roomID: roomID,
                card: targetCard
            }, (err) => {
                if (err) {
                    console.error(err);
                }
            }
        );
    }

    const cardHandToTable = (card, positionX, positionY) => {
        setCards((prevCards) => {
            card.x = positionX;
            card.y = positionY;
            return [...prevCards, card];
        });

        // Remove card from cardsInHand
        setCardsInHand((prevCards) => {
            return prevCards.filter((c) => {
                return c.id !== card.id;
            });
        });
    }

    const cardDeckToTable = (card, positionX, positionY) => {
        setCards((prevCards) => {
            card.x = positionX;
            card.y = positionY;
            return [...prevCards, card];
        });

        // remove card from cardsInDeck
        setCardsInDeck((prevCards) => {
            return prevCards.filter((c) => {
                return c.id !== card.id;
            });
        });
    }

    const cardDeckToHand = (card) => {
        setCardsInHand((prevCards) => {
            return [...prevCards, card];
        });

        // Remove card from deck
        setCardsInDeck((prevCards) => {
            return prevCards.filter((element) => {
                return element.id !== card.id;
            });
        });
    }

    const cardHandToDeck = (card) => {
        setCardsInDeck((prevCards) => {
            return [...prevCards, card];
        });

        // Remove card from deck
        setCardsInHand((prevCards) => {
            return prevCards.filter((element) => {
                return element.id !== card.id;
            });
        });
    }

    const cardTableToDeck = (card) => {
        setCardsInDeck((prevCards) => {
            return [...prevCards, card];
        });

        // Remove card from cards
        setCards((prevCards) => {
            return prevCards.filter((element) => {
                return element.id !== card.id;
            });
        });
    }

    const onDragEndCard = (e, cardID) => {
        const targetCard = cards.find((card) => card.id === cardID);
        const position = e.target.attrs;

        // Draw Card from table to hand
        if (position.y > Constants.CANVAS_HEIGHT - Constants.HAND_HEIGHT - 0.5 * Constants.CARD_HEIGHT) {
            setCardsInHand((prevCards) => {
                return [...prevCards, targetCard];
            });

            // Remove card from cards
            setCards((prevCards) => {
                return prevCards.filter((element) => {
                    return element.id !== cardID;
                });
            });

            socket.emit("cardTableToHand",
                { username: currentUsername, roomID: roomID, card: targetCard }, (err) => {
                    if (err) {
                        console.error(err);
                    }
                }
            );
        }

        // Put card to deck
        else if (
            position.x >= Constants.DECK_STARTING_POSITION_X - Constants.CARD_WIDTH &&
            position.x <= Constants.DECK_STARTING_POSITION_X + Constants.DECK_AREA_WIDTH &&
            position.y >= Constants.DECK_STARTING_POSITION_Y - Constants.CARD_HEIGHT &&
            position.y <= Constants.DECK_STARTING_POSITION_Y + Constants.DECK_AREA_HEIGHT
        ) {
            targetCard.x = Constants.DECK_STARTING_POSITION_X + Constants.DECK_PADDING;
            targetCard.y = Constants.DECK_STARTING_POSITION_Y + Constants.DECK_PADDING;
            cardTableToDeck(targetCard);
            socket.emit("cardTableToDeck", { username: currentUsername, roomID: roomID, card: targetCard }, (err) => {
                if (err) {
                    console.error(err);
                }
            });
        }
    }

    return (
        <>
            <Layer>
                <Rect
                    x={0}
                    y={Constants.CANVAS_HEIGHT - Constants.HAND_HEIGHT}
                    width={Constants.HAND_WIDTH}
                    height={Constants.HAND_HEIGHT}
                    fill={"rgba(100, 177, 177, 1)"}
                />

                <Deck
                    cardDeckToTable={cardDeckToTable}
                    cardDeckToHand={cardDeckToHand}
                    cardsInDeck={cardsInDeck}
                    socket={socket}
                    username={currentUsername}
                    roomID={roomID}
                    onDragMove={onDragMoveCard}
                />
                {cards.map((card) => (
                    <Card
                        socket={socket}
                        username={currentUsername}
                        roomID={roomID}
                        key={`card_${card.id}`}
                        src={card.imageSource}
                        id={card.id}
                        x={card.x}
                        y={card.y}
                        isFlipped={card.isFlipped}
                        onDragStart={() => { }}
                        onDragMove={onDragMoveCard}
                        onClick={onClickCard}
                        onDragEnd={onDragEndCard}
                    />
                ))}
                <Hand
                    cardHandToTable={cardHandToTable}
                    cardHandToDeck={cardHandToDeck}
                    username={currentUsername}
                    roomID={roomID}
                    cardsInHand={cardsInHand}
                    socket={socket}
                />
            </Layer>
            <Layer>
                <Cursors key={`cursor_${currentUsername}`} cursors={cursors} username={currentUsername} />
            </Layer>
        </>
    );
};

export default Table;
