import React from "react";
import { Layer, Rect, Text } from "react-konva";
import Card from "../card/card";
import * as Constants from "../../util/constants";
import Cursors from "../cursor/cursors";
import Hand from "../hand/hand";
import Deck from "../deck/deck";

const search = window.location.search;
const params = new URLSearchParams(search);
const roomID = params.get("id");
let canEmit = true;
const Table = ({ socket, username }) => {
  const [tableData, setTableData] = React.useState(null);
  const [cursors, setCursors] = React.useState([]);
  const setCanEmit = (value) => {
    canEmit = value;
  };
  React.useEffect(() => {
    if (canEmit && tableData) {
      socket.emit(
        "tableChange",
        {
          username: username,
          roomID: roomID,
          tableData: tableData,
        },
        (err) => {
          if (err) {
            console.error(err);
          }
        }
      );
    }
  }, [tableData, username, socket]);

  React.useEffect(() => {
    socket.on("tableReload", (data) => {
      setTableData({
        cards: data.cards,
        deck: data.deck,
        hand: data.hand,
      });
    });

    socket.on("tableChangeUpdate", (data) => {
      if (data.username !== username) {
        canEmit = false;
        setTableData((prevTable) => {
          prevTable.cards = data.tableData.cards;
          prevTable.deck = data.tableData.deck;
          return { ...prevTable };
        });
      }
    });

    socket.on("mousePositionUpdate", (data) => {
      if (data.username !== username) {
        // update cursor position in object inside cursors
        setCursors((prevCursors) => {
          const found = prevCursors.find(
            (cursor) => cursor.username === data.username
          );
          if (found) {
            return prevCursors.map((cursor) => {
              if (cursor.username === data.username) {
                cursor.x = data.x;
                cursor.y = data.y;
              }
              return cursor;
            });
          } else {
            return prevCursors.concat([
              { username: data.username, x: data.x, y: data.y },
            ]);
          }
        });
      }
    });

    return () => {
      socket.off("roomCardData");
      socket.off("tableChangeUpdate");
      socket.off("mousePositionUpdate");
    };
  }, [socket, username]);

  const emitMouseChange = (e) => {
    socket.emit(
      "mouseMove",
      {
        x: e.evt.offsetX,
        y: e.evt.offsetY,
        username: username,
        roomID: roomID,
      },
      (err) => {
        if (err) {
          alert(err);
        }
      }
    );
  };

  const onDragMoveCard = (e, cardID) => {
    canEmit = true;
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
  };

  const onClickCard = (e, cardID) => {
    // flip card
    canEmit = true;
    setTableData((prevTable) => {
      const found = prevTable.cards.find((card) => card.id === cardID);
      found.isFlipped = !found.isFlipped;
      // found.imageSource = found.imageSource; //Make a change here to flip cards
      // move found to the last index of cards array
      prevTable.cards = prevTable.cards.filter((card) => card.id !== cardID);
      prevTable.cards = [...prevTable.cards, found];
      return { ...prevTable };
    });
  };

  const onDragEndCard = (e, cardID) => {
    const position = e.target.attrs;
    canEmit = true;
    // Draw Card from table to hand
    if (
      position.y >
      Constants.CANVAS_HEIGHT -
        Constants.HAND_HEIGHT -
        0.5 * Constants.CARD_HEIGHT
    ) {
      setTableData((prevTable) => {
        // find card in tableData.cards
        const found = prevTable.cards.find((card) => card.id === cardID);
        prevTable.hand.push(found);
        found.x =
          Constants.HAND_PADDING_X +
          (prevTable.hand.length - 1) * Constants.HAND_CARD_GAP;
        found.y =
          Constants.CANVAS_HEIGHT -
          Constants.HAND_HEIGHT +
          Constants.HAND_PADDING_Y;
        // add card to hand
        prevTable.cards = prevTable.cards.filter((card) => card.id !== cardID);
        return { ...prevTable };
      });
    }

    // card from table to deck
    else if (
      position.x >= Constants.DECK_STARTING_POSITION_X - Constants.CARD_WIDTH &&
      position.x <=
        Constants.DECK_STARTING_POSITION_X + Constants.DECK_AREA_WIDTH &&
      position.y >=
        Constants.DECK_STARTING_POSITION_Y - Constants.CARD_HEIGHT &&
      position.y <=
        Constants.DECK_STARTING_POSITION_Y + Constants.DECK_AREA_HEIGHT
    ) {
      setTableData((prevTable) => {
        // find card in tableData.cards
        const found = prevTable.cards.find((card) => card.id === cardID);
        found.x = Constants.DECK_STARTING_POSITION_X + Constants.DECK_PADDING;
        found.y = Constants.DECK_STARTING_POSITION_Y + Constants.DECK_PADDING;
        // add card to deck
        prevTable.deck.push(found);
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
            var newPile = structuredClone(found)
            newPile.pile = newPile.pile.concat(pile).concat(pile.pile)
            pile.x = -100
            pile.y = -100
            console.log(newPile)
            prevTable.cards.push(newPile)
          }
        })

        return { ...prevTable };
      });
    }
  };

  const collectCards = () => {
    canEmit = true;
    setTableData((prevTable) => {
      // put cards to deck
      prevTable.deck = prevTable.deck.concat(prevTable.cards);
      // set cards in deck to starting position
      prevTable.deck = prevTable.deck.map((card) => {
        card.x = Constants.DECK_STARTING_POSITION_X + Constants.DECK_PADDING;
        card.y = Constants.DECK_STARTING_POSITION_Y + Constants.DECK_PADDING;
        return card;
      });
      prevTable.cards = [];
      // flip all deck
      prevTable.deck = prevTable.deck.map((card) => {
        card.isFlipped = true;
        // card.imageSource = card.imageSource;
        return card;
      });
      return { ...prevTable };
    });
  };

  const shuffleCards = () => {
    canEmit = true;
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

  return (
    <>
      <Layer>
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

        <Deck
          tableData={tableData}
          setCanEmit={setCanEmit}
          setTableData={setTableData}
          canEmit={canEmit}
          emitMouseChange={emitMouseChange}
        />
        {tableData &&
          tableData.cards &&
          tableData.cards.map((card) => (
            <Card
              username={username}
              roomID={roomID}
              key={`card_${card.id}`}
              src={card.imageSource}
              id={card.id}
              x={card.x}
              y={card.y}
              isFlipped={card.isFlipped}
              isLandscape={card.isLandscape}
              onDragStart={() => {}}
              onDragMove={onDragMoveCard}
              onClick={onClickCard}
              onDragEnd={onDragEndCard}
            />
          ))}
        <Hand
          tableData={tableData}
          setCanEmit={setCanEmit}
          setTableData={setTableData}
          canEmit={canEmit}
          emitMouseChange={emitMouseChange}
          x={"500px"}
          fill="red"
        />
      </Layer>
      <Layer>
        <Text
          x={0}
          y={0}
          padding={10}
          key={`collect_btn`}
          fill={"black"}
          fontSize={20}
          text={"Collect Cards"}
          onClick={() => collectCards()}
        />
        <Text
          x={150}
          y={0}
          padding={10}
          key={`shuffle_btn`}
          fill={"black"}
          fontSize={20}
          text={"Shuffle Cards"}
          onClick={() => shuffleCards()}
        />
        <Cursors key={`cursor_${username}`} cursors={cursors} />
      </Layer>
    </>
  );
};

export default Table;
