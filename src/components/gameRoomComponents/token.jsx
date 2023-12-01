// This module contains the actions that can be performed on a deck of (exclusively) tokens.
// Should be renamed to deckOfTokens or whatever you see fit to avoid confusion with deck of cards or pieces.
import { useRef } from "react";
import Card from "./card";
import * as Constants from "../../util/constants";
import { Rect } from "react-konva";
import { onDragMoveGA, onDragEndGA, onMouseEnterGA, onMouseLeaveGA } from "../gameaction/gameaction";

// deck data
const Token = (props) => {
  const { tableData, deckIndex } = props;
  
  const deckDimension = useRef(null);
  deckDimension.current ??= {
    x: tableData.tokens[deckIndex][0].x,
    y: tableData.tokens[deckIndex][0].y,
    width: tableData.tokens[deckIndex][0].width,
    height: tableData.tokens[deckIndex][0].height
  };

  return (
    <>
      <Rect
        key={`token_area_${deckIndex}`}
        x={(deckDimension.current.x)}
        y={deckDimension.current.y}
        width={deckDimension.current.width + 2*Constants.DECK_PADDING}
        height={deckDimension.current.height + 2*Constants.DECK_PADDING}
        cornerRadius={deckDimension.current.width * 0.6}
        fill={"rgba(177, 177, 177, 0.6)"}
      />

      {tableData?.tokens?.[deckIndex].map((card, index) => (
          <Card
            key={`token_${card.id}${index}`}
            id={card.id}
            src={card.isFlipped 
                  ? card.imageSource.front 
                  : card.imageSource.back}
            type={card.type}
            x={deckDimension.current.x + Constants.DECK_PADDING}
            y={deckDimension.current.y + Constants.DECK_PADDING}
            onDragEnd={(e, id) => onDragEndGA(e, id, props, "tokens")}
            onDragMove={(e, id) => onDragMoveGA(e, id, props, "tokens")}
            onMouseEnter={(e, id) => onMouseEnterGA(e, id, props)}
            onMouseLeave={(e) => onMouseLeaveGA(e, props)}
            draggable
          />
        ))}
    </>
  );
};

export default Token;
