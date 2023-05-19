import { useRef } from "react";
import { SMARTButton } from "../button/button";
import { useNavigate } from "react-router-dom";

/**
 * Take user Input to initialize the name and number of players of the game.
 * @component
 * @property {function} closePopup toggle visibility of parent modal.
 */
const BuildGameForm = ({ closePopup }) => {
  const gameNameRef = useRef('');
  const numPlayerRef = useRef(2);
  const navigate = useNavigate();

  return (
    <div className="bg-form">
      <form onSubmit={handleSubmit} id="build-game-form">
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

  /**
   * Take the user Input and pass the data to the BuildGamePage as location.state
   * 
   * @param {SubmitEvent} event 
   */
  async function handleSubmit(event) {
    event.preventDefault();
    const data = { name: gameNameRef.current.value, players: numPlayerRef.current.value };
    await event.target.reset(); // reset the form
    await closePopup();

    navigate("/buildgame", {
      state: data,
    });
  };
};

export default BuildGameForm;
