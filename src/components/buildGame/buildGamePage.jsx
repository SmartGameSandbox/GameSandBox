import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Stage, Layer, Rect, Image } from "react-konva";
import { FaArrowLeft, FaEdit, FaSave } from "react-icons/fa";
import "./buildGamePage.css";
import BottomToolbar from "./buildGameComponents/bottomToolbar";
import Sidebar from "../sidebar/Sidebar";
import { SMARTButton } from "../button/button";

const BuildGamePage = () => {

  const location = useLocation();
  const [header, setHeader] = useState(location.state.name);
  const [displayCards, setDisplayCards] = useState([]);
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

  let card_locations = window.innerWidth / 3.1;
  
  return (
    <>
      <Sidebar></Sidebar>
      <div className="bgame-container"></div>
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
        <Stage width={window.innerWidth} height={window.innerHeight * 0.64}>
          <Layer id="layer">
            <Rect
              x={window.innerWidth / 5}
              y={window.innerHeight / 20}
              width={window.innerWidth / 1.7}
              height={window.innerHeight / 2}
              cornerRadius={200}
              stroke="#163B6E"
              strokeWidth={5}
              fill="#EBEBEB"
            />
            {displayCards.map((item, index) => (
              <Image
                key={index}
                image={item}
                x={card_locations += 20}
                y={window.innerHeight / 5}
                width={window.innerWidth / 20}
                height={window.innerHeight / 8}
                draggable
                stroke="#163B6E"
                strokeWidth={5}
              />
            ))}
          </Layer>
        </Stage>
      </div>
      <div className="bgame-toolbar">
        <BottomToolbar setDisplayCards = {setDisplayCards}/>
      </div>
    </>
  );
};
export default BuildGamePage;
