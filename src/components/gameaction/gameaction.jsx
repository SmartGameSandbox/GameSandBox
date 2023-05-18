// This module contains commonly used functions for game actions for each game piece type.
// Actions used by game objects should be placed here for organizational sake.
// When creating a Card (see card.jsx), assign an action to their corresponding Konva actions (onDragMove),
/**
 *  Example: (inside deck.jsx)
 *           <Card
 *             key={`deck_card_${card.id}${index}`}
 *             .
 *             .
 *             .
 *             onDragMove={onDragMoveCardGA}
 *             draggable
 *           />
 */
// Notes: OnDragMoveCardGA should be renamed to onDragMoveGA, as it can apply to tokens and pieces as well.

import * as Constants from "../../util/constants";

const onDragMoveCardGA = (e, cardID, deckIndex, setCanEmit, setTableData, emitMouseChange, gamePieceType) => {
    setCanEmit(true);
    setTableData((prevTable) => {
      const prevGamePieceType = prevTable[gamePieceType] || [];
      const found = prevGamePieceType[deckIndex].find((card) => card.id === cardID);
      found.x = e.target.attrs.x - deckIndex * 140;
      found.y = e.target.attrs.y;
      prevGamePieceType[deckIndex] = prevGamePieceType[deckIndex].filter((card) => card.id !== cardID);
      prevGamePieceType[deckIndex].push(found);
      return { ...prevTable, [gamePieceType]: prevGamePieceType };
    });
    emitMouseChange(e);
  };

const onDragEndGA = (e, cardID, deckIndex, setCanEmit, setTableData, emitMouseChange, gamePieceType) => {
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
        const prevGamePieceType = prevTable[gamePieceType] || [];
        prevGamePieceType[deckIndex] = prevGamePieceType[deckIndex].map((card) => {
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
        const prevGamePieceType = prevTable[gamePieceType] || [];
        const found = prevGamePieceType[deckIndex].find((card) => card.id === cardID);
        
        // add card to hand
        prevTable.hand.push(found);
        found.x = e.target.attrs.x
        found.y = e.target.attrs.y
        prevGamePieceType[deckIndex] = prevGamePieceType[deckIndex].filter((card) => card.id !== cardID);
        return { ...prevTable };
      });
    } else {
      // deck to table
      setTableData((prevTable) => {
        const prevGamePieceType = prevTable[gamePieceType] || [];
        // find card in tableData.deck
        const found = prevGamePieceType[deckIndex].find((card) => card.id === cardID);
        found.x = position.x;
        found.y = position.y;
        // add card to hand
        prevTable.cards.push(found);
        prevGamePieceType[deckIndex] = prevGamePieceType[deckIndex].filter((card) => card.id !== cardID);
        return { ...prevTable };
      });
    }
    emitMouseChange(e);
  };


export { onDragMoveCardGA, onDragEndGA };
