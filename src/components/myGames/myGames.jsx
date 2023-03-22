import React from 'react';
import {SMARTButton} from '../button/button';
import logo from "../icons/Group_89.png";
import "./myGames.css";
import Themes from "./myGamesTheme"

const games_list = ["Settlers of Catan","Risk","Small World","Mice and Mystics","Ascension","Unstable Unicorns","Cards Against Humanity"];
const MyGames = () => {

    const listItems = games_list.map((games) =>
        <SMARTButton
        sx = {Themes.item}
        >
            {games}
        </SMARTButton>
  );

    return(
        <div id = "my-page-body"> 
            <div id="right" style={Themes.logo}>
                <img src={logo} style={{width: "200px"}}/>
            </div> 
            <div id="my-games-title">
                    My Games
            </div>   
            <div id = "my-games-list">
                
                    {listItems}
                <SMARTButton
                    id = "my-games-more-games"
                    variant="contained"
                    sx={Themes.item}
                >
                    ... More Games
                </SMARTButton>
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