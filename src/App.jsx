import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoomCreation from './components/rooms/createRoom';
import Room from './components/rooms/room';
import JoinRoom from './components/rooms/joinRoom';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import CycloneIcon from '@mui/icons-material/Cyclone';
import FaceIcon from '@mui/icons-material/Face';

const App = () => {
  const navigateCreateRoom = () => {
    window.location.href = "/createroom";
  }

  const navigateJoinRoom = () => {
    window.location.href = "/joinroom";
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{bgcolor: "lightseagreen"}}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Smart Game SandBox
            </Typography>
            <Button color="inherit" onClick={() => navigateCreateRoom()}><AddIcon />&nbsp;Create Room</Button>
            <Button color="inherit" onClick={() => navigateJoinRoom()}><CycloneIcon />&nbsp;Join Room</Button>
            <Button color="inherit" onClick={() => navigateCreateRoom()}><FaceIcon/>&nbsp;Login</Button>
          </Toolbar>
        </AppBar>
      </Box>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<RoomCreation />} />
          <Route path='/createroom' element={<RoomCreation />} />
          <Route path='/joinroom' element={<JoinRoom />} />
          <Route path='/room' element={<Room />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;