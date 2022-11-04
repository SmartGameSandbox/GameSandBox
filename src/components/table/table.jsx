import React from 'react';
import { Layer, Group } from 'react-konva';
import Card from '../card/card';
import * as Constants from '../../util/constants'
import Cursor from '../cursor/cursor';

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
const username = Date.now().toString();

const INITIAL_STATE = generateCards();

const Table = (socket) => {
    socket = socket.socket;
    const [cards, setCards] = React.useState(INITIAL_STATE);
    const [cursors, setCursor] = React.useState([]);

    React.useEffect(() => {
        socket.on('cardPositionUpdate', (data) => {
            if (data.username !== username) {
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
            if (data.username !== username) {
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
            console.log(`${data.username} moved to x: ${data.x}, y: ${data.y}`);
            if(data.username !== socket.id) {
                setCursor(cursors.map((cursor) => {
                    if(cursor.username === data.username) {
                        cursor.x = data.x;
                        cursor.y = data.y;
                    }
                    return cursor;
                }));
            }
        });

        socket.on("userJoinSignal", (data) => {
            console.log("userJoinSignal");
            console.log(`${data.username} ==? ${socket.id}`)
            if(data.username !== socket.id) {
                console.log("is adding happening")
                console.log(`${data.username}`)
                // adding new item to array is not working
                setCursor([...cursors, {username: data.username, x: 0, y: 0}]);
                console.log(cursors)
            }
        });

        return () => {
            socket.off('cardPositionUpdate');
            socket.off('cardFlipUpdate');
            socket.off("mousePositionUpdate");
            socket.off("userJoinSignal");
        }
    }, [socket, cursors]);

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

    const onDragEnd = (e) => {
        console.log('Drag end');
        // CHECK IF IT IS MOVED TO HAND
    }

    return (
        <>
            <Layer>
                {cursors.map((cursor) => {
                     return <Cursor
                        key={cursor.username}
                        x={cursor.x}
                        y={cursor.y} />
                })} 
                {cards.map((card) => (
                    <Group
                        key={card.id}
                        draggable
                        onClick={() => handleClick(card)}
                        onDragMove={(e) => onDragMove(e, card)}
                        onDragEnd={onDragEnd}
                    >
                        <Card
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
