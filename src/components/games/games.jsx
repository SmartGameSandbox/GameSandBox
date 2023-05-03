import React, { useEffect, useState } from "react";
import axios from "axios";
import { SMARTButton } from "../button/button";
import { BASE_URL } from '../../util/constants'
import styles from "./games";
import Header from "../header/header";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";

const Games = () => {
  const [isLoading, setLoading] = useState(true); // Loading state
  const [gamesButtons, setGamesButtons] = useState(); // pokemon state
  let gameList = [];
  let gameDisplayList = null;

  let counter = false;
  useEffect(() => {
    setTimeout(() => {
      // simulate a delay

      if (!counter) {
        counter = true;
        const id = localStorage.getItem("id");
        let games = null;

        axios
          .get(`${BASE_URL}/api/games`, {
            params: {
              creatorId: id,
            },
          })
          .then((res) => {
            games = res.data.savedGames;
            for (let i = 0; i < games.length; i++) {
              gameList.push({ name: games[i].name, id: games[i]._id });
            }
            gameDisplayList = gameList.map((gameObj, index) => (
              <SMARTButton
                key={index}
                sx={styles.gameButtons}
                onClick={() => createroom(gameObj.id)}
              >
                {gameObj.name}
              </SMARTButton>
            ));
            setGamesButtons(gameDisplayList);
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }, 3000);
  });

  const createroom = async (gameId) => {
    let cardDeckIdArray;
    let roomname;
    await axios
      .get(`${BASE_URL}/api/games`, {
        params: {
          gameId: gameId,
        },
      })
      .then((response) => {
        cardDeckIdArray = response.data.savedGames.cardDeck;
        roomname = response.data.savedGames.name;
      })
      .catch((error) => {
        console.log(error);
      });

    await axios
      .post(`${BASE_URL}/api/room`, {
        name: roomname,
        image: null,
        cardDeck: cardDeckIdArray,
      })
      .then((response) => {
        window.location.href = `/room?id=${response.data.id}`;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (isLoading) {
    return (
      <div style={styles.body}>
        <Header />
        <div>
          <LoadingSpinner />
        </div>
      </div>
    );
  }
  return (
    <div style={styles.body}>
      <Header />
      <div>
        <div style={styles.btnGroup}>{gamesButtons}</div>
      </div>
    </div>
  );
};

export default Games;
