import React, { useState, useEffect, useRef } from "react";
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


const BottomToolbar = ({setDisplayCards, setDisplayTokens, setDisplayPieces}) => {

  const location = useLocation();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);

  const [images, setImages] = useState([]);
  const [imageURLs, setImageURLs] = useState([]);
  const [decks, setDecks] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [pieces, setPieces] = useState([]);

  const nodeRef = useRef(null);

  useEffect(() => {
    if (images.length < 1) return;
    const newImageURLs = [];
    images.forEach((image) => newImageURLs.push(URL.createObjectURL(image)));
    setImageURLs(newImageURLs);
  }, [images]);

  const onImageChange = (e) => {
    setImages([...images, ...e.target.files]);
  };

  useEffect(() => {
    setTimeout(() => {
      setDisplayCards(createImages(decks));
    }, 100);
  }, [decks, setDisplayCards]);

  useEffect(() => {
    setTimeout(() => {
      setDisplayTokens(createImages(tokens));
    }, 100);
  }, [tokens, setDisplayTokens]);

  useEffect(() => {
    setTimeout(() => {
      setDisplayPieces(createImages(pieces));
    }, 100);
  }, [pieces, setDisplayPieces]);

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
              {imageURLs.map((imageSrc, key) => (
                <div
                  key={key}
                  className="image-preview"
                  style={{backgroundImage: `url('${imageSrc}')`}}
                />
              ))}
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
              SAVE GAME
            </SMARTButton>
          </div>
        </div>
      </AppBar>
      <Modal
        title="Upload Item"
        onClose={() => setShowForm(false)}
        show={showForm}
        nodeRef={nodeRef}
      >
        <ImageUploadForm
          closePopup={() => setShowForm(false)}
          images={images}
          onImageChange={onImageChange}
          imageURLs={imageURLs}
          setImageURLs={setImageURLs}
          setDecks={setDecks}
          setTokens={setTokens}
          setPieces={setPieces}
        />
      </Modal>
    </>
  );

  function handleSave() {
    const promises = decks.map((obj) => {
      return axios
              .post(`${BASE_URL}/api/addDecks`, obj, {
                headers: { "Content-Type": "application/json" }
              }).then((res) => res.data);
    })
    Promise.all(promises)
      .then((values) => values.map(({ deckId }) => deckId))
      .then((deckIds) => {
        const gameInfo = {
          ...location.state,
          creatorId: localStorage.getItem('id'),
          newDeckIds: deckIds,
        };
        axios
          .post(`${BASE_URL}/api/saveGame`, gameInfo, {
            headers: { "Content-Type": "application/json" },
        })
          .then(async () => {
            navigate("/dashboard");
        })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }

  function createImages(state) {
    return state.map(({ deck }) => {
      return deck.map(imageObject => {
        const img = new window.Image();
        img.src = `data:image/${
          imageObject.imageSource.contentType
        };base64,${Buffer.from(imageObject.imageSource.data).toString("base64")}`;
        img.className = imageObject.isLandscape ? 'landscape' : '';
        return img;
      });
    });
  }
}
export default BottomToolbar;
