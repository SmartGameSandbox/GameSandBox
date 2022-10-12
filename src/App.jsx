import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoomCreation from './components/rooms/roomCreation';
import Room from './components/rooms/room';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<RoomCreation />} />
        <Route path='createroom' element={<RoomCreation />} />
        <Route path='room' element={<Room />} />
      </Routes>
    </BrowserRouter>
  ) 
}

export default App