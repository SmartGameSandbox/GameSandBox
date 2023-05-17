const onDragMoveCardGA = (e, cardID, deckIndex, setCanEmit, setTableData, emitMouseChange, gamePieceType) => {
    setCanEmit(true);
    setTableData((prevTable) => {
      const prevGamePieceType = prevTable[gamePieceType] || [];
      const found = prevGamePieceType[deckIndex].find((card) => card.id === cardID);
      found.x = e.target.attrs.x - deckIndex * 140;
      found.y = e.target.attrs.y;
      prevGamePieceType[deckIndex] = prevGamePieceType[deckIndex].filter((card) => card.id !== cardID);
      prevGamePieceType[deckIndex].push(found);
      return { ...prevTable, [gamePieceType]: prevGamePieceType };
    });
    emitMouseChange(e);
  };

export { onDragMoveCardGA };
