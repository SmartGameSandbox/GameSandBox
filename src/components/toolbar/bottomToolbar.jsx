import * as React from "react";
import { useState, useEffect } from "react";

import AppBar from "@mui/material/AppBar";
import { SMARTButton, SMARTIconButton } from "../button/button";
import { FaChessPawn, FaPlus } from "react-icons/fa";
import Modal from "../modal/modal";
import ImageUploadForm from "../buildGame/imageUploadForm";
import "./bottomToolbar.css";

function BottomToolbar() {

  const [showUpload, setShowUpload] = useState(false);
  const [showForm, setShowForm] = useState(false);

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
                <img key={key} src={imageSrc} />
              ))}
            </div>
          </div>

          <SMARTButton
              theme="secondary"
              size="large"
              variant="contained"
              onClick={() => setShowUpload(false)}
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
          />
        </Modal>
      </Modal>
    </>
  );
}
export default BottomToolbar;
