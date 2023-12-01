import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { SMARTButton } from "../button/button";
import { BASE_URL, CARD_HEIGHT, CARD_WIDTH, CANVAS_WIDTH } from '../../util/constants';

/**
 * Take user Input to pass data to the server for creating gameItem Data.
 * @component
 * @property {function} closePopup toggle visibility of parent modal.
 * @property {function} setThumbnails
 * @property {function} setDecks
 * @property {function} setTokens
 * @property {function} setPieces
 */
const ImageUploadForm = ({
  closePopup,
  setThumbnails,
  setDecks,
  setTokens,
  setPieces,
 }) => {
  // toggles for form UI, only itemType used for business logic.
  const [isSingleBack, setIsSingleBack] = useState(false);
  const [isLandScape, setIsLandScape] = useState(false);
  const [itemType, setItemType] = useState("Card");

  const numAcrossRef = useRef(null);
  const numDownRef = useRef(null);
  const numTotalRef = useRef(null);

  useEffect(() => {
    // Calculate the total number of item types and update "numTotal" when "numAcross" or "numDown" changes
    const updateTotal = () => {
      const numAcross = parseInt(numAcrossRef.current.value, 10) || 0;
      const numDown = parseInt(numDownRef.current.value, 10) || 0;
      numTotalRef.current.value = numAcross * numDown;
    };
  
    const numAcrossInput = numAcrossRef.current;
    const numDownInput = numDownRef.current;
  
    if (numAcrossInput && numDownInput) {
      numAcrossInput.addEventListener("input", updateTotal);
      numDownInput.addEventListener("input", updateTotal);
    }
  
    // Clean up the event listeners when the component unmounts
    return () => {
      if (numAcrossInput) {
        numAcrossInput.removeEventListener("input", updateTotal);
      }
      if (numDownInput) {
        numDownInput.removeEventListener("input", updateTotal);
      }
    };
  }, []);

  // check if itemtype button is active or not
  const checkItemType = (inputType) => inputType === itemType ? "active" : "";

  return (
    <div className="bg-form image-upload">
      <form onSubmit={handleSubmit}>
      <div className="row">
          <label>Item Type:</label>
          <div className="itemtype-wrapper">
            <div
              className={checkItemType("Card")}
              onClick={() => {
                setItemType("Card");
                // set the size to default value (CARD_HEIGHT)
                document.querySelector("input[name='size']").value = CARD_HEIGHT;
              }}
            >   
              Card
            </div>
            <div
              className={checkItemType("Token")}
              onClick={() => {
                setItemType("Token");
                // set the size to default value (CARD_HEIGHT)
                document.querySelector("input[name='size']").value = CARD_HEIGHT;
              }}
            >
              Token
            </div>
            <div
              className={checkItemType("Piece")}
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
            required={itemType !== 'Piece'}
          />
        </div>

        <div className="row">
          <label>{`Number of ${itemType}s Across:`}</label>
          <input 
            type="number" 
            name="numAcross" 
            defaultValue={1} 
            min={1} 
            ref={numAcrossRef}
          />
        </div>

        <div className="row">
          <label>{`Number of ${itemType}s Down:`}</label>
          <input
            type="number"
            name="numDown"
            defaultValue={1}
            min={1}
            ref={numDownRef}
          />
        </div>

        <div className="row total">
          <label>{`Total Number of ${itemType}s:`}</label>
          <input
            type="number"
            name="numTotal"
            defaultValue={1}
            min={1}
            ref={numTotalRef}
          />
        </div>

        <div className={`row ${itemType !== 'Piece' ? 'hide' : ''}`}>
          <label>{`length of longest side in px:`}</label>
          <input
            type="number"
            name="size"
            defaultValue={CARD_HEIGHT}
            max={CANVAS_WIDTH}
            min={CARD_WIDTH}
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
            <label>Rotate 90°? &#x27F3;</label>
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

  /**
   * Create FormData from form submission, edit and create game Data
   * @param {SubmitEvent} e 
   */
  async function handleSubmit (e) {
    e.preventDefault();
    const setters = { Card: setDecks, Token: setTokens, Piece: setPieces };

    // Add the screen blur while loading
    document.querySelector(".blur").style.display = "block";
    
    const formData = new FormData(e.currentTarget);
    formData.append("itemType", itemType);

    // format images if they exist and update formData
    const faceImage = await formatImage(formData.get('image'),
                        Math.max(formData.get('numAcross'), formData.get('numDown')),
                        formData.get("size"));
    formData.set('image', faceImage);
    if (formData.get('backFile').size > 0) {
      const backImage = await formatImage(formData.get('backFile'),
                          formData.get('isSameBack')
                            ? 1
                            : Math.max(formData.get('numAcross'), formData.get('numDown')),
                            formData.get("size"));
      formData.set('backFile', backImage);
    }
    // API POST to create game item data
    axios
      .post(`${BASE_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(({ data: { newItem } }) => {
        setThumbnails(prevThumbnails => {
          const newThumbnail = {faceImage: formData.get('image'), name: newItem.name, itemType};
          return [...prevThumbnails, newThumbnail]
        });
        setters[itemType](prevItems => [...prevItems, newItem]);
        closePopup();
        
      })
      .catch((err) => console.log(err));
  };

  /**
   * Resize the image uploaded from user if too big
   * 
   * @param {File} file 
   * @param {Number} itemLength 
   * @param {Number} maxSize 
   * @returns Promise of formatted image as blob
   */
  async function formatImage(file, itemLength, maxSize) {
    const bitmap = await createImageBitmap(file);
    let { width, height } = bitmap;
    const size = itemLength * maxSize;
    const ratio = Math.max(size/width, size/height);
    if (width < size || height < size) return file;
    width *= ratio;
    height *= ratio;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    
    ctx.drawImage(bitmap, 0, 0, width, height);

    return new Promise(res => {
      canvas.toBlob(blob => res(blob), 'image/webp')
    });
  }
};

export default ImageUploadForm;
