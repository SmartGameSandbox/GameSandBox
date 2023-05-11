import "./imageUploadForm.css";
import React, { useState, useRef } from "react";
import axios from "axios";
import { SMARTButton } from "../../button/button";
import { BASE_URL } from '../../../util/constants'

const ImageUploadForm = ({
  closePopup,
  images,
  onImageChange,
  setDecks,
  setTokens,
  setPieces,
 }) => {

  const numAcross = useRef();
  const numDown = useRef();
  const numTotal = useRef();
  const [isSingleBack, setIsSingleBack] = useState(false);
  const [isLandScape, setIsLandScape] = useState(false);
  const [itemType, setItemType] = useState("Card");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const setters = { Card: setDecks, Token: setTokens, Piece: setPieces };

    const formData = new FormData();
    formData.append("image", images[0]);
    formData.append("image", images[1]);
    formData.append("cardsAcross", numAcross.current.valueAsNumber);
    formData.append("cardsDown", numDown.current.valueAsNumber);
    formData.append("totalCards", numTotal.current.valueAsNumber);
    formData.append("hasSameBack", isSingleBack);
    formData.append("isLandscape", isLandScape);
    formData.append("itemType", itemType);

    axios
      .post(`${BASE_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        const newItems = res.data.newDeck;
        setters[itemType](prevItems => [...prevItems, newItems]);
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
          <label>{`Number of ${itemType}s Across:`}</label>
          <input
            type="number"
            name="numAcross"
            ref={numAcross}
            defaultValue={1}
            min={1}
          />
        </div>

        <div className="row">
          <label>{`Number of ${itemType}s Down:`}</label>
          <input
            type="number"
            name="numDown"
            ref={numDown}
            defaultValue={1}
            min={1}
          />
        </div>

        <div className="row">
          <label>{`Total Number of ${itemType}s:`}</label>
          <input
            type="number"
            name="numTotal"
            ref={numTotal}
            defaultValue={1}
            min={1}
          />
        </div>

        <div className={`checkbox-wrapper ${itemType === 'Piece' && 'hide'}`}>
          <div>
            <label>{`Same back for all ${itemType}s?`}</label>
            <input
              type="checkbox"
              className={isSingleBack ? "checked" : ""}
              checked={isSingleBack}
              onChange={() => setIsSingleBack(!isSingleBack)}
            />
          </div>
          <div className={itemType !== 'Card' ? 'hide' : ""}>
            <label>Landscape</label>
            <input
              type="checkbox"
              className={isLandScape ? "checked" : ""}
              checked={isLandScape}
              onChange={() => setIsLandScape(!isLandScape)}
            />
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
