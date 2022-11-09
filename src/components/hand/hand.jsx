import React from 'react';
import { Rect, Group } from 'react-konva';
import Card from '../card/card'
import useWindowDimensions from '../../util/windowDimensions';
import * as Constants from '../../util/constants';

// deck data
const Hand = ({ cardsInHand, playerDiscardCard }) => {

    const [hands, setHands] = React.useState(cardsInHand);
    const height = window.innerHeight;
    const width = window.innerWidth;
    const state = {
        x: width / Constants.HAND_BOX_WIDTH_DIVIDER,
        y: height / Constants.HAND_BOX_HEIGHT_DIVIDER,
    }

    React.useEffect(() => {
        setHands(cardsInHand);
    }, [cardsInHand]);

    const onDragEnd = (e, card) => {
        console.log(e.evt.clientX, e.evt.clientY);
        console.log(width / Constants.HAND_BOX_WIDTH_DIVIDER, height / Constants.HAND_BOX_HEIGHT_DIVIDER);
        if ((e.evt.clientX >= width / Constants.HAND_BOX_WIDTH_DIVIDER) &&
            !(e.evt.clientY >= height / Constants.HAND_BOX_HEIGHT_DIVIDER)) {
            playerDiscardCard(card, e.evt.clientX , e.evt.clientY);
        }
    }



    return (
        <>

            <Rect
                strokeWidth={4} // border width
                stroke="lightseagreen" // border color
                // ref={this.shapeRef}
                x={state.x}
                y={state.y}
                // value={this.state.cardNumber}
                width={Constants.HAND_WIDTH}
                height={Constants.HAND_HEIGHT}
                fill={"rgb(100,117,117)"}
                shadowBlur={2}
            // draggable="true"
            // onDragMove={this.handleDragMove}
            />

            { /*Map cards in hand to visible hand
             TODO: make visible to player only */}

            {hands.map((card) => (
                <Group
                    key={card.id}
                    draggable
                    // onClick={() => handleClick(card)}
                    // onDragMove={(e) => onDragMove(e, card)}
                    onDragEnd={(e) => onDragEnd(e, card)}
                >
                    <Card
                        src={card.imageSource}
                        id={card.id}
                        x={state.x + (50 * (hands.indexOf(card) + 1))}
                        y={state.y + 35}
                    />
                </Group>
            ))}


        </>

    );
};

export default Hand;
