import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RoomCreation from "./components/rooms/createRoom";
import Room from "./components/rooms/room";
// import JoinRoom from "./components/rooms/joinRoom";
import MyGames from "./components/myGames/myGames";
import Login from "./components/login/login";
import Logout from "./components/logout/logout";
import Register from "./components/register/register";
import BuildGamePage from "./components/buildGame/buildGamePage";
import { ReactSession } from "react-client-session";
import Dashboard from './components/dashboard/dashboard';
import Games from './components/games/games.jsx';
ReactSession.setStoreType("localStorage");

const App = () => {
  const isAuthed = () => {
    if (ReactSession.get("username")) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
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
            path="/games"
            element={isAuthed() ? <Games /> : <Navigate to="/login" />}
          />
          <Route
            path="/createroom"
            element={isAuthed() ? <RoomCreation /> : <Navigate to="/login" />}
          />
          <Route 
            path="/buildgame" 
            element={isAuthed() ? <BuildGamePage />: <Navigate to="/login" />} />

          {/* <Route
            path="/joinroom"
            element={isAuthed() ? <JoinRoom /> : <Navigate to="/login" />}
          /> */}
          <Route
            path="/mygames"
            element={isAuthed() ? <MyGames /> : <Navigate to="/login" />}
          />
          <Route path="/room" element={isAuthed() ? <Room /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/newaccount" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
