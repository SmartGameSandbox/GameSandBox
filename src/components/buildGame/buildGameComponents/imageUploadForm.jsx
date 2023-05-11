import "./imageUploadForm.css";
import React, { useState } from "react";
import axios from "axios";
import { SMARTButton } from "../../button/button";
import { BASE_URL } from '../../../util/constants'

const ImageUploadForm = ({ closePopup, images, onImageChange, setDecks, decks }) => {

  const [inputs, setInputs] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);

  const [itemType, setItemType] = useState("Card");

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", images[0]);
    formData.append("image", images[1]);
    formData.append("cardsAcross", inputs.numAcross);
    formData.append("cardsDown", inputs.numDown);
    formData.append("totalCards", inputs.numTotal);
    formData.append("hasSameBack", isChecked);
    formData.append("isLandscape", isChecked2);

    axios
      .post(`${BASE_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(async (res) => {
        const deckUploaded = await res.data.newDeck;
        await setDecks([...decks, deckUploaded]);
        closePopup();
      })
      .catch((err) => console.log(err));
  };

  const checkItemType = (inputType) => {
    if (inputType === itemType) return "active";
    return "bg-itemtype-button";
  } 

  return (
    <div className="bg-form">
      <form onSubmit={handleSubmit}>
      <div className="row">
          <label>Item Type:</label>
          <div style={{width: "50%", display: "flex", justifyContent: "space-between"}}>
            <div
              className={`bg-itemtype-button ${checkItemType("Card")}`}
              onClick={() => {setItemType("Card")}}
            >   
              Card
            </div>
            <div
              className={`bg-itemtype-button ${checkItemType("Token")}`}
              onClick={() => {setItemType("Token")}}
            >
              Token
            </div>
            <div
              className={`bg-itemtype-button ${checkItemType("Piece")}`}
              onClick={() => {setItemType("Piece")}}
            >
              Piece
            </div>
          </div>
        </div>

        <div className="row">
          <label>Upload Image Grid:</label>
          <input
            type="file"
            multiple
            name="image"
            id="image"
            accept="image/*"
            onChange={onImageChange}
            required
          />
        </div>

        <div className="row">
          <label>Upload Image Grid (back page):</label>
          <input
            type="file"
            multiple
            accept="image/*"
            name="backFile"
            onChange={onImageChange}
          />
        </div>

        <div className="row">
          <label>Number of Cards Across:</label>
          <input
            type="number"
            name="numAcross"
            value={inputs.numAcross || ""}
            onChange={handleChange}
          />
        </div>

        <div className="row">
          <label>Number of Cards Down:</label>
          <input
            type="number"
            name="numDown"
            value={inputs.numDown || ""}
            onChange={handleChange}
          />
        </div>

        <div className="row">
          <label>Number of Cards In Deck:</label>
          <input
            type="number"
            name="numTotal"
            value={inputs.numTotal || ""}
            onChange={handleChange}
          />
        </div>

        <div className="checkbox-wrapper">
          <div>
            <input
              type="checkbox"
              className={isChecked ? "checked" : ""}
              checked={isChecked}
              onChange={() => setIsChecked((prev) => !prev)}
            />
            <span>Same back for all cards? </span>
          </div>
          <div>
            <input
              type="checkbox"
              className={isChecked2 ? "checked" : ""}
              checked={isChecked2}
              onChange={() => setIsChecked2((prev) => !prev)}
            />
            <span>Landscape </span>
          </div>
        </div>

        <div className="row last">
          <SMARTButton
            type="submit"
            className="bg-createGameBtn"
            theme="secondary"
            size="large"
            variant="contained"
          >
            Create Item
          </SMARTButton>
        </div>
      </form>
    </div>
  );
};

export default ImageUploadForm;
