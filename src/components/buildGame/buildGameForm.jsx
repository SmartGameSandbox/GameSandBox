import React from "react";
import { useState } from "react";
import "./buildGameForm.css";
import { SMARTButton } from "../button/button";

const BuildGameForm = ({closePopup}) => {
  const [inputs, setInputs] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };



  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    for (const [name, value] of formData.entries()) {
      console.log(`${name}: ${value}`);
    }
    form.reset(); // reset the form

    closePopup()
  };

  return (
    <div className="bg-form">
      <form onSubmit={handleSubmit} id="build-game-from">
        <label>GAME NAME:</label>
        <input
          type="text"
          name="gamename"
          value={inputs.gamename || ""}
          onChange={handleChange}
        />
        <label>NUMBER OF PLAYERS:</label>
        <input
          type="number"
          name="numPlayers"
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
