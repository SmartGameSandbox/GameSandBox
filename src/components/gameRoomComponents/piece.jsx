import Card from "./card";
import * as Constants from "../../util/constants";

// deck data
const Piece = ({ tableData, deckIndex, setCanEmit, setTableData, emitMouseChange }) => {

  const onDragMoveCard = (e, cardID) => {
    setCanEmit(true);
    setTableData((prevTable) => {
      // find card in cards array
      const found = prevTable.pieces[deckIndex].at(-1);
      found.x = e.target.attrs.x;
      found.y = e.target.attrs.y;
      // move found to the last index of cards array
      prevTable.pieces[deckIndex].pop();
      prevTable.pieces[deckIndex].push(found);
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
        const found = prevTable.pieces[deckIndex].find((card) => card.id === cardID);
        // add card to hand
        prevTable.hand.push(found);
        found.x =
          Constants.HAND_PADDING_X +
          (prevTable.hand.length - 1) * Constants.HAND_CARD_GAP;
        found.y =
          Constants.CANVAS_HEIGHT -
          Constants.HAND_HEIGHT +
          Constants.HAND_PADDING_Y;
        prevTable.pieces[deckIndex] = prevTable.pieces[deckIndex].filter((card) => card.id !== cardID);
        return { ...prevTable };
      });
    } else {
      // deck to table
      setTableData((prevTable) => {
        // find card in tableData.deck
        const found = prevTable.pieces[deckIndex].at(-1);
        found.x = position.x;
        found.y = position.y;
        prevTable.cards.push(found);
        prevTable.pieces[deckIndex].pop();
        return { ...prevTable };
      });
    }
  };

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
          onDragEnd={onDragEnd}
          onDragMove={onDragMoveCard}
          draggable
        />
      ))}
    </>
  );
};

export default Piece;
