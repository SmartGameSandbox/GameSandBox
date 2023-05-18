import Card from "../card/card";
import * as Constants from "../../util/constants";
import { Rect, Text } from "react-konva";
import { onDragMoveCardGA, onDragEndGA } from "../gameaction/gameaction";


// deck data
const Piece = ({ tableData, deckIndex, setCanEmit, setTableData, emitMouseChange }) => {

  const onDragMoveCard = (e, cardID) => {
    onDragMoveCardGA(e, cardID, deckIndex, setCanEmit, setTableData, emitMouseChange, "pieces");
  };

  const onDragEnd = (e, cardID) => {
    onDragEndGA(e, cardID, deckIndex, setCanEmit, setTableData, emitMouseChange, "pieces");
  };

  return (
    <>
      <Rect
        key={`piece_area_${deckIndex}`}
        x={Constants.CANVAS_WIDTH - Constants.DECK_AREA_WIDTH * tableData.pieces.length - 10}
        y={10}
        width={Constants.DECK_AREA_WIDTH * tableData.pieces.length}
        height={Constants.DECK_AREA_HEIGHT}
        fill={"rgba(177, 177, 177, 0.6)"}
      />
      <Text
        key={`pieces_label`}
        x={Constants.CANVAS_WIDTH - Constants.DECK_AREA_WIDTH * tableData.pieces.length - 10}
        y={10}
        padding={10}
        fill={"black"}
        fontSize={20}
        text={"pieces"}
      />

      {tableData?.pieces?.[deckIndex].map((card, index) => (
          <Card
            key={`deck_card_${card.id}${index}`}
            src={card.isFlipped 
                  ? card.imageSource.front 
                  : card.imageSource.back}
            id={card.id}
            type={card.type}
            x={Constants.CANVAS_WIDTH - Constants.DECK_AREA_WIDTH * tableData.pieces.length - Constants.CARD_WIDTH / 2}
            y={Constants.CARD_HEIGHT / 2}
            onDragEnd={onDragEnd}
            onDragMove={onDragMoveCard}
            draggable
          />
        ))}
    </>
  );
};

export default Piece;
