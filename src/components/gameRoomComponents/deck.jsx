// This module contains the actions that can be performed on a deck of (exclusively) cards.
// Should be renamed to deckOfCards or whatever you see fit to avoid confusion with deck of tokens or pieces.
import { useRef } from "react";
import Card from "./card";
import * as Constants from "../../util/constants";
import { Rect, Text } from "react-konva";
import { onDragMoveGA, onDragEndGA, onMouseEnterGA, onMouseLeaveGA } from "../gameaction/gameaction";

// deck data
const Deck = (props) => {

  const { tableData, id } = props;
  const deckIndex = findDeckIndex(tableData.deckDimension, id);

  // Initialize isLandScape with a default value if not present
  const isLandScape = useRef(null);
  isLandScape.current ??= tableData.deck[deckIndex]?.[0]?.isLandscape;

  // Initialize deckDimension with default values if not present
  const deckDimension = useRef(null);
  deckDimension.current ??= {
    x: tableData.deck[deckIndex]?.[0]?.x || 0,
    y: tableData.deck[deckIndex]?.[0]?.y || 0,
    width: tableData.deck[deckIndex]?.[0]?.width || 0,
    height: tableData.deck[deckIndex]?.[0]?.height || 0,
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
      <>
        <Rect
          x={deckDimension.current.x + Constants.DECK_PADDING}
          y={deckDimension.current.y + deckDimension.current.height + Constants.DECK_PADDING - 1}
          width={deckDimension.current.width}
          height={20}
          fill="#163B6E"
        />
        <Text
          x={deckDimension.current.x + deckDimension.current.width / 2 - (tableData.deck[deckIndex].length > 9 ? 12 : 5) + Constants.DECK_PADDING}
          y={deckDimension.current.y + deckDimension.current.height + Constants.DECK_PADDING + 1.5}
          text={tableData.deck[deckIndex].length}
          fontSize={16}
          fill="white"
          fontStyle="bold"
          fontFamily="Nunito"
        />
      </>

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
            onMouseEnter={(e, id) => onMouseEnterGA(e, id, props)}
            onMouseLeave={(e) => onMouseLeaveGA(e, props)}
            onDragEnd={(e, id) => onDragEndGA(e, id, props, "deck")}
            onDragMove={(e, id) => onDragMoveGA(e, id, props, "deck")}
            draggable
          />
        ))}
    </>
  );
};

function findDeckIndex(deckDimension, id) {
  return deckDimension.findIndex(deck => deck.id === id);
}

export default Deck;
