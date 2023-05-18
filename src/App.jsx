import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Room from "./components/gameRoomComponents/room";
import SavedGames from "./components/savedGames/savedGames";
import Login from "./components/login/login";
import Logout from "./components/logout/logout";
import Register from "./components/register/register";
import BuildGamePage from "./components/buildGame/buildGamePage";
import Dashboard from './components/dashboard/dashboard';
import Games from './components/games/games.jsx';
import Sidebar from "./components/sidebar/Sidebar";

const App = () => {

  const userAuthed = sessionStorage.getItem("token");

  return (
    <>
      {userAuthed && <Sidebar/>}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            userAuthed
              ? <Navigate to='/dashboard' />
              : <Navigate to='/login' />
          } />
          <Route 
            path="/dashboard"
            element={userAuthed ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route 
            path="/games"
            element={userAuthed ? <Games /> : <Navigate to="/login" />}
          />
          <Route 
            path="/buildgame" 
            element={userAuthed ? <BuildGamePage />: <Navigate to="/login" />} />
          <Route
            path="/mygames"
            element={userAuthed ? <SavedGames /> : <Navigate to="/login" />}
          />
          <Route path="/room" element={userAuthed ? <Room /> : <Navigate to="/login" />} />
          <Route path="/login" element={userAuthed ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/newaccount" element={userAuthed ? <Navigate to="/dashboard" /> : <Register />} />

          <Route path="/logout" element={<Logout />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
