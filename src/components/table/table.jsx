import React from 'react';
import { Layer, Group } from 'react-konva';
import Card from '../card/card';
import Hand from '../hand/hand';
import * as Constants from '../../util/constants'
import useWindowDimensions from '../../util/windowDimensions';

// deck data
function generateCards() {
    return [...Array(52)].map((_, i) => ({
        id: i.toString(),
        x: Constants.DECK_STARTING_POSITION_X,
        y: Constants.DECK_STARTING_POSITION_Y,
        imageSource: `${process.env.PUBLIC_URL}/assets/images/PokerCardBack.png`,
        isFlipped: false,
    }));
}

function shuffleCards(cards) {
    let currentIndex = cards.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [cards[currentIndex], cards[randomIndex]] = [
            cards[randomIndex], cards[currentIndex]];
    }

    return cards;
}

const INITIAL_STATE = generateCards();

const Table = (socket) => {
    const [cards, setCards] = React.useState(INITIAL_STATE);
    const playerHand = [...cards]
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const roomID = params.get('id');

    const { height, width } = useWindowDimensions();

    // when card reaches certain coordinate, or overlaps with hand, add it to the hand container data structure
    function placeCardInHand(card) {
        playerHand.push(card);
        return card;
    }

    const handleClick = (event) => {
        const id = String(event.target.parent.index);
        //TODO: add username
        socket.socket.emit("cardFlip",
          { card: id, room: roomID }, (err) => {
            if (err) {
              alert(err);
            }
          });

        setCards(
            cards.map((card) => {
                if (card.id === id) {
                    return {
                        ...card,
                        imageSource: card.isFlipped ? `${process.env.PUBLIC_URL}/assets/images/PokerCardBack.png` : `${process.env.PUBLIC_URL}/assets/images/PokerCardFront/card_${id}.jpg`,
                        isFlipped: card.isFlipped ? false : true
                    };
                } else {
                    return {
                        ...card
                    }
                }
            })
        );
    }

    const handleDragMove = (event) => {
        //TODO: add username
        socket.socket.emit("cardMove",
          { x: event.target.parent.children[0].attrs.x, y: event.target.parent.children[0].attrs.y, card: event.target.parent.index, room: roomID }, (err) => {
            if (err) {
              alert(err);
            }
          });
      }

    const moveCard = (xPosition, yPosition, cardNumber) => {
        setCards(
            cards.map((card) => {
                if (card.id === cardNumber) {
                    return {
                        ...card,
                        x: xPosition,
                        y: yPosition,
                    };
                } else {
                    return {
                        ...card
                    }
                }
            })
        );
    }

    React.useEffect(() => {
        console.log('Child => socket', socket);
        if (socket) {
          socket.socket.on("connect", () => {
            //console.log("received from parent" + data);
            // if (data.username !== this.state.username) {
            //   this.cardElement.current.moveToPosition(data);
            // }
            socket.socket.on("cardPositionUpdate", (data) => {
                console.log(data)
                moveCard(data.x, data.y, data.card);
            });

            socket.socket.on("cardFlipUpdate", (data) => {
                console.log(data)
            });
          });
        }
    }, [socket]);

    return (
        <>
            <Layer>
                <Group>
                    <Hand
                        placeCardInHand={placeCardInHand}
                    />
                </Group>
            </Layer>
            <Layer>
                {/* <Deck socket={socket} /> */}
                {playerHand.map((card) => (
                    <Group onClick={handleClick} onDragMove={handleDragMove}>
                        <Card
                            src={card.imageSource}
                            key={card.id}
                            id={card.id}
                            x={card.x}
                            y={card.y}
                            tableHeight={height}
                            tableWidth={width}
                        />
                    </Group>
                ))}
            </Layer>
        </>
    );
};

export default Table;
