import React from 'react';
import { Layer } from 'react-konva';
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

        socket.on('cardChangeOnTableUpdate', (data) => {
            if (data.username !== currentUsername) {
                // update card position
                setCards((prevCards) => {
                    // remove target card from cards
                    const newCards = prevCards.filter((card) => card.id !== data.card.id);
                    return [...newCards, data.card];
                });
            }
        });

        // socket.on('cardFlipUpdate', (data) => {
        //     if (data.username !== currentUsername) {
        //         setCards((prevCards) => {
        //             // find target card
        //             const targetCard = prevCards.find((card) => card.id === data.cardID);
        //             targetCard.isFlipped = data.isFlipped;
        //             targetCard.imageSource = data.imageSource;
        //             // remove target card from cards
        //             const newCards = prevCards.filter((card) => card.id !== data.cardID);
        //             return [...newCards, targetCard];
        //         });
        //     }
        // });

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

        // socket.on('cardDrawToHandUpdate', (data) => {
        //     if (data.username !== currentUsername) {
        //         // remove card from deck
        //         setCards((prevCards) => {
        //             return prevCards.filter((card) => card.id !== data.cardID);
        //         });
        //     }
        // })

        // socket.on('cardDiscardUpdate', (data) => {
        //     if (data.username !== currentUsername) {
        //         // add card in data to cards
        //         setCards((prevCards) => {
        //             return prevCards.concat(data.card);
        //         });
        //     }
        // })

        // // playerDiscardCardFromHandUpdate
        // socket.on('playerDiscardCardFromHandUpdate', (data) => {
        //     if (data.username !== currentUsername) {
        //         // add card in data to cards
        //         setCardsInDeck((prevCards) => {
        //             return prevCards.concat(data.card);
        //         });
        //     }
        // })

        return () => {
            socket.off("roomCardData");
            socket.off('cardChangeOnTableUpdate');
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

    const playerDrawCardFromDeck = (card, positionX, positionY) => {
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

    const onDragEndCard = (e, cardID) => {
        const targetCard = cards.find((card) => card.id === cardID);
        const position = e.target.attrs;
        // Draw Card from table / deck to hand
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

            socket.emit("cardDrawToHand",
                { username: currentUsername, roomID: roomID, cardID: cardID }, (err) => {
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
            // Add card to cards
            setCardsInDeck((prevCards) => {
                return [...prevCards, targetCard];
            });

            // Remove card from cards
            setCards((prevCards) => {
                return prevCards.filter((element) => {
                    return element.id !== targetCard.id;
                });
            });
        }
    }

    return (
        <>
            <Layer>
                <Deck
                    playerDrawCardFromDeck = {playerDrawCardFromDeck}
                    cardsInDeck={cardsInDeck}
                    socket={socket}
                    username={currentUsername}
                    roomID={roomID}
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
                        onDragStart={() => {}}
                        onDragMove={onDragMoveCard}
                        onClick={onClickCard}
                        onDragEnd={onDragEndCard}
                    />
                ))}
                <Hand
                    cardHandToTable={cardHandToTable}
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
