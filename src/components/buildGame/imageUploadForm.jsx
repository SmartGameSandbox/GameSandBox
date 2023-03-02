import "./imageUploadForm.css";

import React from "react";
import { useState } from "react";
import { SMARTButton } from "../button/button";

const ImageUploadForm = ({ closePopup }) => {
  const [inputs, setInputs] = useState({});
  const [isChecked, setIsChecked] = useState(false);

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

    closePopup();
  };

  return (
    <div className="bg-form">
      <form onSubmit={handleSubmit}>
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
          <label>Numer of Cards In Deck:</label>
          <input
            type="number"
            name="numTotal"
            value={inputs.numTotal || ""}
            onChange={handleChange}
          />
        </div>

        <div className="checkbox-wrapper">
          <label> 
          <input
            type="checkbox"
            className={isChecked ? "checked" : ""}
            checked={isChecked}
            onChange={() => setIsChecked((prev) => !prev)}
          />
          <span>Same back for all cards? </span>
        </label>
          
    
        </div>

        <div className="row">
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

export default ImageUploadForm;
