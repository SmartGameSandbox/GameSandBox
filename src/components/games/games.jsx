/*
  File: games.jsx

  Description: Contains the Games component. It fetches a list of games for the user
  and allows the user to create a room for each game and redirects them to the room page.
*/

import { useEffect, useState } from "react";
import axios from "axios";
import { SMARTButton } from "../button/button";
import { BASE_URL } from '../../util/constants'
import styles from "./games";
import Header from "../header/header";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";

const Games = () => {
  const [isLoading, setLoading] = useState(true);
  const [games, setGames] = useState([]);

  useEffect(() => {
    // Get the list of saved games for the user from database
    axios
      .get(`${BASE_URL}/api/games`, {
        params: {
          creatorId: localStorage.getItem("id"),
        },
      })
      .then((res) => {
        setGames(res.data.savedGames);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isLoading, games]);

  // Create a room for the game
  const createroom = async (gameId) => {
    const game = games.find(({ _id }) => _id === gameId);
    if (!game) return;
    const { cardDeck, name } = game;

    // Make a request to the server to create a room for the game
    await axios
      .post(`${BASE_URL}/api/room`, { name, cardDeck })
      .then((response) => {
        window.location.href = `/room?id=${response.data.id}`; // Redirect to the room page
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div style={styles.body}>
      <Header />
      <div>
        {isLoading
          ? <LoadingSpinner />
          : <div style={styles.btnGroup}>
              {games.map((gameObj) => ( // Create a SMARTButton for each game
                <SMARTButton
                  key={gameObj._id}
                  sx={styles.gameButtons}
                  onClick={() => createroom(gameObj._id)}
                >
                  {gameObj.name}
                </SMARTButton>
              ))}
            </div>
        }
      </div>
    </div>
  );
};

export default Games;
