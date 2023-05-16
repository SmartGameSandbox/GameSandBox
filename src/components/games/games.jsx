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

  const createroom = async (gameId) => {
    const game = games.find(({ _id }) => _id === gameId);
    if (!game) return;
    const { cardDeck, name } = game;

    await axios
      .post(`${BASE_URL}/api/room`, { name, cardDeck })
      .then((response) => {
        window.location.href = `/room?id=${response.data.id}`;
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
              {games.map((gameObj) => (
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
