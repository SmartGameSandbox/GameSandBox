import React, { useEffect, useState } from "react";
import {SMARTButton} from '../button/button';
import logo from "../icons/Group_89.png";
import "./myGames.css";
import Themes from "./myGamesTheme"
import axios from "axios";
import { ReactSession } from "react-client-session";
import Sidebar from "../sidebar/Sidebar";
import Header from "../header/header";
ReactSession.setStoreType("localStorage");

const MyGames = () => {
    const [isLoading, setLoading] = useState(true); // Loading state
    const [gamesThings, setGames] = useState();
    let list = []
    let no_games = false
    let games_list = null
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
                if(list.length === 0){
                    no_games = true
                }
                games_list = list.map((games) =>
                <SMARTButton
                sx = {Themes.item}
                >
                    {games}
                </SMARTButton>
          );
                setGames(games_list)
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
          <div style={Themes.body}>
          <Header />
          <div>
              <Sidebar />
          </div>
      </div>
      );
      }

    return(
        <div id = "my-page-body"> 
            <Header />
            <Sidebar />
            <div id="right" style={Themes.logo}>
                
            </div> 
            <div id="my-games-title">
                    My Games
            </div>   
            <div id = "my-games-list">
                
                    {gamesThings}
                    {no_games && (
                <SMARTButton
                    id = "my-games-more-games"
                    varia
                    nt="contained"
                    sx={Themes.item}
                >
                    No Games Found
                </SMARTButton>
    )}
            </div>
            <div id = "my-games-create-new-game-box">
                <SMARTButton
                    id = "my-games-more-games"
                    variant="contained"
                    sx={Themes.create}
                >
                    Create New Game
                </SMARTButton></div>

        </div>
    )
}

export default MyGames;