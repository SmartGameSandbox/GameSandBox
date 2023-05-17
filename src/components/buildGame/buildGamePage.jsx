import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Stage, Layer, Rect, Image, Text } from "react-konva";
import { FaArrowLeft, FaEdit, FaSave } from "react-icons/fa";
import "./buildGamePage.css";
import BottomToolbar from "./buildGameComponents/bottomToolbar";
import { SMARTButton } from "../button/button";
import { CANVAS_HEIGHT, HAND_HEIGHT, CANVAS_WIDTH } from "../../util/constants";
const Buffer = require("buffer").Buffer;

const BuildGamePage = () => {

  const location = useLocation();
  const [header, setHeader] = useState(location.state.name);
  const [displayItems, setDisplayItems] = useState([]);
  const [editHeader, setEditHeader] = useState(false);
  const [itemToAdd, setItemToAdd] = useState(null);
  const [toggleLocation, setToggleLocation] = useState({x: null, y: null});
  
  const [decks, setDecks] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [pieces, setPieces] = useState([]);
  const getters = {Card: decks, Token: tokens, Piece: pieces};
  const setters = {Card: setDecks, Token: setTokens, Piece: setPieces};

  const gameName = useRef(location.state.name);

  useEffect(() => {
    if (editHeader) {
      document.querySelector('.bgame-heading').focus();
      return;
    }
    const headerText = gameName.current.innerText;
    if (headerText) {
      location.state.name = headerText;
      setHeader(headerText);
    }
  }, [editHeader, location]);

  useEffect(() => {
    if (itemToAdd) return;
    const lastItem = decks.at(-1);
    if (removeItems(lastItem, "Card")) return;
    setItemToAdd({images: createImages(lastItem), type: "Card", name: lastItem.name});
  }, [decks]);

  useEffect(() => {
    if (itemToAdd) return;
    const lastItem = tokens.at(-1);
    if (removeItems(lastItem, "Token")) return;
    setItemToAdd({images: createImages(lastItem), type: "Token", name: lastItem.name});
  }, [tokens]);

  useEffect(() => {
    if (itemToAdd) return;
    const lastItem = pieces.at(-1);
    if (removeItems(lastItem, "Piece")) return;
    setItemToAdd({images: createImages(lastItem), type: "Piece", name: lastItem.name});
  }, [pieces]);

  return (
    <>
      <div
        className="blur"
        style={{display: `${itemToAdd ? 'block' : 'none'}`}}/>
      <div className="bgame-header">
        <SMARTButton
          variant="text"
          onClick={() => window.history.back()}
        >
          <FaArrowLeft fontSize="large" />
        </SMARTButton>

        <div
          className="bgame-heading"
          ref={gameName}
          tabIndex={-1}
          suppressContentEditableWarning
          contentEditable={editHeader}
          onFocus={handleFocus}
        >
          {header}
        </div>

        <SMARTButton
          variant="text"
          onClick={() => setEditHeader(!editHeader)}
        >
          {editHeader
            ? <FaSave fontSize="large"/>
            : <FaEdit fontSize="large" />}
        </SMARTButton>
      </div>

      <div className="bgame-tabletop">
        <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT - HAND_HEIGHT}>
          <Layer id="layer">
            <Rect
              x={0}
              y={0}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT-HAND_HEIGHT}
              stroke="#163B6E"
              strokeWidth={5}
              fill="#EBEBEB"
              onClick={() => placeItem()}
              onMouseMove={({evt}) => {
                if (!itemToAdd) return;
                setToggleLocation({x: evt.layerX, y: evt.layerY});}}
            />
            {displayItems.map(({images, x, y}, index) => (
              images.map((img, index2) => (
                <Image
                key={`${index}-${index2}`}
                image={img}
                x={x - img.width / 4}
                y={y - img.height / 4}
                width={img.width}
                height={img.height}
                draggable
                rotation = {img.className === "landscape" ? 90 : 0}
              />
              ))
            ))}
            {!!itemToAdd && (
              <>
                <Text
                  x={10}
                  y={10}
                  fontSize={24}
                  fontStyle="italic bold"
                  fill="#000000A4"
                  text="place item on board"
                />
                <Rect
                  x={toggleLocation.x-20}
                  y={toggleLocation.y-20}
                  width={40}
                  height={40}
                  cornerRadius={15}
                  stroke="#163B6E"
                  strokeWidth={2}
                  listening={false}
                />
              </>
              )}
          </Layer>
        </Stage>
      </div>
      <div className="bgame-toolbar">
        <BottomToolbar 
          decks={decks}
          setDecks={setDecks}
          tokens={tokens}
          setTokens={setTokens}
          pieces={pieces}
          setPieces={setPieces}
        />
      </div>
    </>
  );

  function createImages({ deck }) {
    return deck.map(imageObject => {
      const img = new window.Image();
      img.src = `data:image/${
        imageObject.imageSource.front.contentType
      };base64,${Buffer.from(imageObject.imageSource.front.data).toString("base64")}`;
      img.className = imageObject.isLandscape ? 'landscape' : '';
      return img;
    });
  }

  function handleFocus(e) {
    const range = document.createRange();
    range.selectNodeContents(e.target);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function placeItem() {
    if (!itemToAdd) return;
    setDisplayItems(prevItem => [...prevItem, {...itemToAdd, ...toggleLocation }]);
    setters[itemToAdd.type](prevItems => {
      const lastItem = prevItems.at(-1);
      if (!lastItem) return prevItems;
      lastItem.deck = lastItem.deck.map((item) => ({...item, ...toggleLocation}));
      return [...prevItems.filter(({name}) => name !== lastItem.name), lastItem];
    })
    setTimeout(() => {
      setItemToAdd(null);
      setToggleLocation({x: null, y: null});
    }, 100);
  }

  function removeItems(item, type) {
    if (!item) {
      setDisplayItems(prevItem => prevItem.filter((item) => item.type !== type));
      return true;
    }
    if (displayItems.filter((item) => item.type === type).length > getters[type].length) {
      setDisplayItems(prevItem => prevItem
                                  .filter(({name}) => getters[type]
                                    .map(item => item.name)
                                      .includes(name)));
      return true;
    }
    return false;
  }
};
export default BuildGamePage;
