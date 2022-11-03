import React from 'react';
import { Rect } from 'react-konva';
import Card from '../card/card'
import useWindowDimensions from '../../util/windowDimensions';
import * as Constants from '../../util/constants';

// deck data
const Hand = ({ tableCards }) => {

    const cards = [{
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

    const { height, width } = useWindowDimensions();
    const state = {
        x: width / Constants.HAND_BOX_WIDTH_DIVIDER,
        y: height / Constants.HAND_BOX_HEIGHT_DIVIDER,
    }
    
    const placeCardOnTable = (e) => {
        tableCards.push(e)
    }

    const placeCardInHand = (e) => {
        // move card by id from table into hand
        // card = {
        //     id: 'test3',
        //     x: 100,
        //     y: 100,
        //     imageSource: `${process.env.PUBLIC_URL}/assets/images/PokerCardFront/card_46.jpg`,
        //     isFlipped: false,
        // }
        this.state.placeCardInHand()
    }

    const handleClick = (e) => {
        const targetedGroup = e.target.getGroup();
        console.log(targetedGroup);
        // const id = e.target.id();
        // setCards(
        //     cards.map((card) => {
        //       return {
        //         ...card,
        //         imageSource: card.id === id && card.isFlipped ? `${process.env.PUBLIC_URL}/assets/images/PokerCardBack.png` : `${process.env.PUBLIC_URL}/assets/images/PokerCardFront/card_${id}.jpg`,
        //         isFlipped: card.id === id && card.isFlipped ? false : true
        //       };
        //     })
        // );
    }

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

            {cards.map((card) => (
                <Card
                    src={card.imageSource}
                    key={card.id}
                    id={card.id}
                    x={state.x + ( 50 * (cards.indexOf(card) + 1))}
                    y={state.y + 35}
                    tableHeight={height}
                    tableWidth={width}
                    placeCardInHand={placeCardInHand}
                />
            ))}


        </>

    );
};

export default Hand;
