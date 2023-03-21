import React, { useEffect, useState } from "react";
import styles from "./games";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import { ReactSession } from "react-client-session";
import {SMARTButton, SMARTIconButton} from '../button/button';
import CasinoIcon from '@mui/icons-material/Casino';
import logo from "../icons/Group_89.png";
import Sidebar from "../sidebar/Sidebar";
import Modal from "../modal/modal";
import BuildGameForm from "../buildGame/buildGameForm";
import Header from "../header/header";
ReactSession.setStoreType("localStorage");

const Games = () => {
  const [isLoading, setLoading] = useState(true); // Loading state
  const [gamesThings, setGames] = useState(); // pokemon state
  let list = []
  let gamesList = null
  let test = "<p>This works</p>"
  let counter = false
  useEffect(() => {
    setTimeout(() => { // simulate a delay

    if (!counter){
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
            id: id
          }
        })
        .then((response) => {
          if (response.status === 200) {
            games = response.data.games;
            for (let i = 0; i < games.length; i++) {
              list.push(games[i].name)
            }
            gamesList = list.map((games) =>
            <SMARTButton
            sx = {styles.gameButtons}
            >
                {games}
            </SMARTButton>
      );
            setGames(gamesList)
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(error.response.data.message);
        });
    }
    }, 10)})
  
  if (isLoading){
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
        <div style={styles.btnGroup}>
          {gamesThings}
        </div>

    </div>
</div>
);

};



export default Games;
