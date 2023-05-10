import React, { useRef } from "react";
import "./buildGameForm.css";
import { SMARTButton } from "../../button/button";
import { useNavigate } from "react-router-dom";

const BuildGameForm = ({ closePopup }) => {
  const gameNameRef = useRef('');
  const numPlayerRef = useRef(2);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = { name: gameNameRef.current.value, players: numPlayerRef.current.value };
    await event.target.reset(); // reset the form
    await closePopup();

    navigate("/buildgame", {
      state: data,
    });
  };

  return (
    <div className="bg-form">
      <form onSubmit={handleSubmit} id="build-game-from">
        <label>GAME NAME:</label>
        <input
          type="text"
          name="name"
          placeholder="e.g. card game"
          ref={gameNameRef}
          required
        />
        <label>NUMBER OF PLAYERS:</label>
        <input
          type="number"
          name="numPlayers"
          min={1}
          max={10}
          defaultValue={2}
          ref={numPlayerRef}
        />

        <div className="btnContainer">
          <SMARTButton
            type="submit"
            className="bg-createGameBtn"
            theme="secondary"
            size="large"
            variant="contained"
          >
            Create Game
          </SMARTButton>
        </div>
      </form>
    </div>
  );
};

export default BuildGameForm;
