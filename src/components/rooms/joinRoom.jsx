import React from 'react';
import axios from 'axios';
import styles from './roomStyle';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {SMARTButton} from '../button/button';

const JoinRoom = () => {
    const [roomIDInputText, setRoomIDInputText] = React.useState('');
    const handleRoomIDTextInputChange = event => {
        setRoomIDInputText(event.target.value);
    };
  
    const [passwordInputText, setPasswordInputText] = React.useState('');
    const handlePasswordTextInputChange = event => {
      setPasswordInputText(event.target.value);
    };

    const joinRoom = () => {
        const url = process.env.NODE_ENV === 'production' ? "https://smartgamesandbox.herokuapp.com" : "http://localhost:8000";

        axios.get(`${url}/api/room?id=${roomIDInputText}`).then((response) => {
            console.log(response);
            if (response.status === 200) {
                window.location.href = `/room?id=${roomIDInputText}`;
            } else {
                alert("Room not found");
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <>
            <Box
                sx={styles.roomBoxStyle}
                id="create-room-container"
                component="form"
                autoComplete="off"
            >
                <h1>Join Room</h1>
                <div>
                    <TextField
                        id="room-name-input"
                        sx={styles.textFieldStyle}
                        value={roomIDInputText}
                        onChange={handleRoomIDTextInputChange}
                        className="text-field"
                        required
                        label="Room Code"
                        size="large"
                    />
                    <br />
                    <TextField
                        id="password-input"
                        sx={styles.textFieldStyle}
                        value={passwordInputText}
                        onChange={handlePasswordTextInputChange}
                        className="text-field"
                        required
                        label="Password"
                        type={"password"}
                        size="large"
                    />
                </div>
                <SMARTButton theme='secondary' size='large' variant="contained" sx={{bgcolor: 'lightseagreen'}} onClick={() => { joinRoom(); }}>Join Room</SMARTButton>
            </Box>
        </>
    );
}


export default JoinRoom