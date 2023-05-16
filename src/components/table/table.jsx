import { useState, useEffect } from "react";
import { Group, Layer, Rect, Image } from "react-konva";
import Card from "../card/card";
import * as Constants from "../../util/constants";
import Cursors from "../cursor/cursors";
import Hand from "../hand/hand";
import Deck from "../deck/deck";
import Token from "../deck/token";
import Piece from "../deck/piece";
import RightClickMenu from './rightClickMenu';
import useImage from "use-image";
import handIcon from "../icons/hand-regular.png";

const Table = ({ socket, username, roomID }) => {
  const [tableData, setTableData] = useState(null);
  const [cursors, setCursors] = useState([]);
  const [rightClickPos, setRightClickPos] = useState({ x: null, y: null });
  const [clickedCardID, setClickedCardID] = useState(null);
  const [canEmit, setCanEmit] = useState(true);


  useEffect(() => {
    if (!canEmit || !tableData) return;
    socket.emit("tableChange", { username, roomID, tableData },
      (err) => {if (err) console.error(err);}
    );
  }, [tableData, canEmit, roomID, username, socket]);

  useEffect(() => {
    socket.on("tableReload", (data) => {
      const cardsInDeck = data.deck.map(pile => pile.map(({id}) => id));
      setTableData({ ...data, cardsInDeck });
    });

    socket.on("tableChangeUpdate", (data) => {
      if (data.username === username) return;
      setCanEmit(false);
      setTableData((prevTable) => ({
        ...prevTable,
        cards: data.tableData.cards,
        deck: data.tableData.deck,
        pieces: data.tableData.pieces,
      }));
    });

    socket.on("mousePositionUpdate", ({ username: cursorMoved, x, y }) => {
      if (cursorMoved === username) return;
      // update cursor position in object inside cursors
      setCursors((prevCursors) => {
        const found = prevCursors.find(({username}) => username === cursorMoved);
        if (!found) return [...prevCursors, { username: cursorMoved, x, y }];
        return prevCursors.map((cursor) => {
          if (cursor.username === cursorMoved) {
            cursor.x = x;
            cursor.y = y;
          }
          return cursor;
        });
      });
    });

    // on Unmount(when leaving room, the below happens)
    return () => {
      socket.off("roomCardData");
      socket.off("tableChangeUpdate");
      socket.off("mousePositionUpdate");
    };
  }, [socket, username]);

  const onDragEndCard = (e, cardID) => {
    const position = e.target.attrs;
    const draggedCard = tableData.cards.find(({id}) => id === cardID);
    const deckIndex = tableData.cardsInDeck.findIndex((pile) => pile.includes(cardID));
    setCanEmit(true);
    const HAND_POS_Y = Constants.CANVAS_HEIGHT - Constants.HAND_HEIGHT + Constants.HAND_PADDING_Y;
    const DECK_X = Constants.DECK_STARTING_POSITION_X + deckIndex * 140;
    // Draw Card from table to hand
    if (position.y > HAND_POS_Y - Constants.HAND_PADDING_Y - 0.5 * Constants.CARD_HEIGHT) {
      setTableData((prevTable) => {
        // find card in tableData.cards
        if (draggedCard.pile.length > 0) {
          draggedCard.pile.forEach((cardInPile, index) => {
            prevTable.hand.push(cardInPile)
            if (e.target.attrs.x + index*25 + Constants.CARD_WIDTH <= Constants.HAND_WIDTH) {
              cardInPile.x = e.target.attrs.x + index*25
            } else {
              cardInPile.x = e.target.attrs.x
            }
            cardInPile.y = e.target.attrs.y
          })
          draggedCard.pile = []
        }
        prevTable.hand.push(draggedCard);
        draggedCard.x = e.target.attrs.x
        draggedCard.y = e.target.attrs.y
        // add card to hand
        prevTable.cards = prevTable.cards.filter((card) => card.id !== cardID);
        return { ...prevTable };
      });
      return;
    }
    // card from table to deck
    if (
      position.x >= DECK_X - Constants.CARD_WIDTH
      && position.x <= DECK_X + Constants.DECK_AREA_WIDTH
      && position.y >=
        Constants.DECK_STARTING_POSITION_Y - Constants.CARD_HEIGHT
      && position.y <=
        Constants.DECK_STARTING_POSITION_Y + Constants.DECK_AREA_HEIGHT
    ) {
      setTableData((prevTable) => {
        if (draggedCard.pile.length > 0) {
          draggedCard.pile.forEach(cardInPile => prevTable.deck[deckIndex].push(cardInPile))
          draggedCard.pile.forEach(cardInPile => cardInPile.x = Constants.DECK_STARTING_POSITION_X + Constants.DECK_PADDING)
          draggedCard.pile.forEach(cardInPile => cardInPile.y = Constants.DECK_STARTING_POSITION_Y + Constants.DECK_PADDING)
          draggedCard.pile = []
        }
        draggedCard.x = Constants.DECK_STARTING_POSITION_X + Constants.DECK_PADDING;
        draggedCard.y = Constants.DECK_STARTING_POSITION_Y + Constants.DECK_PADDING;
        prevTable.deck[deckIndex].push(draggedCard);
        prevTable.cards = prevTable.cards.filter((card) => card.id !== cardID);
        return { ...prevTable };
      });
    } else {
      setTableData((prevTable) => {
        const found = prevTable.cards.find((card) => card.id === cardID);
        prevTable.cards.forEach((pile) => {
          if (pile !== found && position.x > pile.x - 10 && position.x < pile.x + Constants.CARD_WIDTH + 10 &&
          position.y > pile.y - 10 && position.y < pile.y + Constants.CARD_HEIGHT + 10) {
            prevTable.cards = prevTable.cards.filter((card) => card !== found && card !== pile);
            found.pile = found.pile.concat(pile).concat(pile.pile)
            pile.pile = []
            pile.x = -100
            pile.y = -100
            prevTable.cards.push(found)
          }
        })

        return { ...prevTable };
      });
    }
  };

  const collectCards = () => {
    setCanEmit(true);
    setTableData((prevTable) => {
      // put cards to deck
      console.log(prevTable.deck);
      prevTable.deck = prevTable.deck
                        .map((pile, index) => pile
                          .concat(prevTable.cards
                            .filter(card => prevTable.cardsInDeck[index]
                              .includes(card))));
      // set cards in deck to starting position
      console.log(prevTable.deck);
      prevTable.deck = prevTable.deck.map((pile) => pile.map((card) => {
        card.x = Constants.DECK_STARTING_POSITION_X + Constants.DECK_PADDING;
        card.y = Constants.DECK_STARTING_POSITION_Y + Constants.DECK_PADDING;
        return card;
      }));
      console.log(prevTable.deck);
      prevTable.cards = [];
      // flip all deck
      // prevTable.deck = prevTable.deck[0].map((card) => {
      //   card.isFlipped = true;
      //   // card.imageSource = card.imageSource;
      //   return card;
      // });
      return { ...prevTable };
    });
  };
  const shuffleCards = () => {
    setCanEmit(true);
    setTableData((prevTable) => {
      prevTable.deck = prevTable.deck.map((card) => {
        card.isFlipped = true;
        // card.imageSource = card.imageSource;
        return card;
      });
      prevTable.deck = prevTable.deck.sort(() => Math.random() - 0.5);
      return { ...prevTable };
    });
  };

  const HandImage = () => {
    const [image] = useImage(handIcon)
    return <Image
        image={image}
        x={Constants.CANVAS_WIDTH/2 - 25}
        y={Constants.CANVAS_HEIGHT/2 + Constants.HAND_HEIGHT}
        opacity={0.6}
        width={50}
        height={50}
    />;
  }
  return (
    <>
      <Layer onClick={handleCloseMenu}>
        <Rect
          x={0}
          y={0}
          width={Constants.CANVAS_WIDTH}
          height={Constants.CANVAS_HEIGHT - Constants.HAND_HEIGHT}
          stroke="#163B6E"
          strokeWidth={5}
          fill="#EBEBEB"
        />
        <Rect
          x={0}
          y={Constants.CANVAS_HEIGHT - Constants.HAND_HEIGHT}
          width={Constants.HAND_WIDTH}
          height={Constants.HAND_HEIGHT}
          fill="#163B6E"
        />
        {tableData?.deck?.map((deck, index) => (
          <Deck
          key={`deck_${index}`}
          tableData={tableData}
          deckIndex={index}
          setCanEmit={setCanEmit}
          setTableData={setTableData}
          emitMouseChange={emitMouseChange}
        />
        ))}
        {tableData?.cards?.map((card) => (
            <Group 
              key={`card_${card.id}`}
              onContextMenu={(e) => handleContextMenu(e, card.id)}
            >
              <Card
                key={`card_${card.id}`}
                src={card.isFlipped 
                      ? card.imageSource.front 
                      : card.imageSource.back}
                id={card.id}
                type={card.type}
                x={card.x}
                y={card.y}
                isLandscape={card.isLandscape}
                onDragMove={onDragMoveCard}
                onDragEnd={onDragEndCard}
              />
            </Group>

          ))
        }
        {tableData?.tokens?.map((token, index) => (
          <Token
          key={`tokens_${index}`}
          tableData={tableData}
          deckIndex={index}
          setCanEmit={setCanEmit}
          setTableData={setTableData}
          emitMouseChange={emitMouseChange}
        />
        ))}
        {tableData?.pieces?.map((piece, index) => (
          <Piece
          key={`pieces_${index}`}
          tableData={tableData}
          deckIndex={index}
          setCanEmit={setCanEmit}
          setTableData={setTableData}
          emitMouseChange={emitMouseChange}
        />
        ))}
        {rightClickPos.x !== null && rightClickPos.y !== null && (
          <RightClickMenu
            x={rightClickPos.x}
            y={rightClickPos.y}
            cardId={clickedCardID}
            setTableData={setTableData}
            setRightClickPos={setRightClickPos}
            setClickedCardID={setClickedCardID}
          />
        )}
        <Hand
          tableData={tableData}
          setCanEmit={setCanEmit}
          setTableData={setTableData}
          emitMouseChange={emitMouseChange}
        />
      </Layer>
      <Layer>
        <HandImage/>
        <Cursors key={`cursor_${username}`} cursors={cursors} />
      </Layer>
    </>
  );

  function emitMouseChange(e) {
    socket.emit("mouseMove",
      {
        x: e.evt.offsetX,
        y: e.evt.offsetY,
        username: username,
        roomID: roomID,
      },
      (err) => {if (err) {alert(err);}}
    );
  }

  function onDragMoveCard(e, cardID) {
    setCanEmit(true);
    setTableData((prevTable) => {
      // find card in cards array
      const found = prevTable.cards.find((card) => card.id === cardID);
      found.x = e.target.attrs.x;
      found.y = e.target.attrs.y;
      // move found to the last index of cards array
      prevTable.cards = prevTable.cards.filter((card) => card.id !== cardID);
      prevTable.cards = [...prevTable.cards, found];
      return { ...prevTable };
    });
    emitMouseChange(e);
  }

  function handleCloseMenu() {setRightClickPos({x:null, y:null})}

  function handleContextMenu(event, cardID) {
    event.evt.preventDefault();
    const {
      top: konvaTop,
      left: konvaLeft
    } = document.querySelector(".konvajs-content").getBoundingClientRect();
    const {clientY, clientX} = event.evt;
    setRightClickPos({ x: clientX - konvaLeft, y: clientY - konvaTop });
    setClickedCardID(cardID);
  }
};

export default Table;
