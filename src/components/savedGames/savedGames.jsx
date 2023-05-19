/*
  File: savedGames.jsx

  Description: Contains the SavedGames component. Retrieves a list of saved games for the user and
  renders a list of the user's saved games.
*/

import React, { useEffect, useState } from "react";
import axios from "axios";
import { SMARTButton } from "../button/button";
import Modal from "../modal/modal";
import "./savedGames.css";
import { BASE_URL } from '../../util/constants'
import Themes from "./savedGamesTheme";
import Header from "../header/header";
import BuildGameForm from "../buildGame/buildGameForm";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";


const SavedGames = () => {
  const [showBuildGameModal, setBuildGameModal] = useState(false);
  const [isLoading, setLoading] = useState(true); // Loading state
  const [gamesThings, setGames] = useState(); // State variable for the list of saved games
  let list = []; 
  let no_games = false;
  let games_list = null;
  let counter = false;

  useEffect(() => {
    setTimeout(() => {
      // simulate a delay

      if (!counter) { 
        counter = true; 
        let games = null;

        // Get the list of saved games for the user from database
        axios
          .get(`${BASE_URL}/api/games`, {
            params: {
              creatorId: localStorage.getItem('id'),
            },
          })
          .then((response) => {

            if (response.status === 200) {
              games = response.data.savedGames; // set games to the list of saved games
              
              // For every saved game, add the name to the list
              for (let i = 0; i < games.length; i++) {
                list.push(games[i].name);
              }
              if (list.length === 0) {
                no_games = true;
              }

              // Create a list of SMARTButtons for each saved game
              games_list = list.map((games, index) => (
                <SMARTButton key={index} sx={Themes.item}>
                  {games}
                </SMARTButton>
              ));
              setGames(games_list); // set the list of SMARTButtons to the state variable
              setLoading(false);
            }
          })
          .catch((error) => {
            console.log("Error" + error);
          });
      }
    }, 1000);
  });

  if (isLoading) {
    return (
      <div style={Themes.body}>
        <Header />
        <div>
        <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div id="my-page-body">
      <Header />
      <div id="right" style={Themes.logo}></div>
      <div id="my-games-title">My Games</div>
      <div id="my-games-list">
        {gamesThings}
        {no_games && (
          <SMARTButton
            id="my-games-more-games"
            varia
            nt="contained"
            sx={Themes.item}
          >
            No Games Found
          </SMARTButton>
        )}
      </div>
      <div id="my-games-create-new-game-box">
        <SMARTButton
          id="my-games-more-games"
          variant="contained"
          sx={Themes.create}
          onClick={() => setBuildGameModal(true)}
        >
          Create New Game
        </SMARTButton>
      </div>
      {/* Modals */} 
      <Modal
      // Build Game Modal redirects to the build game page
        title="Build Game" 
        onClose={() => setBuildGameModal(false)}
        show={showBuildGameModal}
        style={{
          height: "500px",
          width: "700px",
        }}
      >
        <BuildGameForm closePopup={() => setBuildGameModal(false)} />
      </Modal>
    </div>
  );
};

export default SavedGames;
