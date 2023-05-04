import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import { SMARTButton, SMARTIconButton } from "../../button/button";
import { FaPlus } from "react-icons/fa";
import Modal from "../../modal/modal";
import ImageUploadForm from "./imageUploadForm";
import "./bottomToolbar.css";
import { BASE_URL } from '../../../util/constants'
const Buffer = require("buffer").Buffer;


const BottomToolbar = ({setDisplayCards}) => {

  const location = useLocation();
  const navigate = useNavigate();

  // const [showUpload, setShowUpload] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [images, setImages] = useState([]);
  const [imageURLs, setImageURLs] = useState([]);

  const [deck, setDeck] = useState([]);

  console.log(showForm);

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
    if (newDeckId) {
      alert("Please upload an item to create a game.");
      return;
    }
    const creatorId = localStorage.getItem("id");

    const gameInfo = location.state;
    gameInfo.creatorId = creatorId;
    gameInfo.newDeckId = newDeckId;

    axios
      .post(`${BASE_URL}/api/saveGame`, gameInfo, {
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
        cardImages.push(img);
        await setDisplayCards(cardImages);
      };
    }
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
              onClick={() => setShowForm(true)}
            >
              <FaPlus />
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
        title="Upload Item"
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
      {/*
            <div className="image-preview">
              {imageURLs.map((imageSrc, key) => (
                <img key={key} alt="" src={imageSrc} />
              ))}
            </div>
          </div>*/}
    </>
  );
}
export default BottomToolbar;
