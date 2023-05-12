import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Stage, Layer, Rect, Image } from "react-konva";
import { FaArrowLeft, FaEdit, FaSave } from "react-icons/fa";
import "./buildGamePage.css";
import BottomToolbar from "./buildGameComponents/bottomToolbar";
import { SMARTButton } from "../button/button";
import { CARD_HEIGHT, CARD_WIDTH } from "../../util/constants";

const BuildGamePage = () => {

  const location = useLocation();
  const [header, setHeader] = useState(location.state.name);
  const [displayCards, setDisplayCards] = useState([]);
  const [displayTokens, setDisplayTokens] = useState([]);
  const [displayPieces, setDisplayPieces] = useState([]);
  const [editHeader, setEditHeader] = useState(false);

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

  const handleFocus = (e) => {
    const range = document.createRange();
    range.selectNodeContents(e.target);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  const goBack = () => {
    window.history.back();
  };

  const editHeading = () => {
    setEditHeader(!editHeader);  
  };


  return (
    <>
      <div className="bgame-header">
        <SMARTButton
          variant="text"
          onClick={goBack}
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
          onClick={editHeading}
        >
          {editHeader
            ? <FaSave fontSize="large"/>
            : <FaEdit fontSize="large" />}
        </SMARTButton>
      </div>

      <div className="bgame-tabletop">
        <Stage width={8 + window.innerWidth / 1.7} height={window.innerHeight * 0.64}>
          <Layer id="layer">
            <Rect
              x={4}
              y={window.innerHeight / 20}
              width={window.innerWidth / 1.7}
              height={window.innerHeight / 2}
              cornerRadius={200}
              stroke="#163B6E"
              strokeWidth={5}
              fill="#EBEBEB"
            />
            {displayCards.map((item, index) => (
              item.map((img, index2) => (
                <Image
                key={`${index}-${index2}`}
                image={img}
                x={(index+1)*150 + index2}
                y={window.innerHeight / 4 - index2}
                width={CARD_WIDTH}
                height={CARD_HEIGHT}
                draggable
                stroke="#163B6E"
                strokeWidth={5}
                rotation = {img.className === "landscape" ? 90 : 0}
              />
              ))
            ))}
            {displayTokens.map((item, index) => (
              item.map((img, index2) => (
                <Image
                key={`${index}-${index2}`}
                image={img}
                x={(index+1)*150 + index2}
                y={window.innerHeight / 3 - index2 + CARD_WIDTH}
                width={CARD_WIDTH}
                height={CARD_WIDTH}
                draggable
              />
              ))
            ))}
            {displayPieces.map((item, index) => (
              item.map((img, index2) => (
                <Image
                key={`${index}-${index2}`}
                image={img}
                x={(index+1)*150 + index2}
                y={window.innerHeight / 9  - index2}
                width={CARD_WIDTH}
                height={CARD_HEIGHT}
                draggable
              />
              ))
            ))}
          </Layer>
        </Stage>
      </div>
      <div className="bgame-toolbar">
        <BottomToolbar 
          setDisplayCards={setDisplayCards}
          setDisplayTokens={setDisplayTokens}
          setDisplayPieces={setDisplayPieces}
        />
      </div>
    </>
  );
};
export default BuildGamePage;
