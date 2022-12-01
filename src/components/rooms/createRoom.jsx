import React from 'react';
import axios from 'axios';
import styles from './roomStyle';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FileBase64 from 'react-file-base64';
const CreateRoom = () => {
  const [item, setItem] = React.useState({ imageUrl: '' });
  const [roomNameInputText, setRoomNameInputText] = React.useState('Card Game Sandbox');
  const [errorMsg, setErrorMsg] = React.useState('');
  const handleRoomNameTextInputChange = event => {
    setRoomNameInputText(event.target.value);
  };

  const [passwordInputText, setPasswordInputText] = React.useState('');
  const handlePasswordTextInputChange = event => {
    setPasswordInputText(event.target.value);
  };

  const createRoom = () => {
    const url = process.env.NODE_ENV === 'production' ? "https://smartgamesandbox.herokuapp.com" : "http://localhost:5000";
    axios.post(`${url}/api/room`, {
      name: roomNameInputText,
      password: passwordInputText,
      image: item.imageUrl === '' ? null : item.imageUrl
    }).then((response) => {
      window.location.href = `/room?id=${response.data.id}&password=${response.data.password}`;
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
          <FileBase64
            type="file"
            multiple={false}
            onDone={({ base64 }) => setItem({ ...item, imageUrl: base64 })}
          />
        </div>
        <p style={styles.createRoomErrorStyle}>{errorMsg}</p>
        <Button variant="contained" sx={styles.createRoomButtonStyle} onClick={() => { createRoom(); }}>Create Room</Button>
      </Box>
    </>
  );
}
export default CreateRoom;
