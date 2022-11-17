import React from 'react';
import { Rect } from 'react-konva';
import Card from '../card/card'
import * as Constants from '../../util/constants';

// deck data
const Hand = ({ cardsInHand, username, roomID, playerDiscardCard, socket }) => {
    const [hands, setHands] = React.useState(cardsInHand);

    React.useEffect(() => {
        setHands(cardsInHand.map((card, index) => {
            card.x = 30 + (Constants.HAND_CARD_GAP * (index + 1));
            card.y = Constants.CANVAS_HEIGHT - Constants.HAND_HEIGHT + 15;
            return card;
        }));
    }, [cardsInHand]);

    const onClickCard = (e, cardID) => {
        setHands((prevCards) => {
            return prevCards.map((card) => {
                if (card.id === cardID) {
                    card.isFlipped = !card.isFlipped;
                    card.imageSource = card.isFlipped ? `${process.env.PUBLIC_URL}/assets/images/PokerCardBack.png` :
                        `${process.env.PUBLIC_URL}/assets/images/PokerCardFront/card_${cardID}.jpg`;
                }
                return card;
            });
        });
    }

    const onDragEndCard = (e, cardID) => {
        if (e.target.attrs.y < Constants.CANVAS_HEIGHT - Constants.HAND_HEIGHT - 0.8 * Constants.CARD_HEIGHT) {
            const targetCard = hands.find((card) => card.id === cardID);
            setHands((prevCards) => {
                // remove card from cardsInHand
                return prevCards.filter((c) => {
                    return c.id !== cardID;
                });
            });
            playerDiscardCard(targetCard, e.target.attrs.x, e.target.attrs.y);
            socket.emit("cardDiscard",
                { username: username, roomID: roomID, card: targetCard }, (err) => {
                    if (err) {
                        console.error(err);
                    }
                }
            );
        } else {
            setHands([]);
            setHands(
                cardsInHand.map((card, index) => {
                    if (card.id === cardID) {
                        card.x = 30 + (Constants.HAND_CARD_GAP * (index + 1));
                        card.y = Constants.CANVAS_HEIGHT - Constants.HAND_HEIGHT + 15;
                    }
                    return card;
                })
            );
        }
    }

    return (
        <>
            <Rect
                x={0}
                y={Constants.CANVAS_HEIGHT - Constants.HAND_HEIGHT}
                width={Constants.HAND_WIDTH}
                height={Constants.HAND_HEIGHT}
                fill={"rgba(100, 177, 177, 1)"}
            />

            {hands.map((card) => (
                <Card
                    src={card.imageSource}
                    id={card.id}
                    x={card.x}
                    y={card.y}
                    socket={socket}
                    isFlipped={card.isFlipped}
                    onClick={onClickCard}
                    onDragEnd={onDragEndCard}
                    onDragMove={() => {}}
                    draggable
                />
            ))}
        </>
    );
};

export default Hand;
