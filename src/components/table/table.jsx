import React from 'react';
import { Layer, Group } from 'react-konva';
import Card from '../card/card';
import * as Constants from '../../util/constants'
import Hand from '../hand/hand'
import useWindowDimensions from '../../util/windowDimensions';

const generateCards = () => {
    return [...Array(52)].map((_, i) => ({
        id: i.toString(),
        x: Constants.DECK_STARTING_POSITION_X,
        y: Constants.DECK_STARTING_POSITION_Y,
        imageSource: `${process.env.PUBLIC_URL}/assets/images/PokerCardBack.png`,
        isFlipped: true,
    }));
}

// cards in hand demo
const generateHand = () => {
    return [{
                        id: 'test',
                        x: 100,
                        y: 100,
                        imageSource: `${process.env.PUBLIC_URL}/assets/images/PokerCardFront/card_2.jpg`,
                        isFlipped: false,
                    },
                    {
                        id: 'test2',
                        x: 100,
                        y: 100,
                        imageSource: `${process.env.PUBLIC_URL}/assets/images/PokerCardFront/card_31.jpg`,
                        isFlipped: false,
                    },
                    {
                        id: 'test3',
                        x: 100,
                        y: 100,
                        imageSource: `${process.env.PUBLIC_URL}/assets/images/PokerCardFront/card_46.jpg`,
                        isFlipped: false,
                    }]
}

const search = window.location.search;
const params = new URLSearchParams(search);
const roomID = params.get('id');
const username = Date.now().toString();

const INITIAL_STATE = generateCards();
const HAND_STATE = generateHand();

const Table = (socket) => {
    socket = socket.socket;
    const { height, width } = useWindowDimensions();
    const [cards, setCards] = React.useState(INITIAL_STATE);
    const [cardsInHand, setCardsInHand] = React.useState(HAND_STATE);

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

        socket.on('cardHandUpdate', (data) => {
            if (data.username !== username) {
                setCardsInHand(() => {
                    return [{
                        id: 'test',
                        x: 100,
                        y: 100,
                        imageSource: `${process.env.PUBLIC_URL}/assets/images/PokerCardFront/card_2.jpg`,
                        isFlipped: false,
                    },
                    {
                        id: 'test2',
                        x: 100,
                        y: 100,
                        imageSource: `${process.env.PUBLIC_URL}/assets/images/PokerCardFront/card_31.jpg`,
                        isFlipped: false,
                    },
                    {
                        id: 'test3',
                        x: 100,
                        y: 100,
                        imageSource: `${process.env.PUBLIC_URL}/assets/images/PokerCardFront/card_46.jpg`,
                        isFlipped: false,
                    }]
                })
            }
        })

        

        return () => {
            socket.off('cardPositionUpdate');
            socket.off('cardFlipUpdate');
            socket.off('cardHandUpdate')
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
        console.log(e.evt.clientX >= width/Constants.HAND_BOX_WIDTH_DIVIDER)
        console.log(e.evt.clientY >= height/Constants.HAND_BOX_HEIGHT_DIVIDER)
        if ((e.evt.clientX >= width/Constants.HAND_BOX_WIDTH_DIVIDER) && (e.evt.clientY >= width/Constants.HAND_BOX_HEIGHT_DIVIDER)) {
            setCardsInHand(() => {
                return cards.forEach((element) => {
                    // console.log(e.target.index.toString())
                    console.log(element.id)
                    if (e.target.index.toString() == element.id) {
                        console.log("match")
                        return element
                    }
                    
                })
            })
        }
    }
    return (
        <>
            <Layer>
                <Hand
                cardsInHand={cardsInHand}
                />


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
