import React from 'react';
import { Layer, Rect, Text } from 'react-konva';
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
        });

        socket.on('cardHandToTableUpdate', (data) => {
            if (data.username !== currentUsername) {
                // add card in data to cards
                setCards((prevCards) => {
                    return prevCards.concat(data.card);
                });
            }
        });

        socket.on('collectCardsUpdate', (data) => {
            if (data.username !== currentUsername) {
                // concat cards to cardsInDeck
                setCardsInDeck((prevCards) => {
                    return [...prevCards.concat(data.cards)];
                });
                // remove all cards from table
                setCards([]);
            }
        });

        socket.on('shuffleCardsUpdate', (data) => {
            if (data.username !== currentUsername) {
                //set cardsInDeck to data.cards
                setCardsInDeck([...data.cards]);
                alert("Deck shuffled!");
            }
        });

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
            socket.off("collectCardsUpdate");
            socket.off("shuffleCardsUpdate");
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
        let targetCard = cards.find((card) => card.id === cardID);
        targetCard.isFlipped = !targetCard.isFlipped;
        targetCard.imageSource = targetCard.isFlipped ? `${process.env.PUBLIC_URL}/assets/images/PokerCardBack.png` :
            `${process.env.PUBLIC_URL}/assets/images/PokerCardFront/card_${cardID}.jpg`;
        setCards((prevCards) => {
            return prevCards.map((card) => {
                if (card.id === cardID) {
                    return targetCard;
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
        card.x = positionX;
        card.y = positionY;
        setCards((prevCards) => {
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
        card.x = positionX;
        card.y = positionY;
        setCards((prevCards) => {
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

    const collectCards = () => {
        // concat cards to cardsInDeck
        setCardsInDeck((prevCards) => {
            return [...prevCards, ...cards];
        });
        // set position to deck position for all cards
        setCards((prevCards) => {
            return prevCards.map((card) => {
                card.x = Constants.DECK_STARTING_POSITION_X + Constants.DECK_PADDING;
                card.y = Constants.DECK_STARTING_POSITION_Y + Constants.DECK_PADDING;
                card.isFlipped = true;
                card.imageSource = `${process.env.PUBLIC_URL}/assets/images/PokerCardBack.png`;
                return card;
            });
        });
        socket.emit("collectCards", { username: currentUsername, roomID: roomID, cards: cards }, (err) => {
            if (err) {
                console.error(err);
            }
        });
        setCards([]);
    }

    const shuffle = (array) => {
        let currentIndex = array.length, randomIndex;
        // While there remain elements to shuffle.
        while (currentIndex !== 0) {
            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    const shuffleCards = () => {
        // shuffle cardsInDeck
        const newCards = [].concat(cardsInDeck);
        // set all cards to be flipped
        newCards.map((card) => {
            card.isFlipped = true;
            card.imageSource = `${process.env.PUBLIC_URL}/assets/images/PokerCardBack.png`;
            return card;
        });
        shuffle(newCards);
        setCardsInDeck(newCards);
        socket.emit("shuffleCards", { username: currentUsername, roomID: roomID, cards: newCards }, (err) => {
            if (err) {
                console.error(err);
            }
        });
        alert("Deck shuffled!");
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
                <Text x={0} y={0} padding={10} key={`collect_btn`} fill={"black"} fontSize={20} text={"Collect Cards"}
                    onClick={() => collectCards()}
                />
                <Text x={150} y={0} padding={10} key={`shuffle_btn`} fill={"black"} fontSize={20} text={"Shuffle Cards"}
                    onClick={() => shuffleCards()}
                />
                <Cursors key={`cursor_${currentUsername}`} cursors={cursors} username={currentUsername} />
            </Layer>
        </>
    );
};

export default Table;
