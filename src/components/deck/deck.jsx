import { useRef } from "react";
import Card from "../card/card";
import * as Constants from "../../util/constants";
import { Rect } from "react-konva";
import { onDragMoveCardGA, onDragEndGA } from "../gameaction/gameaction";


// deck data
const Deck = ({ tableData, deckIndex, setCanEmit, setTableData, emitMouseChange }) => {
  const isLandScape = useRef(null);
  isLandScape.current ??= tableData.deck[deckIndex][0].isLandscape;

  const onDragMoveCard = (e, cardID) => {
    onDragMoveCardGA(e, cardID, deckIndex, setCanEmit, setTableData, emitMouseChange, "deck");
  };

  const onDragEnd = (e, cardID) => {
    onDragEndGA(e, cardID, deckIndex, setCanEmit, setTableData, emitMouseChange, "deck");
  };

  return (
    <>
      <Rect
        key={`deck_square_${deckIndex}`}
        x={
          Constants.DECK_STARTING_POSITION_X
          + deckIndex * 140
          + (isLandScape.current ? 20 : 0)
        }
        y={Constants.DECK_STARTING_POSITION_Y}
        width={Constants.DECK_AREA_WIDTH}
        height={Constants.DECK_AREA_HEIGHT}
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
            x={card.x + deckIndex * 140}
            y={card.y}
            isLandscape={card.isLandscape}
            onDragEnd={onDragEnd}
            onDragMove={onDragMoveCard}
            draggable
          />
        ))}
    </>
  );
};

export default Deck;
