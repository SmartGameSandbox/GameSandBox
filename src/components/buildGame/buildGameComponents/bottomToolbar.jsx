import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import { SMARTButton, SMARTIconButton } from "../../button/button";
import { FaChessPawn, FaPlus } from "react-icons/fa";
import Modal from "../../modal/modal";
import ImageUploadForm from "./imageUploadForm";
import "./bottomToolbar.css";
import axios from "axios";
const Buffer = require("buffer").Buffer;


const BottomToolbar = ({setDisplayCards}) => {

  // todo: move into constant
  const url =
    process.env.NODE_ENV === "production"
      ? "https://smartgamesandbox.herokuapp.com"
      : "http://localhost:8000";

  const location = useLocation();
  const navigate = useNavigate();

  const [showUpload, setShowUpload] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [images, setImages] = useState([]);
  const [imageURLs, setImageURLs] = useState([]);

  const [deck, setDeck] = useState([]);

  useEffect(() => {
    if (images.length < 1) return;
    const newImageURLs = [];
    images.forEach((image) => newImageURLs.push(URL.createObjectURL(image)));
    setImageURLs(newImageURLs);
  }, [images]);

  const onImageChange = (e) => {
    setImages([...e.target.files]);
  };

  function handleSave() {
    const newDeckId = localStorage.getItem('newDeckId');
    console.log(newDeckId);
    if (newDeckId) {
      alert("Please upload a card deck to create a game.");
      return;
    }
    const creatorId = localStorage.getItem("id");

    const gameInfo = location.state;
    gameInfo.creatorId = creatorId;
    gameInfo.newDeckId = newDeckId;

    axios
      .post(`${url}/api/saveGame`, gameInfo, {
        headers: { "Content-Type": "application/json" },
      })
      .then(async () => {
        console.log("Game successfully created with card deck uploaded.");
        await localStorage.removeItem('newDeckId');
        navigate("/dashboard");
      })
      .catch((err) => console.log(err));
  }

  const handleCardDisplay = async () => {
    const cardImages = [];

    for (let i = 0; i < deck.length; i++) {
      const imageObject = deck[i];
      const img = new window.Image();
      img.src = `data:image/${
        imageObject.imageSource.contentType
      };base64,${Buffer.from(imageObject.imageSource.data).toString("base64")}`;

      img.onload = async () => {
        await cardImages.push(img);
        await setDisplayCards(cardImages);
      };
    }
    setShowUpload(false);
  };

  return (
    <>
      <AppBar
        position="static"
        style={{ backgroundColor: "#163B6E", borderRadius: "20px" }}
      >
        <div className="tb-container">
          <div className="bt-IconBtnContainer">
            <SMARTIconButton
              theme="secondary"
              size="large"
              variant="contained"
              onClick={() => setShowUpload(true)}
            >
              <FaChessPawn />
            </SMARTIconButton>
            <SMARTIconButton
              theme="secondary"
              size="large"
              variant="contained"
              onClick={() => setShowUpload(true)}
              style={{
                marginLeft: "20px",
              }}
            >
              <FaChessPawn />
            </SMARTIconButton>
          </div>

          <div className="bt-BtnContainer">
            <SMARTButton
              theme="secondary"
              size="large"
              variant="contained"
              onClick={handleSave}
              style={{
                marginRight: "10px",
              }}
            >
              SAVE
            </SMARTButton>
          </div>
        </div>
      </AppBar>
      <Modal
        title="Card Decks"
        onClose={() => setShowUpload(false)}
        show={showUpload}
        style={{
          height: "500px",
          width: "800px",
        }}
      >
        <div className="wrapper">
          <div className="upload-container">
            <div className="plus-container">
              <SMARTIconButton
                className="card"
                size="large"
                variant="contained"
                onClick={() => setShowForm(true)}
                style={{
                  height: "160px",
                  width: "120px",
                  background: "#C7C7C7",
                }}
              >
                <FaPlus />
              </SMARTIconButton>
            </div>

            <div className="image-preview">
              {imageURLs.map((imageSrc, key) => (
                <img key={key} alt="" src={imageSrc} />
              ))}
            </div>
          </div>

          <SMARTButton
            theme="secondary"
            size="large"
            variant="contained"
            onClick={() => handleCardDisplay()}
            style={{
              marginTop: "15px",
            }}
          >
            SAVE
          </SMARTButton>
        </div>

        <Modal
          title="Upload Card Deck"
          onClose={() => setShowForm(false)}
          show={showForm}
        >
          <ImageUploadForm
            closePopup={() => setShowForm(false)}
            images={images}
            onImageChange={onImageChange}
            imageURLs={imageURLs}
            setImageURLs={setImageURLs}
            setDeck={setDeck}
          />
        </Modal>
      </Modal>
    </>
  );
}
export default BottomToolbar;
