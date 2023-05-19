import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import { SMARTButton, SMARTIconButton } from "../button/button";
import { FaPlus } from "react-icons/fa";
import Modal from "../modal/modal";
import ImageUploadForm from "./imageUploadForm";
import { BASE_URL } from '../../util/constants'

/**
 * Bottom bar for toggling imageUploadForm and game save UI.
 * @component
 * 
 * @property {Array} decks
 * @property {function} setDecks
 * @property {Array} tokens
 * @property {function} setTokens
 * @property {Array} pieces
 * @property {function} setPieces
 */
const BottomToolbar = ({
  decks, setDecks, tokens, setTokens, pieces, setPieces }) => {

  const location = useLocation();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [thumbnails, setThumbnails] = useState([]);

  // for modal
  const nodeRef = useRef(null);

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
              {thumbnails.map(({ faceImage, name, itemType }, key) => (
                <div
                  key={key}
                  className={`image-preview ${itemType}`}
                  style={{backgroundImage: `url('${URL.createObjectURL(faceImage)}')`}}
                  onMouseOver={(e) => {e.target.innerText = "X"}}
                  onMouseLeave={(e) => {e.target.innerText = ""}}
                  onClick={() => {deleteItem(name, itemType)}}
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
          setThumbnails={setThumbnails}
          setDecks={setDecks}
          setTokens={setTokens}
          setPieces={setPieces}
        />
      </Modal>
    </>
  );

  /**
   * Delete clicked item from the data and bottom bar.
   * 
   * @param {String} deletedName 
   * @param {String} deletedType Card, Token or Piece
   */
  function deleteItem(deletedName, deletedType) {
    const setters = { Card: setDecks, Token: setTokens, Piece: setPieces };
    setters[deletedType](prevItems => {
      return prevItems.filter(({name}) => name !== deletedName);
    });
    setThumbnails(prevThumbnails => {
      return prevThumbnails.filter(({name}) => name !== deletedName);
    });
  }

  /**
   * Create game data from the buildGamePage and store it in the database.
   */
  function handleSave() {
    const items = [...decks, ...tokens, ...pieces];
    // Create game Item data
    const promises = items.map((obj) => {
      return axios
              .post(`${BASE_URL}/api/addDecks`, obj, {
                headers: { "Content-Type": "application/json" }
              }).then((res) => res.data);
    })
    // Create game Data
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
}
// React.memo prevent re-rendering of thumbnail images while adding new item.
export default React.memo(BottomToolbar);
