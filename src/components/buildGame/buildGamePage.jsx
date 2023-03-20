import React from "react";
import { Stage, Layer, Rect } from "react-konva";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import "./buildGamePage.css";
import BottomToolbar from "../toolbar/bottomToolbar";
import Sidebar from "../sidebar/Sidebar";

import { SMARTButton } from "../button/button";

const BuildGamePage = () => {
  const goBack = () => {
    console.log("Go Back");
    window.history.back();
  };

  const editHeading = () => {
    console.log("Edit the heading");
  };
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
            borderRadius: '5em',
            marginRight: "0.75em",
            color: "#163B6E"
          }}
        >
          <FaArrowLeft fontSize="large" />
        </SMARTButton>

        <h4 className="bgame-heading" style={{fontFamily: 'Nunito', fontSize: '2em', margin: '0px'}}>Game 123 Same</h4>

        <SMARTButton
          variant="text"
          onClick={editHeading}
          style={{
            height: "4em",
            marginLeft: "0.75em",
            background: "transparent",
            borderRadius: '5em',
            color: "#163B6E"
          }}
        >
          <FaEdit fontSize="large" />
        </SMARTButton>
      </div>

      <div className="bgame-tabletop">
        <Stage width={window.innerWidth} height={window.innerHeight * 0.64}>
          <Layer>
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
          </Layer>
        </Stage>
      </div>
      <div className="bgame-toolbar">
        <BottomToolbar />
      </div>
    </>
  );
};
export default BuildGamePage;
