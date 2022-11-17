import React from 'react';
import { Layer } from 'react-konva';
import Card from '../card/card';
import * as Constants from '../../util/constants'
import Cursors from '../cursor/cursors';
import Hand from '../hand/hand';

const search = window.location.search;
const params = new URLSearchParams(search);
const roomID = params.get('id');
const HAND_STATE = [];

const Table = ({ socket, username }) => {
    const [currentUsername] = React.useState(username);
    const [cards, setCards] = React.useState([]);
    const [cursors, setCursors] = React.useState([]);
    const [cardsInHand, setCardsInHand] = React.useState(HAND_STATE);

    React.useEffect(() => {
        socket.on('cardPositionUpdate', (data) => {
            if (data.username !== currentUsername) {
                // update card position
                setCards((prevCards) => {
                    // find target card
                    const targetCard = prevCards.find((card) => card.id === data.cardID);
                    targetCard.x = data.x;
                    targetCard.y = data.y;
                    // remove target card from cards
                    const newCards = prevCards.filter((card) => card.id !== data.cardID);
                    return [...newCards, targetCard];
                });
            }
        });

        socket.on("roomCardData", (data) => {
            setCards(data.cards);
        });

        socket.on('cardFlipUpdate', (data) => {
            if (data.username !== currentUsername) {
                setCards((prevCards) => {
                    // find target card
                    const targetCard = prevCards.find((card) => card.id === data.cardID);
                    targetCard.isFlipped = data.isFlipped;
                    targetCard.imageSource = data.imageSource;
                    // remove target card from cards
                    const newCards = prevCards.filter((card) => card.id !== data.cardID);
                    return [...newCards, targetCard];
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
                // remove card from deck
                setCards((prevCards) => {
                    return prevCards.filter((card) => card.id !== data.cardID);
                });
            }
        })

        socket.on('cardDiscardUpdate', (data) => {
            if (data.username !== currentUsername) {
                // add card in data to cards
                setCards((prevCards) => {
                    return prevCards.concat(data.card);
                });
            }
        })

        return () => {
            socket.off("roomCardData");
            socket.off('cardPositionUpdate');
            socket.off('cardFlipUpdate');
            socket.off("mousePositionUpdate");
            socket.off('cardDrawUpdate');
            socket.off('playerDiscardCard');
        }
    }, [socket, currentUsername]);

    const onDragMoveCard = (e, cardID) => {
        socket.emit("cardMove",
            {
                x: e.target.attrs.x,
                y: e.target.attrs.y,
                username: currentUsername,
                roomID: roomID,
                cardID: cardID
            }, (err) => {
                if (err) {
                    console.error(err);
                }
            }
        );

        socket.emit("mouseMove", { 
            x: e.target.attrs.x + 0.5 * Constants.CARD_WIDTH, 
            y: e.target.attrs.y + 0.5 * Constants.CARD_HEIGHT,
            username: username, 
            roomID: roomID 
        }, (err) => {
            if (err) {
                alert(err);
            }
        })
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
        socket.emit("cardFlip",
          {
            isFlipped: targetCard.isFlipped,
            username: currentUsername,
            imageSource: targetCard.imageSource,
            roomID: roomID,
            cardID: cardID
          }, (err) => {
            if (err) {
              console.error(err);
            }
          }
        );
    }

    const playerDiscardCard = (card, positionX, positionY) => {
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

    const onDragEndCard = (e, cardID) => {
        if (e.target.attrs.y > Constants.CANVAS_HEIGHT - Constants.HAND_HEIGHT - 0.5 * Constants.CARD_HEIGHT) {
            const targetCard = cards.find((card) => card.id === cardID);
            setCardsInHand((prevCards) => {
                return [...prevCards, targetCard];
            });
    
            // Remove card from cards
            setCards((prevCards) => {
                return prevCards.filter((element) => {
                    return element.id !== cardID;
                });
            });

            socket.emit("cardDraw",
              { username: currentUsername, roomID: roomID, cardID: cardID }, (err) => {
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
                <Hand
                    playerDiscardCard={playerDiscardCard}
                    username={currentUsername}
                    roomID={roomID}
                    cardsInHand={cardsInHand}
                    socket={socket}
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
                        onDragMove={onDragMoveCard}
                        onClick={onClickCard}
                        onDragEnd={onDragEndCard}
                    />
                ))}
            </Layer>
            <Layer>
                <Cursors key={`cursor_${currentUsername}`} cursors={cursors} username={currentUsername} />
            </Layer>
        </>
    );
};

export default Table;
