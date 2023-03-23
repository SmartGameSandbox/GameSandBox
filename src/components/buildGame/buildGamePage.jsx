import { React, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Stage, Layer, Rect, Image } from "react-konva";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import "./buildGamePage.css";
import BottomToolbar from "../toolbar/bottomToolbar";
import Sidebar from "../sidebar/Sidebar";
import axios from "axios";
import { SMARTButton } from "../button/button";
const Buffer = require("buffer").Buffer;


const BuildGamePage = () => {

  const location = useLocation();
  const [header, setHeader] = useState("");
  useEffect(() => {
    setHeader(location.state.name);
  }, [location]);

  const url =
    process.env.NODE_ENV === "production"
      ? "https://smartgamesandbox.herokuapp.com"
      : "http://localhost:8000";

  const goBack = () => {
    window.history.back();
  };

  const editHeading = () => {
    console.log("Edit the heading");
  };

  let card_locations = window.innerWidth / 3.1;

  const [displayCards, setDisplayCards] = useState([]);
  
  return (
    <>
      <Sidebar></Sidebar>
      <div className="bgame-container"></div>
      <div className="bgame-header">
        <SMARTButton
          variant="text"
          onClick={goBack}
          style={{
            height: "4em",
            background: "transparent",
            borderRadius: "5em",
            marginRight: "0.75em",
            color: "#163B6E",
          }}
        >
          <FaArrowLeft fontSize="large" />
        </SMARTButton>

        <h4
          className="bgame-heading"
          style={{ fontFamily: "Nunito", fontSize: "2em", margin: "0px" }}
        >
          {header}
        </h4>

        <SMARTButton
          variant="text"
          onClick={editHeading}
          style={{
            height: "4em",
            marginLeft: "0.75em",
            background: "transparent",
            borderRadius: "5em",
            color: "#163B6E",
          }}
        >
          <FaEdit fontSize="large" />
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
