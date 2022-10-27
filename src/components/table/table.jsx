import React from 'react';
import { Layer, Group } from 'react-konva';
import Deck from '../deck/deck';
import Card from '../card/card';
import Hand from '../hand/hand';
import Konva from 'konva';
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

// when card reaches certain coordinate, or overlaps with hand, add it to the hand container data structure
function placeCardInHand(playerHand, card) {
    playerHand.push(card);
    return card;
}

//
function checkPosition(pos, height, width) {
    console.log(pos)

    if ((pos.x >= (height / Constants.HAND_BOX_HEIGHT_DIVIDER) && pos.x <= (width / Constants.HAND_BOX_WIDTH_DIVIDER))) {
        placeCardInHand(pos)
    }
}

const INITIAL_STATE = generateCards();

const Table = (socket) => {
    const [cards, setCards] = React.useState(INITIAL_STATE);
    const playerHand = []
    // const { height, width } = useWindowDimensions();


    // // Drag into hand code block
    // var width = window.innerWidth;
    // var height = window.innerHeight;

    // var stage = new Konva.Stage({
    //     container: 'container',
    //     width: width,
    //     height: height,
    //   });

    // var layer = new Konva.Layer();

    // stage.add(layer);
    // var tempLayer = new Konva.Layer();
    // stage.add(tempLayer);

    // var text = new Konva.Text({
    //   fill: 'black',
    // });
    // layer.add(text);



    const handleClick = (event) => {
        const id = String(event.target.parent.index);
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

    return (
        <>
            <Layer>
                <Group>
                    <Hand
                    // cards = {this.playerHand}
                    />
                </Group>
            </Layer>
            <Layer>
                {/* <Deck socket={socket} /> */}
                    {cards.map((card) => (
                        <Group onClick={handleClick}>
                        <Card
                            src={card.imageSource}
                            key={card.id}
                            id={card.id}
                            x={Constants.DECK_STARTING_POSITION_X}
                            y={Constants.DECK_STARTING_POSITION_Y}
                        />
                        </Group>
                    ))}
            </Layer>
        </>
    );
};

export default Table;
