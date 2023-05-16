import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../util/constants'
import styles from './roomStyle';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {SMARTButton} from '../button/button';

const CreateRoom = () => {

  const [item, setItem] = useState('');
  const [roomNameInputText, setRoomNameInputText] = useState('Card Game Sandbox');
  const [errorMsg, setErrorMsg] = useState('');
  
  const handleRoomNameTextInputChange = event => {
    setRoomNameInputText(event.target.value);
  };

  const onImageChange = e => {
    const imagefile = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result
                                .replace('data:', '')
                                .replace(/^.+,/, '');
      setItem(base64String);
    }
    reader.readAsDataURL(imagefile);
  }

  const createRoom = () => {
    axios.post(`${BASE_URL}/api/room`, {
      name: roomNameInputText,
      image: item || null,
    }).then((response) => {
      window.location.href = `/room?id=${response.data.id}`;
    }).catch((error) => {
      setErrorMsg(error.response.statusText);
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
        <h1>Create Room</h1>
        <div>
          <TextField
            id="room-name-input"
            sx={styles.textFieldStyle}
            value={roomNameInputText}
            onChange={handleRoomNameTextInputChange}
            className="text-field"
            required
            label="Room Name"
            size="large"
          />
          <br />
          <input
            type="file"
            multiple
            name="image"
            id="image"
            accept="image/*"
            onChange={onImageChange}
          />
        </div>
        <p style={styles.createRoomErrorStyle}>{errorMsg}</p>
        <SMARTButton theme='secondary' size='large' variant="contained" sx={styles.createRoomButtonStyle} onClick={() => { createRoom(); }}>Create Room</SMARTButton>
      </Box>
    </>
  );
}
export default CreateRoom;
