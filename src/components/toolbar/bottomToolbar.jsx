import * as React from "react";
import { useState } from "react";

import AppBar from "@mui/material/AppBar";
import { SMARTButton, SMARTIconButton } from "../button/button";
import { FaChessPawn, FaPlus } from "react-icons/fa";
import Modal from "../modal/modal";

import "./bottomToolbar.css";

function BottomToolbar() {
  const [show, setShow] = useState(false);

  const [showModal2, setShowModal2] = React.useState(false);

  function handleSave() {
    console.log("Save");
  }

  let displayImagegrids = [];

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
          title="Nada"
          onClose={() => setShowModal2(false)}
          show={showModal2}
        >
          <p>This is modal body</p>

          <SMARTButton
            theme="secondary"
            size="large"
            variant="contained"
            onClick={() => setShowModal2(false)}
          >
            Create Deck
          </SMARTButton>

        </Modal>
      </Modal>
    </>
  );
}
export default BottomToolbar;
