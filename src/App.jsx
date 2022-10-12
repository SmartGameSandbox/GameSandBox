import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoomCreation from './components/rooms/roomCreation';
import Room from './components/rooms/room';

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<RoomCreation />} />
          <Route path='createroom' element={<RoomCreation />} />
          <Route path='room' element={<Room />} />
        </Routes>
      </BrowserRouter>
    );
  }
}
