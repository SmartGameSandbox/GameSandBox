import { useState, useEffect } from "react";
import { Group, Layer, Rect, Image } from "react-konva";
import Card from "./card";
import * as Constants from "../../util/constants";
import Cursors from "./cursors";
import Hand from "./hand";
import Deck from "./deck";
import Token from "./token";
import Piece from "./piece";
import RightClickMenu from './rightClickMenu';
import useImage from "use-image";
import handIcon from "../icons/hand-regular.png";
import { onDragMoveGA, onDragEndGA } from "../gameaction/gameaction";

const Table = ({ socket, username, roomID }) => {
  const [tableData, setTableData] = useState(null);
  const [cursors, setCursors] = useState([]);
  const [rightClickPos, setRightClickPos] = useState({ x: null, y: null });
  const [clickedCardID, setClickedCardID] = useState(null);
  const [canEmit, setCanEmit] = useState(true);
  const [itemBeingUpdated, setItemBeingUpdated] = useState(null);

  const GA_PARAMS = {setCanEmit, setTableData, emitMouseChange, tableData, setItemBeingUpdated};

  useEffect(() => {
    if (!canEmit) return;
    if (itemBeingUpdated) {
      socket.emit("itemChange", { username, roomID, itemBeingUpdated },
        (err) => {if (err) console.error(err);}
      );
      return;
    }
    if (!itemBeingUpdated && tableData) {
      socket.emit("tableChange", { username, roomID, tableData },
        (err) => {if (err) console.error(err);}
      );
    }
  }, [tableData, itemBeingUpdated, canEmit, roomID, username, socket]);

  useEffect(() => {
    socket.on("tableReload", (data) => {
      const handAndTable = [...data.cards, ...Object.values(data.hand).flat()].map(({id}) => id);
      const tokens = setUpTokenAndPiece(data.tokens)
                      .map(token => token.filter(({id}) => !handAndTable.includes(id)));
      const pieces = setUpTokenAndPiece(data.pieces)
                      .map(piece => piece.filter(({id}) => !handAndTable.includes(id)));
      setTableData({ ...data, pieces, tokens });
    });

    socket.on("tableChangeUpdate", (data) => {
      if (data.username === username) return;
      setCanEmit(false);
      if (data.itemBeingUpdated) {
        const {itemID, gamePieceType, deckIndex, x, y} = data.itemBeingUpdated;
        setTableData((prevTable) => {
          if (["hand", "cards"].includes(gamePieceType)) {
            prevTable[gamePieceType].map(item => {
              if (item.id === itemID) {
                item.x = x;
                item.y = y;
              }
              return item;
            });
          } else {
            prevTable[gamePieceType][deckIndex].map(item => {
              if (item.id === itemID) {
                item.x = x;
                item.y = y;
              }
              return item;
            });
          }
          return {...prevTable};
        });
        return;
      }
      if (data.tableData) {
        setTableData((prevTable) => ({...prevTable, ...data.tableData}));
      }
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
          setItemBeingUpdated={setItemBeingUpdated}
        />
        ))}
        {tableData?.tokens?.map((token, index) => (
          <Token
          key={`tokens_${index}`}
          tableData={tableData}
          deckIndex={index}
          setCanEmit={setCanEmit}
          setTableData={setTableData}
          emitMouseChange={emitMouseChange}
          setItemBeingUpdated={setItemBeingUpdated}
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
          setItemBeingUpdated={setItemBeingUpdated}
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
                      : card.imageSource.back?.data
                        ? card.imageSource.back
                        : card.imageSource.front}
                id={card.id}
                type={card.type}
                x={card.x}
                y={card.y}
                isLandscape={card.isLandscape}
                onDragMove={(e, id) => onDragMoveGA(e, id, GA_PARAMS, "cards")}
                onDragEnd={(e, id) => onDragEndGA(e, id, GA_PARAMS, "cards")}
              />
            </Group>

          ))
        }
        {rightClickPos.x !== null && rightClickPos.y !== null && (
          <RightClickMenu
            x={rightClickPos.x}
            y={rightClickPos.y}
            cardId={clickedCardID}
            setTableData={setTableData}
            setCanEmit={setCanEmit}
            setRightClickPos={setRightClickPos}
            setClickedCardID={setClickedCardID}
            setItemBeingUpdated={setItemBeingUpdated}
          />
        )}
        <Hand
          tableData={tableData}
          setCanEmit={setCanEmit}
          setTableData={setTableData}
          emitMouseChange={emitMouseChange}
          setItemBeingUpdated={setItemBeingUpdated}
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

  function handleCloseMenu() {setRightClickPos({x:null, y:null})}

  function handleContextMenu(event, cardID) {
    event.evt.preventDefault();
    const {
      top: konvaTop,
      left: konvaLeft
    } = document.querySelector(".konvajs-content").getBoundingClientRect();
    const {clientY, clientX} = event.evt;
    setRightClickPos({ x: clientX - konvaLeft - 1, y: clientY - konvaTop - 1});
    setClickedCardID(cardID);
  }

  function setUpTokenAndPiece(data) {
    return data.map(item => {
      if (item.deck.length < item.totalNum) {
        const maxIndex = item.deck.length;
        const newTokenArray = Array.from({length: item.totalNum}, (_, i) => {
          const newItem = structuredClone(item.deck[i % maxIndex]);
          newItem.id += i;
          return newItem;
        });
        item.deck = newTokenArray;
      }
      return item.deck;
    });
  }

  // To Do: assign these functions to individual deck so that each decks can be collected/shuffled.
  // function collectCards() {
  //   setCanEmit(true);
  //   setTableData((prevTable) => {
  //     // put cards to deck
  //     console.log(prevTable.deck);
  //     prevTable.deck = prevTable.deck
  //                       .map((pile, index) => pile
  //                         .concat(prevTable.cards
  //                           .filter(card => prevTable.cardsInDeck[index]
  //                             .includes(card))));
  //     // set cards in deck to starting position
  //     console.log(prevTable.deck);
  //     prevTable.deck = prevTable.deck.map((pile) => pile.map((card) => {
  //       card.x = Constants.DECK_STARTING_POSITION_X + Constants.DECK_PADDING;
  //       card.y = Constants.DECK_STARTING_POSITION_Y + Constants.DECK_PADDING;
  //       return card;
  //     }));
  //     console.log(prevTable.deck);
  //     prevTable.cards = [];
  //     // flip all deck
  //     // prevTable.deck = prevTable.deck[0].map((card) => {
  //     //   card.isFlipped = true;
  //     //   // card.imageSource = card.imageSource;
  //     //   return card;
  //     // });
  //     return { ...prevTable };
  //   });
  // }
  // function shuffleCards() {
  //   setCanEmit(true);
  //   setTableData((prevTable) => {
  //     prevTable.deck = prevTable.deck.map((card) => {
  //       card.isFlipped = true;
  //       // card.imageSource = card.imageSource;
  //       return card;
  //     });
  //     prevTable.deck = prevTable.deck.sort(() => Math.random() - 0.5);
  //     return { ...prevTable };
  //   });
  // }
};

export default Table;
