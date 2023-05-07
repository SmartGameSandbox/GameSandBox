import React from "react";
import Card from "../card/card";
import * as Constants from "../../util/constants";
import { Rect } from "react-konva";

// deck data
const Deck = ({ tableData, deckIndex, setCanEmit, setTableData, emitMouseChange }) => {
  const onDragMoveCard = (e, cardID) => {
    setCanEmit(true);
    setTableData((prevTable) => {
      // find card in cards array
      const found = prevTable.deck[deckIndex].find((card) => card.id === cardID);
      found.x = e.target.attrs.x - deckIndex * 140;
      found.y = e.target.attrs.y;
      // move found to the last index of cards array
      prevTable.deck[deckIndex] = prevTable.deck[deckIndex].filter((card) => card.id !== cardID);
      prevTable.deck[deckIndex].push(found);
      return { ...prevTable };
    });
    emitMouseChange(e);
  };

  const onClickCard = (e, cardID) => {
    // flip card
    setCanEmit(true);
    setTableData((prevTable) => {
      const found = prevTable.deck[deckIndex].find((card) => card.id === cardID);
      found.isFlipped = !found.isFlipped;
      // move found to the last index of cards array
      prevTable.deck[deckIndex] = prevTable.deck[deckIndex].filter((card) => card.id !== cardID);
      prevTable.deck[deckIndex].push(found);
      return { ...prevTable };
    });
  };

  const onDragEnd = (e, cardID) => {
    const position = e.target.attrs;
    setCanEmit(true);
    if (
      position.x >= Constants.DECK_STARTING_POSITION_X - Constants.CARD_WIDTH &&
      position.x <=
        Constants.DECK_STARTING_POSITION_X + Constants.DECK_AREA_WIDTH &&
      position.y >=
        Constants.DECK_STARTING_POSITION_Y - Constants.CARD_HEIGHT &&
      position.y <=
        Constants.DECK_STARTING_POSITION_Y + Constants.DECK_AREA_HEIGHT
    ) {
      // deck area movement
      setTableData((prevTable) => {
        console.log(prevTable.deck)
        prevTable.deck[deckIndex] = prevTable.deck[deckIndex].map((card) => {
          if (card.id === cardID) {
            card.x =
              Constants.DECK_STARTING_POSITION_X + Constants.DECK_PADDING;
            card.y =
              Constants.DECK_STARTING_POSITION_Y + Constants.DECK_PADDING;
          }
          return card;
        });
        return { ...prevTable };
      });
    } else if (
      position.y >
      Constants.CANVAS_HEIGHT -
        Constants.HAND_HEIGHT -
        0.5 * Constants.CARD_HEIGHT
    ) {
      setTableData((prevTable) => {
        // find card in tableData.deck
        const found = prevTable.deck[deckIndex].find((card) => card.id === cardID);
        // add card to hand
        prevTable.hand.push(found);
        found.x =
          Constants.HAND_PADDING_X +
          (prevTable.hand.length - 1) * Constants.HAND_CARD_GAP;
        found.y =
          Constants.CANVAS_HEIGHT -
          Constants.HAND_HEIGHT +
          Constants.HAND_PADDING_Y;
        prevTable.deck[deckIndex] = prevTable.deck[deckIndex].filter((card) => card.id !== cardID);
        return { ...prevTable };
      });
    } else {
      // deck to table
      setTableData((prevTable) => {
        // find card in tableData.deck
        const found = prevTable.deck[deckIndex].find((card) => card.id === cardID);
        found.x = position.x;
        found.y = position.y;
        // add card to hand
        prevTable.cards.push(found);
        prevTable.deck[deckIndex] = prevTable.deck[deckIndex].filter((card) => card.id !== cardID);
        return { ...prevTable };
      });
    }
  };

  return (
    <>
      <Rect
        key={`deck_square_${deckIndex}`}
        x={Constants.DECK_STARTING_POSITION_X + deckIndex * 140}
        y={Constants.DECK_STARTING_POSITION_Y}
        width={Constants.DECK_AREA_WIDTH}
        height={Constants.DECK_AREA_HEIGHT}
        cornerRadius={10}
        fill={"rgba(177, 177, 177, 0.6)"}
      />

      {tableData?.deck?.[deckIndex].map((card) => (
          <Card
            key={`deck_card_${card.id}`}
            src={card.imageSource}
            id={card.id}
            x={card.x + deckIndex * 140}
            y={card.y}
            deckIndex={deckIndex}
            isFlipped={card.isFlipped}
            onClick={onClickCard}
            onDragEnd={onDragEnd}
            onDragMove={onDragMoveCard}
            draggable
          />
        ))}
    </>
  );
};

export default Deck;
