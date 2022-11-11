import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import RoomCreation from "./components/rooms/createRoom";
import Room from "./components/rooms/room";
import JoinRoom from "./components/rooms/joinRoom";
import LoginComponent from "./components/loginComponent/loginComponent";
import CreateNewAccountComponent from "./components/createAccountComponent/createAccountComponent";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import CycloneIcon from "@mui/icons-material/Cyclone";
import FaceIcon from "@mui/icons-material/Face";
import { ReactSession } from 'react-client-session'
ReactSession.setStoreType("localStorage")

const App = () => {
  const navigateCreateRoom = () => {
    window.location.href = "/createroom";
  };

  const navigateJoinRoom = () => {
    window.location.href = "/joinroom";
  };

  const navigateLogin = () => {
    window.location.href = "/login";
  };

  const isAuthed = () => {
    if(ReactSession.get("username")){
      console.log(ReactSession.get("username"))
      return true
    } else {
      console.log(ReactSession.get("username"))
      return false 
    }
  }

  const protectedRoute = () => {
    return (isAuthed()) ? <Route path="/createroom" element={<RoomCreation />} /> : <Navigate to="/login"/>;
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ bgcolor: "lightseagreen" }}>
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
            <Button color="inherit" onClick={() => navigateCreateRoom()}>
              <AddIcon />
              &nbsp;Create Room
            </Button>
            <Button color="inherit" onClick={() => navigateJoinRoom()}>
              <CycloneIcon />
              &nbsp;Join Room
            </Button>
            <Button color="inherit" onClick={() => navigateLogin()}>
              <FaceIcon />
              &nbsp;Login
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginComponent />} />
          <Route path="/createroom" element={isAuthed() ?<RoomCreation />: <Navigate to='/login'/>} />
          <Route path="/joinroom" element={<JoinRoom />} />
          <Route path="/room" element={<Room />} />
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/newaccount" element={<CreateNewAccountComponent />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
