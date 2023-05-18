import React, { useContext } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RoomCreation from "./components/rooms/createRoom";
import Room from "./components/rooms/room";
// import JoinRoom from "./components/rooms/joinRoom";
import SavedGames from "./components/savedGames/savedGames";
import Login from "./components/login/login";
import Logout from "./components/logout/logout";
import Register from "./components/register/register";
import BuildGamePage from "./components/buildGame/buildGamePage";
import Dashboard from './components/dashboard/dashboard';
import Games from './components/games/games.jsx';
import UserContext from "./components/userContext";
import Sidebar from "./components/sidebar/Sidebar";

/**
 * The React component App
 * @returns (<App />)
 */
const App = () => {
  //Getting the "token" from sessionStorage to verify if a user is logged in
  const userAuthed = sessionStorage.getItem("token");

  return (
    //Passing the username down to its child components
    <UserContext.Provider value={localStorage.getItem('username')}>
      {userAuthed && <Sidebar/>}
      <BrowserRouter>
      {/** Handling different paths and rendering components based on user authentication status */}
        <Routes>
          {/** The root path (dashboard) */}
          <Route path="/" element={
            userAuthed
              ? <Navigate to='/dashboard' />
              : <Navigate to='/login' />
          } />
          {/** Same as above */}
          <Route 
            path="/dashboard"
            element={userAuthed ? <Dashboard /> : <Navigate to="/login" />}
          />
          {/** The page showing hosted rooms*/}
          <Route 
            path="/games"
            element={userAuthed ? <Games /> : <Navigate to="/login" />}
          />
          {/** The page where user can create a live room */}
          <Route
            path="/createroom"
            element={userAuthed ? <RoomCreation /> : <Navigate to="/login" />}
          />
          {/** The page where user build a customized game */}
          <Route 
            path="/buildgame" 
            element={userAuthed ? <BuildGamePage />: <Navigate to="/login" />} />

          {/* <Route
            path="/joinroom"
            element={isAuthed() ? <JoinRoom /> : <Navigate to="/login" />}
          /> */}
          {/** The page showing the games the user has saved */}
          <Route
            path="/mygames"
            element={userAuthed ? <SavedGames /> : <Navigate to="/login" />}
          />
          {/** The page of a live game room */}
          <Route path="/room" element={userAuthed ? <Room /> : <Navigate to="/login" />} />
          {/** Login page, unauthenticated users will be directed here*/}
          <Route path="/login" element={userAuthed ? <Navigate to="/dashboard" /> : <Login />} />
          {/** Sign up page for new users*/}
          <Route path="/newaccount" element={userAuthed ? <Navigate to="/dashboard" /> : <Register />} />
          {/**  The path for logout, will be redirected to login page*/}
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
};

export default App;
