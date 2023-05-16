import Card from "../card/card";
import * as Constants from "../../util/constants";
import { Rect, Text } from "react-konva";

// deck data
const Token = ({ tableData, deckIndex, setCanEmit, setTableData, emitMouseChange }) => {

  const onDragMoveCard = (e, cardID) => {
    setCanEmit(true);
    setTableData((prevTable) => {
      // find card in cards array
      const found = prevTable.tokens[deckIndex].find((card) => card.id === cardID);
      found.x = e.target.attrs.x - deckIndex * 140;
      found.y = e.target.attrs.y;
      // move found to the last index of cards array
      prevTable.tokens[deckIndex] = prevTable.tokens[deckIndex].filter((card) => card.id !== cardID);
      prevTable.tokens[deckIndex].push(found);
      return { ...prevTable };
    });
    emitMouseChange(e);
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
        prevTable.tokens[deckIndex] = prevTable.tokens[deckIndex].map((card) => {
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
        const found = prevTable.tokens[deckIndex].find((card) => card.id === cardID);
        // add card to hand
        prevTable.hand.push(found);
        found.x =
          Constants.HAND_PADDING_X +
          (prevTable.hand.length - 1) * Constants.HAND_CARD_GAP;
        found.y =
          Constants.CANVAS_HEIGHT -
          Constants.HAND_HEIGHT +
          Constants.HAND_PADDING_Y;
        prevTable.tokens[deckIndex] = prevTable.tokens[deckIndex].filter((card) => card.id !== cardID);
        return { ...prevTable };
      });
    } else {
      // deck to table
      setTableData((prevTable) => {
        // find card in tableData.deck
        const found = prevTable.tokens[deckIndex].find((card) => card.id === cardID);
        found.x = position.x;
        found.y = position.y;
        prevTable.cards.push(found);
        prevTable.tokens[deckIndex] = prevTable.tokens[deckIndex].filter((card) => card.id !== cardID);
        return { ...prevTable };
      });
    }
  };

  return (
    <>
      <Rect
        key={`token_area_${deckIndex}`}
        x={10}
        y={10}
        width={Constants.DECK_AREA_WIDTH * tableData.tokens.length}
        height={Constants.DECK_AREA_HEIGHT}
        fill={"rgba(177, 177, 177, 0.6)"}
      />
      <Text
        key={`token_label`}
        x={10}
        y={10}
        padding={10}
        fill={"black"}
        fontSize={20}
        text={"Tokens"}
      />

      {tableData?.tokens?.[deckIndex].map((card, index) => (
          <Card
            key={`deck_card_${card.id}${index}`}
            src={card.isFlipped 
                  ? card.imageSource.front 
                  : card.imageSource.back}
            id={card.id}
            type={card.type}
            x={Constants.CARD_WIDTH / 2}
            y={Constants.CARD_HEIGHT / 2}
            onDragEnd={onDragEnd}
            onDragMove={onDragMoveCard}
            draggable
          />
        ))}
    </>
  );
};

export default Token;
