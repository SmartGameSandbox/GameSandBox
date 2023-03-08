import * as React from "react";
import { useState, useEffect } from "react";

import AppBar from "@mui/material/AppBar";
import { SMARTButton, SMARTIconButton } from "../button/button";
import { FaChessPawn, FaPlus } from "react-icons/fa";
import Modal from "../modal/modal";
import BuildGameForm from "../buildGame/buildGameForm";
import ImageUploadForm from "../buildGame/imageUploadForm";
import "./bottomToolbar.css";

function BottomToolbar() {
  const [show, setShow] = useState(false);
  const [showModal2, setShowModal2] = React.useState(false);

  const [showModal3, setShowModal3] = React.useState(false);

  const [images, setImages] = useState([]);
  const [imageURLs, setImageURLs] = useState([]);

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
    console.log("Save");
  }

  return (
    <>
      <AppBar
        position="static"
        style={{ backgroundColor: "#163B6E", borderRadius: "5%" }}
      >
        <div className="tb-container">
          <div className="bt-IconBtnContainer">
            <SMARTIconButton
              theme="secondary"
              size="large"
              variant="contained"
              onClick={() => setShow(true)}
            >
              <FaChessPawn />
            </SMARTIconButton>
            <SMARTIconButton
              theme="secondary"
              size="large"
              variant="contained"
              onClick={() => setShow(true)}
              style={{
                marginLeft: "20px",
              }}
            >
              <FaChessPawn />
            </SMARTIconButton>

            <SMARTIconButton
              theme="secondary"
              size="large"
              variant="contained"
              onClick={() => setShowModal3(true)}
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
        onClose={() => setShow(false)}
        show={show}
        style={{
          height: "500px",
          width: "700px",
        }}
      >
        <div className="wrapper">
          <div className="upload-container">
            <div className="plus-container">
              <SMARTIconButton
                className="card"
                size="large"
                variant="contained"
                onClick={() => setShowModal2(true)}
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
                <img key={key} src={imageSrc} />
              ))}
            </div>
          </div>

          <SMARTButton
              theme="secondary"
              size="large"
              variant="contained"
              onClick={handleSave}
              style={{
                marginTop: "15px",
              }}
            >
              SAVE
            </SMARTButton>
            </div>

        <Modal
          title="Upload Card Deck"
          onClose={() => setShowModal2(false)}
          show={showModal2}
        >
          <ImageUploadForm
            closePopup={() => setShowModal2(false)}
            images={images}
            onImageChange={onImageChange}
            imageURLs={imageURLs}
            setImageURLs={setImageURLs}
          />
        </Modal>
      </Modal>

      <Modal
        title="Build Game"
        onClose={() => setShowModal3(false)}
        show={showModal3}
        style={{
          height: "500px",
          width: "700px",
        }}
      >
        <BuildGameForm closePopup={() => setShowModal3(false)} />
      </Modal>
    </>
  );
}
export default BottomToolbar;
