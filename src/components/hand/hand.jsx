import React from 'react';
import { Layer, Group, Rect} from 'react-konva';
import Card from '../card/card'
import Konva from 'konva';

// deck data


const Hand = ({tableCards}) => {
    const cards = []

    const state = {
        x: 300,
        y: 600,
        
    }

    const placeCardOnTable = (e) => {
        tableCards.push(e)
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
                width={800}
                height={300}
                fill={"rgb(117,117,117)"}
                shadowBlur={5}
                // draggable="true"
                // onDragMove={this.handleDragMove}
            />
                {cards.map((card) => (
                    <Group onClick={handleClick} key={card.id} id={card.id}>
                        <Card
                        src={card.imageSource}
                        key={card.id}
                        id={card.id}
                        />
                    </Group>
                ))}

        </>
    );
};

export default Hand;
