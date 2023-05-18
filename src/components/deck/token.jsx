// This module contains the actions that can be performed on a deck of (exclusively) tokens.
// Should be renamed to deckOfTokens or whatever you see fit to avoid confusion with deck of cards or pieces.

import Card from "../card/card";
import * as Constants from "../../util/constants";
import { Rect, Text } from "react-konva";
import { onDragMoveCardGA, onDragEndGA } from "../gameaction/gameaction";


// deck data
const Token = ({ tableData, deckIndex, setCanEmit, setTableData, emitMouseChange }) => {

  const onDragMoveCard = (e, cardID) => {
    onDragMoveCardGA(e, cardID, deckIndex, setCanEmit, setTableData, emitMouseChange, "tokens");
  };

  const onDragEnd = (e, cardID) => {
    onDragEndGA(e, cardID, deckIndex, setCanEmit, setTableData, emitMouseChange, "tokens");
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
