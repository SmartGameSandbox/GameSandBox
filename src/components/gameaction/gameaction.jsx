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

/**
 * Read the Dragmove event and update tableData and server.
 * @param {Event} e 
 * @param {String} itemID 
 * @param {Object} props or params declared 
 * @param {String} src the origin of the item (cards, hand, deck, tokens, piece)
 */
export function onDragMoveGA(
  e,
  itemID,
  {deckIndex, setCanEmit, tableData, setTableData, emitMouseChange, setItemUpdated},
  src,
  ) {
    setCanEmit(true);
    const { x, y } = e.target.attrs;
    let draggedItem;
    if (["cards", "hand"].includes(src)) {
      draggedItem = tableData[src].find((item) => item.id === itemID);
    } else {
      draggedItem = tableData[src][deckIndex].find((item) => item.id === itemID);
    }
    setTableData((prevTable) => {
      if (["cards", "hand"].includes(src)) {
        draggedItem.x = x;
        draggedItem.y = y;
        prevTable[src].map(item => {
          if (item.id !== itemID) return item;
          return draggedItem;
        })
        return {...prevTable};
      }
      if (["deck", "tokens"].includes(src)) {
        draggedItem.x = x - Constants.DECK_PADDING;
        draggedItem.y = y - Constants.DECK_PADDING;
      } else {
        draggedItem.x = x;
        draggedItem.y = y;
      }
      prevTable[src][deckIndex].map(item => {
        if (item.id !== itemID) return item;
        return draggedItem;
      })
      return {...prevTable};
    });
    setItemUpdated({itemID, src, deckIndex, x, y, type: "drag"});
    emitMouseChange(e);
  };

  /**
   * Read the DragEnd event and update tableData and server.
   * @param {Event} e 
   * @param {String} itemID 
   * @param {Object} props or params declared 
   * @param {String} src the origin of the item (cards, hand, deck, tokens, piece)
   */
export function onDragEndGA(
  e,
  itemID,
  {deckIndex, setCanEmit, setTableData, tableData, emitMouseChange, setItemUpdated},
  src
  ) {
    const {x: cursorX, y: cursorY} = e.target.attrs;
    let deckX, deckY, deckW, deckH, draggedItem;
    // identify the item
    if (["cards", "hand"].includes(src)) {
      draggedItem = tableData[src].find((item) => item.id === itemID);
      deckIndex = tableData.cardsInDeck.findIndex(deck => deck.includes(itemID)) ?? -1;
    } else {
      draggedItem = tableData[src][deckIndex].find((item) => item.id === itemID);
    }
    // for snapping on to card Deck
    if (src !== "tokens" && deckIndex > -1) {
      deckX = tableData.deckDimension[deckIndex].x;
      deckY = tableData.deckDimension[deckIndex].y;
      deckW = tableData.deckDimension[deckIndex].width * 0.8;
      deckH = tableData.deckDimension[deckIndex].height * 0.8;
    }
    setCanEmit(true);
    if (deckX && cursorX >= deckX - deckW && cursorX <= deckX + deckW
        && cursorY >= deckY - deckH && cursorY <= deckY + deckH) {
      // Automatic snap of card inside the card deck area
      setTableData((prevTable) => {
        if (draggedItem.pile.length > 0) {
          draggedItem.pile.forEach(cardInPile => {
            cardInPile.x = deckX
            cardInPile.y = deckY
            prevTable.deck[deckIndex].push(cardInPile)
          });
          draggedItem.pile = [];
        }
        draggedItem.x = deckX;
        draggedItem.y = deckY;
        if (src === "deck") {
          prevTable.deck[deckIndex] = prevTable.deck[deckIndex].filter(card => card.id !== itemID);
        } else {
          prevTable[src] = prevTable[src].filter(card => card.id !== itemID);
        }
        prevTable.deck[deckIndex].push(draggedItem);
        return {...prevTable};
      });
      setItemUpdated({itemID, src, dest: "deck", deckIndex, x: deckX, y: deckY });
    } else if (cursorY > Constants.CANVAS_HEIGHT - Constants.HAND_HEIGHT - Constants.CARD_WIDTH) {
      // Moving card into Hand
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
            item.isFlipped = true;
              prevTable.hand.push(item);
          })
          draggedItem.pile = []
        }
        // add card to hand
        draggedItem.x = cursorX;
        draggedItem.y = cursorY;
        draggedItem.isFlipped = true;
        if (["cards", "hand"].includes(src)) {
          prevTable[src] = prevTable[src].filter((card) => card.id !== itemID);
        } else {
          prevTable[src][deckIndex] = prevTable[src][deckIndex].filter((card) => card.id !== itemID);
        }
        prevTable.hand.push(draggedItem);
        return {...prevTable};
      });
      setItemUpdated({itemID, src, dest: "hand", deckIndex, x: cursorX, y: cursorY });
    } else if (src !== "cards") {
      // placing card on to table from anywhere except for table. (prevent stacking)
      setTableData((prevTable) => {
        // remove item from previous array
        if (src === "hand") {
          prevTable.hand = prevTable.hand.filter(item => item.id !== itemID);
          draggedItem.isFlipped = false;
        } else {
          prevTable[src][deckIndex] = prevTable[src][deckIndex].filter((card) => card.id !== itemID);
        }
        draggedItem.x = cursorX;
        draggedItem.y = cursorY;
        prevTable.cards.push(draggedItem);
        
        return {...prevTable};
      });
      setItemUpdated({itemID, src, dest: "cards", deckIndex });
    } else {
      const pileIds = [];
      setTableData((prevTable) => {
        prevTable.cards.forEach((pile) => {
          // Should run only once as you're stacking 1 card on top of 1 card/stack.
          if (pile !== draggedItem
            && cursorX > pile.x - 10
            && cursorX < pile.x + Constants.CARD_WIDTH + 10
            && cursorY > pile.y - 10
            && cursorY < pile.y + Constants.CARD_HEIGHT + 10) {
            pileIds.push(pile.id);
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
      setItemUpdated({itemID, pileIds, src: "cards" });
    }
    emitMouseChange(e);
  }
