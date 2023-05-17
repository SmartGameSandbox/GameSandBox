import { useRef } from "react";
import Card from "../card/card";
import * as Constants from "../../util/constants";
import { Rect } from "react-konva";
import { onDragMoveCardGA } from "../gameaction/gameaction";


// deck data
const Deck = ({ tableData, deckIndex, setCanEmit, setTableData, emitMouseChange }) => {
  const isLandScape = useRef(null);
  isLandScape.current ??= tableData.deck[deckIndex][0].isLandscape;

  const onDragMoveCard = (e, cardID) => {
    onDragMoveCardGA(e, cardID, deckIndex, setCanEmit, setTableData, emitMouseChange, "deck");
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
        prevTable.deck[deckIndex] = prevTable.deck[deckIndex].map((card) => {
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
