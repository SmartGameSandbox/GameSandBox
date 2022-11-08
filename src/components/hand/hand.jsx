import React from 'react';
import { Rect } from 'react-konva';
import Card from '../card/card'
import useWindowDimensions from '../../util/windowDimensions';
import * as Constants from '../../util/constants';

// deck data
const Hand = ({cardsInHand}) => {

    const [hands, setHands] = React.useState(cardsInHand);
    const { height, width } = useWindowDimensions();
    const state = {
        x: width / Constants.HAND_BOX_WIDTH_DIVIDER,
        y: height / Constants.HAND_BOX_HEIGHT_DIVIDER,
    }

    React.useEffect(() => {
        setHands(cardsInHand);
    }, [cardsInHand]);

    return (
        <>
            <Rect
                // ref={this.shapeRef}
                x={state.x}
                y={state.y}
                // value={this.state.cardNumber}
                width={Constants.HAND_WIDTH}
                height={Constants.HAND_HEIGHT}
                fill={"rgb(117,117,117)"}
                shadowBlur={5}
            // draggable="true"
            // onDragMove={this.handleDragMove}
            />

            { /*Map cards in hand to visible hand
             TODO: make visible to player only */}

            {hands.map((card) => (
                <Card
                    src={card.imageSource}
                    key={card.id}
                    id={card.id}
                    x={state.x + ( 50 * (hands.indexOf(card) + 1))}
                    y={state.y + 35}
                    tableHeight={height}
                    tableWidth={width}
                    draggable='true'
                />
            ))}


        </>

    );
};

export default Hand;
