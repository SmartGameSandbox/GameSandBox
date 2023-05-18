import { useState, useEffect, useRef } from "react";
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

  const [thumbnails, setThumbnails] = useState([]);
  const [decks, setDecks] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [pieces, setPieces] = useState([]);

  const nodeRef = useRef(null);

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
              {thumbnails.map(({ imgSrc, name, itemType }, key) => (
                <div
                  key={key}
                  className={`image-preview ${itemType}`}
                  style={{backgroundImage: `url('${URL.createObjectURL(imgSrc)}')`}}
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

  function deleteItem(deletedName, deletedType) {
    const setters = { Card: setDecks, Token: setTokens, Piece: setPieces };
    setters[deletedType](prevItems => {
      return prevItems.filter(({name}) => name !== deletedName);
    });
    setThumbnails(prevThumbnails => {
      return prevThumbnails.filter(({name}) => name !== deletedName);
    });
  }

  function handleSave() {
    const items = [...decks, ...tokens, ...pieces];
    console.log(items)
    const promises = items.map((obj) => {
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
          imageObject.imageSource.front.contentType
        };base64,${Buffer.from(imageObject.imageSource.front.data).toString("base64")}`;
        img.className = imageObject.isLandscape ? 'landscape' : '';
        return img;
      });
    });
  }
}
export default BottomToolbar;
