import React from 'react';
import Card from '../card/card'
import * as Constants from '../../util/constants';

// deck data
const Hand = ({ cardsInHand, username, roomID, cardHandToTable, cardHandToDeck, socket }) => {
    const [hands, setHands] = React.useState(cardsInHand);

    React.useEffect(() => {
        setHands(cardsInHand.map((card, index) => {
            card.x = 30 + (Constants.HAND_CARD_GAP * (index + 1));
            card.y = Constants.CANVAS_HEIGHT - Constants.HAND_HEIGHT + 15;
            return card;
        }));
    }, [cardsInHand]);

    const onClickCard = (e, cardID) => {
        const targetCard = hands.find((card) => card.id === cardID);
        targetCard.isFlipped = !targetCard.isFlipped;
        targetCard.imageSource = targetCard.isFlipped ? `${process.env.PUBLIC_URL}/assets/images/PokerCardBack.png` :
            `${process.env.PUBLIC_URL}/assets/images/PokerCardFront/card_${cardID}.jpg`;
        setHands((prevCards) => {
            return prevCards.map((card) => {
                if (card.id === cardID) {
                    return targetCard;
                }
                return card;
            });
        });
        socket.emit("cardChangeOnHand",
            {
                username: username,
                roomID: roomID,
                card: targetCard
            }, (err) => {
                if (err) {
                    console.log(err);
                }
        });
    }
    
    const onDragMoveCard = (e, cardID) => {
        const targetCard = hands.find((card) => card.id === cardID);
        targetCard.x = e.target.attrs.x;
        targetCard.y = e.target.attrs.y;
        socket.emit("cardChangeOnHand",
            {
                username: username,
                roomID: roomID,
                card: targetCard
            }, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        socket.emit("mouseMove", { x: e.evt.offsetX, y: e.evt.offsetY, username: username, roomID: roomID }, (err) => {
            if (err) {
                alert(err);
            }
        });
    }

    const onDragEndCard = (e, cardID) => {
        const position = e.target.attrs;
        if (
            position.x >= Constants.DECK_STARTING_POSITION_X - Constants.CARD_WIDTH &&
            position.x <= Constants.DECK_STARTING_POSITION_X + Constants.DECK_AREA_WIDTH &&
            position.y >= Constants.DECK_STARTING_POSITION_Y - Constants.CARD_HEIGHT &&
            position.y <= Constants.DECK_STARTING_POSITION_Y + Constants.DECK_AREA_HEIGHT
        ) {
            // card hand to deck
            const targetCard = hands.find((card) => card.id === cardID);
            targetCard.x = Constants.DECK_STARTING_POSITION_X + Constants.DECK_PADDING;
            targetCard.y = Constants.DECK_STARTING_POSITION_Y + Constants.DECK_PADDING;
            cardHandToDeck(targetCard);
            socket.emit("cardHandToDeck",
                { username: username, roomID: roomID, card: targetCard }, (err) => {
                    if (err) {
                        console.error(err);
                    }
                }
            );
        } else if (position.y < Constants.CANVAS_HEIGHT - Constants.HAND_HEIGHT - 0.8 * Constants.CARD_HEIGHT) {
            // card hand to table
            const targetCard = hands.find((card) => card.id === cardID);
            cardHandToTable(targetCard, e.target.attrs.x, e.target.attrs.y);
            socket.emit("cardHandToTable",
                { username: username, roomID: roomID, card: targetCard }, (err) => {
                    if (err) {
                        console.error(err);
                    }
                }
            );
        } else {
            // card table to hand
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
            {hands.map((card) => (
                <Card
                    key={"hand_" + card.id}
                    src={card.imageSource}
                    id={card.id}
                    x={card.x}
                    y={card.y}
                    socket={socket}
                    isFlipped={card.isFlipped}
                    onClick={onClickCard}
                    onDragStart={() => {}}
                    onDragEnd={onDragEndCard}
                    onDragMove={onDragMoveCard}
                    draggable
                />
            ))}
        </>
    );
};

export default Hand;
