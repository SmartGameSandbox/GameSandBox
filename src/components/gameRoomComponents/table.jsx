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
  const [clickedID, setClickedID] = useState(null);
  const [canEmit, setCanEmit] = useState(true);
  const [itemUpdated, setItemUpdated] = useState(null);

  const GA_PARAMS = {setCanEmit, setTableData, emitMouseChange, tableData, setItemUpdated};

  useEffect(() => {
    if (!canEmit || !itemUpdated) return;
    if (itemUpdated.type === "drag") {
      socket.emit("itemDrag", { username, roomID, itemUpdated },
        (err) => {if (err) console.error(err);}
      );
      return;
    }
    if (itemUpdated.option) {
      socket.emit("itemAction", { username, roomID, itemUpdated },
        (err) => {if (err) console.error(err);}
      );
      return;
    }
    if (itemUpdated.src) {
      socket.emit("itemDrop", { username, roomID, itemUpdated },
        (err) => {if (err) console.error(err);}
      );
      return;
    }
  }, [itemUpdated, canEmit, roomID, username, socket]);

  useEffect(() => {
    socket.on("tableReload", (data) => {
      console.log(data);
      setTableData(data);
    });

    // To Do: move drag, drop, action somewhere else (e.g. gameAction)
    socket.on("tableChangeUpdate", (data) => {
      if (data.username === username) return;
      setCanEmit(false);
      console.log(data.updatedData);
      if (data.updatedData.type === "drag") {
        const {itemID, src, deckIndex, x, y} = data.updatedData;
        setTableData((prevTable) => {
          if (["hand", "cards"].includes(src)) {
            prevTable[src].map(item => {
              if (item.id === itemID) {
                item.x = x;
                item.y = y;
              }
              return item;
            });
          } else {
            prevTable[src][deckIndex].map(item => {
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
      if (data.updatedData.type === "drop") {
        const { handItem, itemID, pileIds, src, dest, deckIndex, x, y } = data.updatedData;
        // other user releasing card from their hand to the public
        if (handItem) {
          setTableData(prevTable => {
            if (dest === "cards") {
              prevTable.cards.push(handItem);
            } else {
              prevTable[dest][deckIndex].push(handItem);
            }
            return {...prevTable};
          });
          return;
        }
        setTableData((prevTable) => {
          let targetItem;
          if (["hand", "cards"].includes(src)) {
            targetItem = prevTable[src].find((item) => item.id === itemID);
          } else {
            targetItem = prevTable[src][deckIndex].find((item) => item.id === itemID);
          }
          // From table to table
          if (!dest) {
            const piles = prevTable.cards.filter(({id}) => pileIds.includes(id));
            prevTable.cards = prevTable.cards.filter(({id}) => ![...pileIds, itemID].includes(id));
            piles.forEach(item => {
              item.x = -100;
              item.y = -100;
              targetItem.pile = targetItem.pile.concat(item).concat(item.pile);
              item.pile = []
            });
            prevTable.cards.push(targetItem);
            // other place to table
          } else if (dest === "cards") {
            if (src === "hand") {
              prevTable.hand = prevTable.hand.filter(item => item.id !== itemID);
            } else {
              prevTable[src][deckIndex] = prevTable[src][deckIndex].filter((card) => card.id !== itemID);
            }
            prevTable.cards.push(targetItem);
          } else if (dest === "hand") {
            if (src === "cards") {
              prevTable.cards = prevTable.cards.filter(({id}) => id !== itemID);
            } else {
              prevTable[src][deckIndex] = prevTable[src][deckIndex].filter(({id}) => id !== itemID);
            }
          } else {
            if (targetItem.pile.length > 0) {
              targetItem.pile.forEach((item) => {
                item.x = x;
                item.y = y;
                prevTable.deck[deckIndex].push(item);
              });
            }
              targetItem.pile = [];
              targetItem.x = x;
              targetItem.y = y;
              if (src === "deck") {
                prevTable.deck[deckIndex] = prevTable.deck[deckIndex].filter(card => card.id !== itemID);
              } else {
                prevTable[src] = prevTable[src].filter(card => card.id !== itemID);
              }
              prevTable.deck[deckIndex].push(targetItem);
          }
          return {...prevTable};
        });
      }
      if (data.updatedData.type === "action") {
        const { itemID, option } = data.updatedData;
        setTableData((prevTable) => {
          if (option === "Flip") {
            prevTable.cards.map(item => {
              if (item.id !== itemID) return item;
              if (item.pile.length > 0) {
                item.pile.map(itemInPile => itemInPile.isFlipped = !itemInPile.isFlipped);
              }
              item.isFlipped = !item.isFlipped;
              return item;
            });
          } else if (option === "Disassemble") {
            prevTable.cards.forEach((card) => {
              if (card.id === itemID && card.pile.length > 0) {
                card.pile.forEach((cardInPile, index) => {
                  prevTable.cards.push(cardInPile);
                  cardInPile.x = card.x + (index+1)*20;
                  cardInPile.y = card.y + (index+1)*20;
                });
                card.pile = []
              };
            });
          }
          return {...prevTable};
        });
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
          setItemUpdated={setItemUpdated}
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
          setItemUpdated={setItemUpdated}
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
          setItemUpdated={setItemUpdated}
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
            itemID={clickedID}
            setTableData={setTableData}
            setCanEmit={setCanEmit}
            setRightClickPos={setRightClickPos}
            setClickedID={setClickedID}
            setItemUpdated={setItemUpdated}
          />
        )}
        <Hand
          tableData={tableData}
          setCanEmit={setCanEmit}
          setTableData={setTableData}
          emitMouseChange={emitMouseChange}
          setItemUpdated={setItemUpdated}
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

  function handleContextMenu(event, itemID) {
    event.evt.preventDefault();
    const {
      top: konvaTop,
      left: konvaLeft
    } = document.querySelector(".konvajs-content").getBoundingClientRect();
    const {clientY, clientX} = event.evt;
    setRightClickPos({ x: clientX - konvaLeft - 1, y: clientY - konvaTop - 1});
    setClickedID(itemID);
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
