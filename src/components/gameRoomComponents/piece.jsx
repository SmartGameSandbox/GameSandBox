// This module contains the actions that can be performed on a deck of (exclusively) pieces.
// Should be renamed to deckOfPieces or whatever you see fit to avoid confusion with deck of cards or tokens.

import Card from "./card";
import { onDragMoveGA, onDragEndGA, onMouseEnterGA, onMouseLeaveGA } from "../gameaction/gameaction";

// deck data
const Piece = (props) => {
  const { tableData, deckIndex } = props;

  return (
    <>
      {tableData?.pieces?.[deckIndex]?.map((card, index) => (
        <Card
          key={`piece_${card.id}${index}`}
          src={card.imageSource.front}
          id={card.id}
          type={card.type}
          x={card.x}
          y={card.y}
          onDragEnd={(e, id) => onDragEndGA(e, id, props, "pieces")}
          onDragMove={(e, id) => onDragMoveGA(e, id, props, "pieces")}
          onMouseEnter={(e, id) => onMouseEnterGA(e, id, props)}
          onMouseLeave={(e) => onMouseLeaveGA(e, props)}
          draggable
        />
      ))}
    </>
  );
};

export default Piece;
