import React from 'react';
import {SMARTButton} from '../button/button';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blue, yellow, red } from '@mui/material/colors';
import logo from "../icons/Group_89.png";
import "./myGames.css";

const theme = createTheme({
    palette: {
      primary: blue,
      secondary: yellow
    }
  });

const games_list = ["Game 1","Game 2","Game 3"];
const MyGames = () => {

    const listItems = games_list.map((games) =>
        <SMARTButton
        className = "mygameslistitem"
        >
            {games}
        </SMARTButton>
  );

    return(
        <div id = "my-page-body"> 
            <div id = "logo">
                <img src={logo}/>
            </div>       
            <div id = "my-games-list">
                <ThemeProvider theme={theme}>
                    {listItems}
                </ThemeProvider>
                <SMARTButton
                    id = "my-games-more-games"
                    variant="contained"
                >
                    ... More Games
                </SMARTButton>
            </div>
        </div>
    )
}

export default MyGames;