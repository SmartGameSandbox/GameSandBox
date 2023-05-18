import { useRef } from "react";
import Card from "./card";
import * as Constants from "../../util/constants";
import { Rect } from "react-konva";

// deck data
const Token = ({ tableData, deckIndex, setCanEmit, setTableData, emitMouseChange }) => {
  const deckDimension = useRef(null);
  deckDimension.current ??= {
    x: tableData.tokens[deckIndex][0].x,
    y: tableData.tokens[deckIndex][0].y,
    width: tableData.tokens[deckIndex][0].width,
    height: tableData.tokens[deckIndex][0].height
  };
  const onDragMoveCard = (e, cardID) => {
    setCanEmit(true);
    setTableData((prevTable) => {
      // find top of the token pile.
      const found = prevTable.tokens[deckIndex].at(-1);
      found.x = e.target.attrs.x;
      found.y = e.target.attrs.y;
      // move found to the last index of cards array
      prevTable.tokens[deckIndex].pop();
      prevTable.tokens[deckIndex].push(found);
      return { ...prevTable };
    });
    emitMouseChange(e);
  };

  const onDragEnd = (e, cardID) => {
    const position = e.target.attrs;
    setCanEmit(true);
    if (
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
        const found = prevTable.tokens[deckIndex].at(-1);
        found.x = position.x;
        found.y = position.y;
        prevTable.cards.push(found);
        prevTable.tokens[deckIndex].pop();
        return { ...prevTable };
      });
    }
  };
  return (
    <>
      <Rect
        key={`token_area_${deckIndex}`}
        x={(deckDimension.current.x)}
        y={deckDimension.current.y}
        width={deckDimension.current.width + 2*Constants.DECK_PADDING}
        height={deckDimension.current.height + 2*Constants.DECK_PADDING}
        cornerRadius={40}
        fill={"rgba(177, 177, 177, 0.6)"}
      />

      {tableData?.tokens?.[deckIndex].map((card, index) => (
          <Card
            key={`token_${card.id}${index}`}
            src={card.isFlipped 
                  ? card.imageSource.front 
                  : card.imageSource.back}
            type={card.type}
            x={deckDimension.current.x + Constants.DECK_PADDING}
            y={deckDimension.current.y + Constants.DECK_PADDING}
            onDragEnd={onDragEnd}
            onDragMove={onDragMoveCard}
            draggable
          />
        ))}
    </>
  );
};

export default Token;
