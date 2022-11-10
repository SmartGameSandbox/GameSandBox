import React from 'react';
import { Rect, Group } from 'react-konva';
import Card from '../card/card'
import * as Constants from '../../util/constants';

// deck data
const Hand = ({ cardsInHand, playerDiscardCard }) => {
    const [hands, setHands] = React.useState(cardsInHand);

    React.useEffect(() => {
        setHands(cardsInHand.map((card, index) => {
            card.x= 30 + (Constants.HAND_CARD_GAP * (index + 1));
            card.y= Constants.CANVAS_HEIGHT - Constants.HAND_HEIGHT + 15;
            return card;
        }));
    }, [cardsInHand]);

    const handleClick = (card) => {
        setHands((prevHands) => {
            return prevHands.map((hand) => {
                if (hand.id === card.id) {
                    hand.isFlipped = !hand.isFlipped;
                    hand.imageSource = hand.isFlipped ? `${process.env.PUBLIC_URL}/assets/images/PokerCardBack.png` :
                        `${process.env.PUBLIC_URL}/assets/images/PokerCardFront/card_${hand.id}.jpg`;
                }
                return hand;
            });
        });
    }

    const onDragEnd = (e, card) => {
        if (e.evt.clientY <= Constants.CANVAS_HEIGHT - Constants.HAND_HEIGHT) {
            playerDiscardCard(card, e.evt.offsetX - 0.5 * Constants.CARD_WIDTH, e.evt.offsetY - 0.5 * Constants.CARD_HEIGHT);
        } else {
            setHands([]);
            setHands(hands);
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

            { /*Map cards in hand to visible hand
             TODO: make visible to player only */}

            {hands.map((card) => (
                <Group
                    key={card.id}
                    draggable
                    onDragEnd={(e) => onDragEnd(e, card)}
                    onClick={() => handleClick(card)}
                >
                    <Card
                        src={card.imageSource}
                        id={card.id}
                        x={card.x}
                        y={card.y}
                    />
                </Group>
            ))}


        </>

    );
};

export default Hand;
