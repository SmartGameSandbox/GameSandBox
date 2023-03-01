import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RoomCreation from "./components/rooms/createRoom";
import Room from "./components/rooms/room";
import JoinRoom from "./components/rooms/joinRoom";
import Login from "./components/login/login";
import Register from "./components/register/register";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import CycloneIcon from "@mui/icons-material/Cyclone";
import FaceIcon from "@mui/icons-material/Face";
import { ReactSession } from "react-client-session";
import Dashboard from './components/dashboard/dashboard';
ReactSession.setStoreType("localStorage");

const App = () => {
  const navigateCreateRoom = () => {
    window.location.href = "/createroom";
  };

  const navigateJoinRoom = () => {
    window.location.href = "/joinroom";
  };

  const isAuthed = () => {
    if (ReactSession.get("username")) {
      return true;
    } else {
      return false;
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

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
            ></IconButton>

            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Smart Game SandBox
            </Typography>

            {isAuthed() && (
              <Button color="inherit" onClick={() => navigateCreateRoom()}>
                <AddIcon />
                &nbsp;Create Room
              </Button>
            )}
            {isAuthed() && (
              <Button color="inherit" onClick={() => navigateJoinRoom()}>
                <CycloneIcon />
                &nbsp;Join Room
              </Button>
            )}

            {isAuthed() && (
              <Button color="inherit" onClick={() => logout()}>
                <FaceIcon />
                &nbsp;Logout
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            isAuthed()
              ? <Navigate to='/dashboard' />
              : <Navigate to='/login' />
          } />
          <Route 
            path="/dashboard"
            element={isAuthed() ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/createroom"
            element={isAuthed() ? <RoomCreation /> : <Navigate to="/login" />}
          />
          <Route
            path="/joinroom"
            element={isAuthed() ? <JoinRoom /> : <Navigate to="/login" />}
          />
          <Route path="/room" element={isAuthed() ? <Room /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/newaccount" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
