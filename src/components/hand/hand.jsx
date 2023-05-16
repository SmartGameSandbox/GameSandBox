import React from 'react';
import Card from '../card/card'
import * as Constants from '../../util/constants';

// deck data
const Hand = ({ tableData, setCanEmit, setTableData, emitMouseChange }) => {
    const onDragEndCard = (e, cardID) => {
        const position = e.target.attrs;
        setCanEmit(true);
        if (
            position.x >= Constants.DECK_STARTING_POSITION_X - Constants.CARD_WIDTH &&
            position.x <= Constants.DECK_STARTING_POSITION_X + Constants.DECK_AREA_WIDTH &&
            position.y >= Constants.DECK_STARTING_POSITION_Y - Constants.CARD_HEIGHT &&
            position.y <= Constants.DECK_STARTING_POSITION_Y + Constants.DECK_AREA_HEIGHT
        ) {
            // hand to deck
            setTableData((prevTable) => {
                // find card
                const found = prevTable.hand.find((card) => card.id === cardID);
                found.x = Constants.DECK_STARTING_POSITION_X + Constants.DECK_PADDING;
                found.y = Constants.DECK_STARTING_POSITION_Y + Constants.DECK_PADDING;
                prevTable.hand = prevTable.hand.filter((card) => card.id !== cardID)
                    .map((card, index) => {
                        card.x = Constants.HAND_PADDING_X + index * Constants.HAND_CARD_GAP;
                        card.y = Constants.CANVAS_HEIGHT - Constants.HAND_HEIGHT + Constants.HAND_PADDING_Y;
                        return card;
                    });
                prevTable.deck = [...prevTable.deck, found];
                return { ...prevTable };
            });
        } else if (position.y < Constants.CANVAS_HEIGHT - Constants.HAND_HEIGHT - 0.8 * Constants.CARD_HEIGHT) {
            // hand to table
            setTableData((prevTable) => {
                // find card
                const found = prevTable.hand.find((card) => card.id === cardID);
                found.x = position.x;
                found.y = position.y;
                prevTable.hand = prevTable.hand.filter((card) => card.id !== cardID)
                    .map((card, index) => {
                        card.x = Constants.HAND_PADDING_X + index * Constants.HAND_CARD_GAP;
                        card.y = Constants.CANVAS_HEIGHT - Constants.HAND_HEIGHT + Constants.HAND_PADDING_Y;
                        return card;
                    });
                prevTable.cards = [...prevTable.cards, found];
                return { ...prevTable };
            });
        } else {
            // deck area movement
            setTableData((prevTable) => {
                prevTable.hand.map((card, index) => {
                    if (card.id === cardID) {
                        card.x = Constants.HAND_PADDING_X + index * Constants.HAND_CARD_GAP;
                        card.y = Constants.CANVAS_HEIGHT - Constants.HAND_HEIGHT + Constants.HAND_PADDING_Y;
                    }
                    return card;
                });
                return { ...prevTable };
            });
        }
    }

    const onDragMoveCard = (e, cardID) => {
        setCanEmit(false);
        setTableData((prevTable) => {
            // find card in cards array
            const found = prevTable.hand.find((card) => card.id === cardID);
            found.x = e.target.attrs.x;
            found.y = e.target.attrs.y;
            // move found to the last index of cards array
            return { ...prevTable };
        });
        emitMouseChange(e);
    }

    return (
        <>
            {tableData?.hand?.map((card) => (
                <Card
                    key={"hand_" + card.id}
                    src={card.isFlipped
                            ? card.imageSource.front
                            : card.imageSource.back}
                    id={card.id}
                    type={card.type}
                    x={card.x}
                    y={card.y}
                    isLandscape={card.isLandscape}
                    onDragEnd={onDragEndCard}
                    onDragMove={onDragMoveCard}
                    draggable
                />
            ))}
        </>
    );
};

export default Hand;
