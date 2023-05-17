import "./imageUploadForm.css";
import { useState } from "react";
import axios from "axios";
import { SMARTButton } from "../../button/button";
import { BASE_URL, CARD_HEIGHT } from '../../../util/constants';

const ImageUploadForm = ({
  closePopup,
  setThumbnails,
  setDecks,
  setTokens,
  setPieces,
 }) => {
  const [isSingleBack, setIsSingleBack] = useState(false);
  const [isLandScape, setIsLandScape] = useState(false);
  const [itemType, setItemType] = useState("Card");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const setters = { Card: setDecks, Token: setTokens, Piece: setPieces };
    
    const formData = new FormData(e.currentTarget);
    formData.append("itemType", itemType);
    const faceImage = await formatImage(formData.get('image'),
                        Math.max(formData.get('numAcross'), formData.get('numDown')));
    formData.set('image', faceImage);

    if (formData.get('backFile').size > 0) {
      const backImage = await formatImage(formData.get('backFile'),
                          formData.get('isSameBack')
                            ? 1
                            : Math.max(formData.get('numAcross'), formData.get('numDown')));
      formData.set('backFile', backImage);
    }
    axios
      .post(`${BASE_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(({ data: { newItem } }) => {
        setThumbnails(prevThumbnails => [...prevThumbnails, {faceImage, name: newItem.name, itemType}]);
        setters[itemType](prevItems => [...prevItems, newItem]);
        closePopup();
      })
      .catch((err) => console.log(err));
  };

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
          <label>Upload Face Grid:</label>
          <input
            type="file"
            multiple
            name="image"
            accept="image/*"
            required
          />
        </div>

        <div className={`row ${itemType === 'Piece' ? 'hide' : ''}`}>
          <label>Upload Back Grid/Image:</label>
          <input
            type="file"
            multiple
            accept="image/*"
            name="backFile"
          />
        </div>

        <div className="row">
          <label>{`Number of ${itemType}s Across:`}</label>
          <input
            type="number"
            name="numAcross"
            defaultValue={1}
            min={1}
          />
        </div>

        <div className="row">
          <label>{`Number of ${itemType}s Down:`}</label>
          <input
            type="number"
            name="numDown"
            defaultValue={1}
            min={1}
          />
        </div>

        <div className="row">
          <label>{`Total Number of ${itemType}s:`}</label>
          <input
            type="number"
            name="numTotal"
            defaultValue={1}
            min={1}
          />
        </div>

        <div className={`checkbox-wrapper ${itemType === 'Piece' ? 'hide' : ''}`}>
          <div>
            <label>{`Same back for all ${itemType}s?`}</label>
            <input
              type="checkbox"
              name="isSameBack"
              className={isSingleBack ? "checked" : ""}
              checked={isSingleBack}
              onChange={() => setIsSingleBack(!isSingleBack)}
            />
          </div>
          <div className={itemType !== 'Card' ? 'hide' : ""}>
            <label>Landscape</label>
            <input
              type="checkbox"
              name="isLandscape"
              className={isLandScape ? "checked" : ""}
              checked={isLandScape}
              onChange={() => setIsLandScape(!isLandScape)}
            />
          </div>
        </div>

        <div className="row last">
          <SMARTButton
            type="submit"
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

  async function formatImage(file, itemLength) {
    const bitmap = await createImageBitmap(file);
    const { width, height } = bitmap;
    const size = itemLength * CARD_HEIGHT;
    const ratio = Math.max(size/width, size/height);
    if (width < size || height < size) return file;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    ctx.drawImage(bitmap, 0, 0, width * ratio, height * ratio);

    return new Promise(res => {
      canvas.toBlob(blob => res(blob), 'image/webp')
    });
  }

  function checkItemType(inputType) {
    if (inputType === itemType) return "active";
    return "bg-itemtype-button";
  } 
};

export default ImageUploadForm;
