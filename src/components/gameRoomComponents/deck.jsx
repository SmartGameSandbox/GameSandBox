// This module contains the actions that can be performed on a deck of (exclusively) cards.
// Should be renamed to deckOfCards or whatever you see fit to avoid confusion with deck of tokens or pieces.
import { useRef } from "react";
import Card from "./card";
import * as Constants from "../../util/constants";
import { Rect } from "react-konva";
import { onDragMoveGA, onDragEndGA } from "../gameaction/gameaction";

// deck data
const Deck = (props) => {
  const { tableData, deckIndex } = props;
  const isLandScape = useRef(null);
  isLandScape.current ??= tableData.deck[deckIndex][0].isLandscape;
  const deckDimension = useRef(null);
  deckDimension.current ??= {
    x: tableData.deck[deckIndex][0].x,
    y: tableData.deck[deckIndex][0].y,
    width: tableData.deck[deckIndex][0].width,
    height: tableData.deck[deckIndex][0].height
  };

  return (
    <>
      <Rect
        key={`deck_square_${deckIndex}`}
        x={(deckDimension.current.x) + (isLandScape.current ? 20 : 0)}
        y={deckDimension.current.y}
        width={deckDimension.current.width + 2*Constants.DECK_PADDING}
        height={deckDimension.current.height + 2*Constants.DECK_PADDING}
        cornerRadius={10}
        fill={"rgba(177, 177, 177, 0.6)"}
        rotation={isLandScape.current ? 90 : 0} // rotate by 90 degrees if any card is landscape
      />

      {tableData?.deck?.[deckIndex].map((card) => (
          <Card
            key={`deck_card_${card.id}`}
            src={card.isFlipped 
                  ? card.imageSource.front 
                  : card.imageSource.back}
            id={card.id}
            type={card.type}
            x={Constants.DECK_PADDING + card.x}
            y={Constants.DECK_PADDING + card.y}
            isLandscape={card.isLandscape}
            onDragEnd={(e, id) => onDragEndGA(e, id, props, "deck")}
            onDragMove={(e, id) => onDragMoveGA(e, id, props, "deck")}
            draggable
          />
        ))}
    </>
  );
};

export default Deck;
