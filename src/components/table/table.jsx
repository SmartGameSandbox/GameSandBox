import React from 'react';
import { Layer, Group } from 'react-konva';
import Card from '../card/card';
import * as Constants from '../../util/constants'

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

        return () => {
            socket.off('cardPositionUpdate');
            socket.off('cardFlipUpdate');
        }
    }, [socket]);

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
