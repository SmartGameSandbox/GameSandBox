import React from 'react';
import { Layer, Group } from 'react-konva';
import Deck from '../deck/deck';
import Card from '../card/card';
import Hand from '../hand/hand';
import Konva from 'konva';


// deck data
function generateCards() {
    return [...Array(52)].map((_, i) => ({
        id: i.toString(),
        x: 50,
        y: 50,
        imageSource: `${process.env.PUBLIC_URL}/assets/images/PokerCardBack.png`,
        isFlipped: false,
    }));
}

// when card reaches certain coordinate, or overlaps with hand, add it to the hand container data structure
function placeCardInHand() {
    return
}

//
function checkPosition(pos) {
    console.log(pos)
    if((pos.x >= 300 && pos.x <= 800) ) {
        placeCardInHand(pos)
    }
}

const INITIAL_STATE = generateCards();

const Table = (socket) => {
    const [cards, setCards] = React.useState(INITIAL_STATE);

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
        <Layer>
                <Group>
                    <Hand></Hand>
                </Group>
            </Layer>
            <Layer>
                <Deck socket={socket} />
                {cards.map((card) => (
                    <Group onClick={handleClick} key={card.id} id={card.id}>
                        <Card
                        src={card.imageSource}
                        key={card.id}
                        id={card.id}
                        />
                    </Group>
                ))}
            </Layer>
            
        </>
    );
};

export default Table;
