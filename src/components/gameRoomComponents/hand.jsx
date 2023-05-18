import React from 'react';
import Card from './card'
import * as Constants from '../../util/constants';

// deck data
const Hand = ({ tableData, setCanEmit, setTableData, emitMouseChange }) => {
    const onDragEndCard = (e, cardID) => {
        const position = e.target.attrs;
        let deckX, deckY, deckW, deckH;
        const deckIndex = tableData.cardsInDeck.findIndex((pile) => pile.includes(cardID)) ?? -1;
        if (deckIndex > -1) {
            deckX = tableData.deckDimension[deckIndex].x;
            deckY = tableData.deckDimension[deckIndex].y;
            deckW = tableData.deckDimension[deckIndex].width * 0.8;
            deckH = tableData.deckDimension[deckIndex].height * 0.8;
          }
        setCanEmit(true);
        if (deckX && position.x >= deckX - deckW && position.x <= deckX + deckW
            && position.y >= deckY - deckH && position.y <= deckY + deckH) {
            // hand to deck
            setTableData((prevTable) => {
                // find card
                const found = prevTable.hand.find((card) => card.id === cardID);
                found.x = deckX;
                found.y = deckY;
                prevTable.hand = prevTable.hand.filter((card) => card.id !== cardID)
                    .map((card, index) => {
                        return card;
                    });
                prevTable.deck[deckIndex].push(found);
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
                        return card;
                    });
                prevTable.cards = [...prevTable.cards, found];
                return { ...prevTable };
            });
        } else {
            // deck area movement
            setTableData((prevTable) => {
                prevTable.hand.map((card, index) => {
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
                            : card.imageSource.back.data
                                ? card.imageSource.back
                                : card.imageSource.front}
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
