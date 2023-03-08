import * as React from "react";
import { useState } from "react";

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

  function handleSave() {
    console.log("Save");
  }

  let displayImagegrids = [];

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

        <Modal
          title="Upload Card Deck"
          onClose={() => setShowModal2(false)}
          show={showModal2}
        >
          <ImageUploadForm closePopup={() => setShowModal2(false)} />
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
