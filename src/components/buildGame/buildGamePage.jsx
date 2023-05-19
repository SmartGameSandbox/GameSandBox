import "./buildGame.css";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Stage, Layer, Rect, Image, Text } from "react-konva";
import { FaArrowLeft, FaEdit, FaSave } from "react-icons/fa";
import BottomToolbar from "./bottomToolbar";
import { SMARTButton } from "../button/button";
import { CANVAS_HEIGHT, HAND_HEIGHT, CANVAS_WIDTH } from "../../util/constants";
const Buffer = require("buffer").Buffer;

/**
 * Page that handles creation, display, and storage of game data.
 * @component
 */
const BuildGamePage = () => {

  const location = useLocation();
  const [header, setHeader] = useState(location.state.name);
  const [displayItems, setDisplayItems] = useState([]);
  const [editHeader, setEditHeader] = useState(false);
  const [itemToAdd, setItemToAdd] = useState(null);
  const [pointerLocation, setPointerLocation] = useState({x: null, y: null});
  
  const [decks, setDecks] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [pieces, setPieces] = useState([]);

  // getter and setter key-value mapping used in placeItem() and removeItem()
  const getters = {Card: decks, Token: tokens, Piece: pieces};
  const setters = {Card: setDecks, Token: setTokens, Piece: setPieces};

  const gameName = useRef(location.state.name);

  // detect and store game name update
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


  // Detect update in the game data (deck, token and piece) to display/remove.
  useEffect(() => {
    if (itemToAdd) return;
    const lastItem = decks.at(-1);
    if (removeItems(lastItem, "Card")) return;
    setItemToAdd({images: createImages(lastItem), type: "Card", name: lastItem.name});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decks]);
  useEffect(() => {
    if (itemToAdd) return;
    const lastItem = tokens.at(-1);
    if (removeItems(lastItem, "Token")) return;
    setItemToAdd({images: createImages(lastItem), type: "Token", name: lastItem.name});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens]);
  useEffect(() => {
    if (itemToAdd) return;
    const lastItem = pieces.at(-1);
    if (removeItems(lastItem, "Piece")) return;
    setItemToAdd({images: createImages(lastItem), type: "Piece", name: lastItem.name});
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                // if no item to add, do not track cursor position
                if (!itemToAdd) return;
                setPointerLocation({x: evt.layerX, y: evt.layerY});}}
            />
            {displayItems.map(({images, x, y}, index) => (
              images.map((img, index2) => (
                <Image
                key={`${index}-${index2}`}
                image={img}
                x={x}
                y={y}
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
                {/* visual pointer when adding item */}
                <Rect
                  x={pointerLocation.x-20}
                  y={pointerLocation.y-20}
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

  /**
   * Convert an array of image data to array of imageDom
   * 
   * @param {[Object]} deck Array of image data 
   * @returns Array of Image Dom to be displayed
   */
  function createImages({ deck }) {
    return deck.map(imageObject => {
      const img = new window.Image();
      img.src = `data:image/${
        imageObject.imageSource.back.contentType
        || imageObject.imageSource.front.contentType
      };base64,${Buffer.from(
        imageObject.imageSource.back.data
        || imageObject.imageSource.front.data).toString("base64")}`;
      img.className = imageObject.isLandscape ? 'landscape' : '';
      return img;
    });
  }

  /**
   * Select all text in the heading when edit toggled.
   * 
   * @param {FocusEvent} e 
   */
  function handleFocus(e) {
    const range = document.createRange();
    range.selectNodeContents(e.target);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  /**
   * Check itemToAdd and pointerLocation to display and update game data.
   */
  function placeItem() {
    if (!itemToAdd) return;
    let { x, y } = pointerLocation;
    const {width, height} = itemToAdd.images[0];
    // centering the image to the pointer location
    x -= width/2;
    y -= height/2;
    // updating the displayItem[] that is displayed on the table
    setDisplayItems(prevItem => [...prevItem, {...itemToAdd, x, y }]);
    setters[itemToAdd.type](prevItems => {
      const lastItem = prevItems.at(-1);
      if (!lastItem) return prevItems;
      // update the game data with the position and dimension
      lastItem.deck = lastItem.deck.map((item) => ({...item, x, y, width, height}));
      return [...prevItems.filter(({name}) => name !== lastItem.name), lastItem];
    })
    // Delay to prevent item getting added infinite amount.
    setTimeout(() => {
      setItemToAdd(null);
      setPointerLocation({x: null, y: null});
    }, 100);
  }

  /**
   * Check whether the item exists in data and remove if it does.
   * Triggered by change in game Data (delete, addition)
   * 
   * @param {Object} item the most recent item
   * @param {String} type deck, token or piece
   * 
   * @returns true if item is removed, false if there is no item to remove.
   */
  function removeItems(item, type) {
    // Deleting the last item in the bottom bar
    if (!item) {
      setDisplayItems(prevItem => prevItem.filter((item) => item.type !== type));
      return true;
    }
    // If an item removed from the data, filter display by remaining item in data.
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
