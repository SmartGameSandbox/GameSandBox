import React from "react";
import Card from "../card/card";
import * as Constants from "../../util/constants";
import { Rect } from "react-konva";

// deck data
const Deck = ({ tableData, setCanEmit, setTableData, emitMouseChange }) => {
  const onDragMoveCard = (e, cardID) => {
    setCanEmit(true);
    setTableData((prevTable) => {
      // find card in cards array
      const found = prevTable.deck.find((card) => card.id === cardID);
      found.x = e.target.attrs.x;
      found.y = e.target.attrs.y;
      // move found to the last index of cards array
      prevTable.deck = prevTable.deck.filter((card) => card.id !== cardID);
      prevTable.deck = [...prevTable.deck, found];
      return { ...prevTable };
    });
    emitMouseChange(e);
  };

  const onClickCard = (e, cardID) => {
    // flip card
    setCanEmit(true);
    setTableData((prevTable) => {
      const found = prevTable.deck.find((card) => card.id === cardID);
      found.isFlipped = !found.isFlipped;
      // move found to the last index of cards array
      prevTable.deck = prevTable.deck.filter((card) => card.id !== cardID);
      prevTable.deck = [...prevTable.deck, found];
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
        prevTable.deck = prevTable.deck.map((card) => {
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
        const found = prevTable.deck.find((card) => card.id === cardID);
        // add card to hand
        prevTable.hand.push(found);
        found.x =
          Constants.HAND_PADDING_X +
          (prevTable.hand.length - 1) * Constants.HAND_CARD_GAP;
        found.y =
          Constants.CANVAS_HEIGHT -
          Constants.HAND_HEIGHT +
          Constants.HAND_PADDING_Y;
        prevTable.deck = prevTable.deck.filter((card) => card.id !== cardID);
        return { ...prevTable };
      });
    } else {
      // deck to table
      setTableData((prevTable) => {
        // find card in tableData.deck
        const found = prevTable.deck.find((card) => card.id === cardID);
        found.x = position.x;
        found.y = position.y;
        // add card to hand
        prevTable.cards.push(found);
        prevTable.deck = prevTable.deck.filter((card) => card.id !== cardID);
        return { ...prevTable };
      });
    }
  };

  if (!tableData) {
    return null; //prevent loading before tableData is set*
  }

  return (
    <>
      <Rect
        key="deck_square"
        // x={Constants.DECK_STARTING_POSITION_X}
        x={
          Constants.DECK_STARTING_POSITION_X + 
          (tableData.deck.length > 0 && tableData.deck[0].isLandscape ? 20 : 0)
        }
        y={Constants.DECK_STARTING_POSITION_Y}
        width={Constants.DECK_AREA_WIDTH}
        height={Constants.DECK_AREA_HEIGHT}
        cornerRadius={10}
        fill={"rgba(177, 177, 177, 0.6)"}
        rotation={tableData.deck.some((card) => card.isLandscape) ? 90 : 0} // rotate by 90 degrees if any card is landscape
      />

      {tableData &&
        tableData.deck &&
        tableData.deck.map((card, index) => (
          <Card
            key={"deck_card_" + card.id}
            src={card.imageSource}
            id={card.id}
            x={card.x}
            y={card.y}
            isFlipped={card.isFlipped}
            isLandscape={card.isLandscape}
            onClick={onClickCard}
            onDragStart={() => {}}
            onDragEnd={onDragEnd}
            onDragMove={onDragMoveCard}
            draggable
          />
        ))}
    </>
  );
};

export default Deck;
