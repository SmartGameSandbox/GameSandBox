import React, { useEffect, useState } from "react";
import styles from "./games";
import axios from "axios";
import { ReactSession } from "react-client-session";
import { SMARTButton, SMARTIconButton } from "../button/button";
import Sidebar from "../sidebar/Sidebar";
import Header from "../header/header";
ReactSession.setStoreType("localStorage");

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
        const id = ReactSession.get("id");
        let games = null;
        const url =
          process.env.NODE_ENV === "production"
            ? "https://smartgamesandbox.herokuapp.com"
            : "http://localhost:8000";
        axios
          .get(`${url}/api/games`, {
            params: {
              creatorId: id,
            },
          })
          .then((response) => {
            if (response.status === 200) {
              games = response.data.games;
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
            }
          })
          .catch((error) => {
            console.log(error.response.data.message);
          });
      }
    }, 10);
  });

  const createroom = async (gameId) => {
    let cardDeckIdArray;
    let roomname;
    const url =
      process.env.NODE_ENV === "production"
        ? "https://smartgamesandbox.herokuapp.com"
        : "http://localhost:8000";

    await axios
      .get(`${url}/api/games`, {
        params: {
          gameId: gameId,
        },
      })
      .then((response) => {
        cardDeckIdArray = response.data.games.cardDeck;
        roomname = response.data.games.name;
      })
      .catch((error) => {
        console.log(error);
      });

    console.log("Game data retreived, starting up game");

    await axios
      .post(`${url}/api/room`, {
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
          <Sidebar />
        </div>
      </div>
    );
  }
  return (
    <div style={styles.body}>
      <Header />
      <div>
        <Sidebar />
        <div style={styles.btnGroup}>{gamesButtons}</div>
      </div>
    </div>
  );
};

export default Games;
