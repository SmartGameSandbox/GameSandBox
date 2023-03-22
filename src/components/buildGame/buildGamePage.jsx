import { React, useState, useEffect } from "react";
import { Stage, Layer, Rect, Image } from "react-konva";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import "./buildGamePage.css";
import BottomToolbar from "../toolbar/bottomToolbar";
import Sidebar from "../sidebar/Sidebar";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import { SMARTButton } from "../button/button";
import { shape } from "@mui/system";
const Buffer = require("buffer").Buffer;


const BuildGamePage = () => {
  const location = useLocation();
  const gameInfo = location.state;
  console.log(gameInfo);

  
  const url =
    process.env.NODE_ENV === "production"
      ? "https://smartgamesandbox.herokuapp.com"
      : "http://localhost:8000";

  const goBack = () => {
    console.log("Go Back");
    window.history.back();
  };

  const editHeading = () => {
    console.log("Edit the heading");
  };

  let card_locations = window.innerWidth / 3.1;

  const [images, setImages] = useState([]);
  useEffect(() => {
    let imageObject;
    let tempArray = [];
    axios
      .post(`${url}/getUploadedCardFaces`, {
        headers: { "Content-Type": "application/json" },
      })
      .then( (res) => {
        for (let i = 0; i < res.data.file.length; i++) {
          imageObject = res.data.file[i];
          const img = new window.Image();
          img.src = `data:image/${
            imageObject.imageSource.contentType
          };base64,${Buffer.from(imageObject.imageSource.data).toString(
            "base64"
          )}`;
          img.onload = () => {
            tempArray.push(img);
            setImages(tempArray);
            console.log(tempArray.length);
          };
        }
      })
      .catch((err) => console.log(err));
  }, []);

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
          Game 123 Same
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
            {images.map((item, index) => (
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
        <BottomToolbar />
      </div>
    </>
  );
};
export default BuildGamePage;
