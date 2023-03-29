import React from "react";
import { useState } from "react";
import "./buildGameForm.css";
import { SMARTButton } from "../../button/button";
import { useNavigate } from "react-router-dom";

const BuildGameForm = ({ closePopup }) => {
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;

    await form.reset(); // reset the form
    await closePopup();
    let data = { name: form.name.value, players: form.numPlayers.value };

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
          value={inputs.name || ""}
          required
          onChange={handleChange}
        />
        <label>NUMBER OF PLAYERS:</label>
        <input
          type="number"
          name="numPlayers"
          min={1}
          max={10}
          value={inputs.numPlayers || ""}
          onChange={handleChange}
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
