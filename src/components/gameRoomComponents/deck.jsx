import { useRef } from "react";
import Card from "./card";
import * as Constants from "../../util/constants";
import { Rect } from "react-konva";

// deck data
const Deck = ({ tableData, deckIndex, setCanEmit, setTableData, emitMouseChange }) => {
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
            onDragEnd={onDragEnd}
            onDragMove={onDragMoveCard}
            draggable
          />
        ))}
    </>
  );

  function onDragMoveCard(e, cardID) {
    setCanEmit(true);
    setTableData((prevTable) => {
      // find card in cards array
      const found = prevTable.deck[deckIndex].find((card) => card.id === cardID);
      found.x = e.target.attrs.x - 10;
      found.y = e.target.attrs.y - 10;
      // move found to the last index of cards array
      prevTable.deck[deckIndex] = prevTable.deck[deckIndex].filter((card) => card.id !== cardID);
      prevTable.deck[deckIndex].push(found);
      return { ...prevTable };
    });
    emitMouseChange(e);
  }

  function onDragEnd(e, cardID) {
    let { x: deckX, y: deckY, width: deckW, height: deckH } = deckDimension.current;
    deckW *= 0.8;
    deckH *= 0.8;
    const position = e.target.attrs;
    setCanEmit(true);
    if (position.x >= deckX - deckW && position.x <= deckX + deckW
        && position.y >= deckY - deckH && position.y <= deckY + deckH) {
      // deck area movement
      setTableData((prevTable) => {
        prevTable.deck[deckIndex] = prevTable.deck[deckIndex].map((card) => {
          if (card.id !== cardID) return card;
          card.x = deckX;
          card.y = deckY;
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
        const found = prevTable.deck[deckIndex].find((card) => card.id === cardID);
        // add card to hand
        prevTable.hand.push(found);
        found.x = e.target.attrs.x
        found.y = e.target.attrs.y
        prevTable.deck[deckIndex] = prevTable.deck[deckIndex].filter((card) => card.id !== cardID);
        return { ...prevTable };
      });
    } else {
      // deck to table
      setTableData((prevTable) => {
        // find card in tableData.deck
        const found = prevTable.deck[deckIndex].find((card) => card.id === cardID);
        found.x = position.x;
        found.y = position.y;
        // add card to hand
        prevTable.cards.push(found);
        prevTable.deck[deckIndex] = prevTable.deck[deckIndex].filter((card) => card.id !== cardID);
        return { ...prevTable };
      });
    }
  }
};

export default Deck;
