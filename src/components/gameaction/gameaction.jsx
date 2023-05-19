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

import * as Constants from "../../util/constants";

export function onDragMoveGA(e, itemID, {deckIndex, setCanEmit, setTableData, emitMouseChange}, gamePieceType) {
    setCanEmit(true);
    const { x, y } = e.target.attrs;
    setTableData((prevTable) => {
      if (["cards", "hand"].includes(gamePieceType)) {
        const found = prevTable[gamePieceType].find((item) => item.id === itemID);
        found.x = x;
        found.y = y;
        prevTable[gamePieceType].filter((item) => item.id !== itemID).push(found);
        return {...prevTable};
      }
      const found = prevTable[gamePieceType][deckIndex].find((item) => item.id === itemID);
      if (["deck", "tokens"].includes(gamePieceType)) {
        found.x = x - Constants.DECK_PADDING;
        found.y = y - Constants.DECK_PADDING;
      } else {
        found.x = x;
        found.y = y;
      }
      prevTable[gamePieceType][deckIndex].filter((item) => item.id !== itemID).push(found);
      emitMouseChange(e);
      return {...prevTable};
    });
  emitMouseChange(e);
  };

export function onDragEndGA(e, itemID, {deckIndex, setCanEmit, setTableData, tableData, emitMouseChange}, gamePieceType) {
    const {x: cursorX, y: cursorY} = e.target.attrs;
    let deckX, deckY, deckW, deckH, draggedItem;
    if (["cards", "hand"].includes(gamePieceType)) {
      draggedItem = tableData[gamePieceType].find((item) => item.id === itemID);
      deckIndex = tableData.cardsInDeck.findIndex(deck => deck.includes(itemID)) ?? -1;
    } else {
      draggedItem = tableData[gamePieceType][deckIndex].find((item) => item.id === itemID);
    }
    if (deckIndex > -1) {
      deckX = tableData.deckDimension[deckIndex].x;
      deckY = tableData.deckDimension[deckIndex].y;
      deckW = tableData.deckDimension[deckIndex].width * 0.8;
      deckH = tableData.deckDimension[deckIndex].height * 0.8;
    }
    setCanEmit(true);
    if (deckX && cursorX >= deckX - deckW && cursorX <= deckX + deckW
        && cursorY >= deckY - deckH && cursorY <= deckY + deckH) {
      // deck area movement
      setTableData((prevTable) => {
        if (draggedItem.pile.length > 0) {
          draggedItem.pile.forEach(cardInPile => prevTable.deck[deckIndex].push(cardInPile))
          draggedItem.pile.forEach(cardInPile => cardInPile.x = deckX)
          draggedItem.pile.forEach(cardInPile => cardInPile.y = deckY)
          draggedItem.pile = []
        }
        draggedItem.x = deckX;
        draggedItem.y = deckY;
        if (gamePieceType === "deck") {
          prevTable.deck[deckIndex] = prevTable.deck[deckIndex].filter(card => card.id !== itemID);
        } else {
          prevTable[gamePieceType] = prevTable[gamePieceType].filter(card => card.id !== itemID);
        }
        prevTable.deck[deckIndex].push(draggedItem);
        return {...prevTable};
      });
    } else if (cursorY > Constants.CANVAS_HEIGHT - Constants.HAND_HEIGHT - Constants.CARD_WIDTH) {
      setTableData((prevTable) => {
        // find card in tableData.deck
        if (draggedItem.pile.length > 0) {
          draggedItem.pile.forEach((item, index) => {
            if (cursorX + (index+1)*Constants.DECK_PADDING + Constants.CARD_WIDTH <= Constants.HAND_WIDTH) {
              item.x = cursorX + (index+1)*Constants.DECK_PADDING;
            } else {
              item.x = cursorX;
            }
            item.y = cursorY;
              prevTable.hand.push(item);
          })
          draggedItem.pile = []
        }
        // add card to hand
        draggedItem.x = cursorX;
        draggedItem.y = cursorY;
        if (["cards", "hand"].includes(gamePieceType)) {
          prevTable[gamePieceType] = prevTable[gamePieceType].filter((card) => card.id !== itemID);
        } else {
          prevTable[gamePieceType][deckIndex] = prevTable[gamePieceType][deckIndex].filter((card) => card.id !== itemID);
        }
        prevTable.hand.push(draggedItem);
        return {...prevTable};
      });
    } else if (gamePieceType !== "cards") {
      // deck to table
      setTableData((prevTable) => {
        // find card in tableData.deck
        draggedItem.x = cursorX;
        draggedItem.y = cursorY;
        // add card to hand
        if (gamePieceType === "hand") {
          prevTable.hand = prevTable.hand.filter(item => item.id !== itemID);
        } else {
          prevTable[gamePieceType][deckIndex] = prevTable[gamePieceType][deckIndex].filter((card) => card.id !== itemID);
        }
        prevTable.cards.push(draggedItem);
        
        return {...prevTable};
      });
    } else {
      setTableData((prevTable) => {
        prevTable.cards.forEach((pile) => {
          if (pile !== draggedItem
            && cursorX > pile.x - 10
            && cursorX < pile.x + Constants.CARD_WIDTH + 10
            && cursorY > pile.y - 10
            && cursorY < pile.y + Constants.CARD_HEIGHT + 10) {
            prevTable.cards = prevTable.cards.filter((card) => card !== draggedItem && card !== pile);
            draggedItem.pile = draggedItem.pile.concat(pile).concat(pile.pile);
            pile.pile = []
            pile.x = -100
            pile.y = -100
            prevTable.cards.push(draggedItem)
          }
        })
        return {...prevTable};
      });
    }
    emitMouseChange(e);
  }
