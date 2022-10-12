import React, { Component } from 'react';
import axios from 'axios';
export default class RoomCreation extends Component {
  constructor(props) {
    super(props);
    this.passwordInput = React.createRef();
    this.roomNameInput = React.createRef();
  }

  createRoom() {
    let name = this.passwordInput.current.value;
    let password = this.passwordInput.current.value;
    const url = process.env.NODE_ENV === 'production' ? "https://smartgamesandbox.herokuapp.com/" : "http://localhost:5000";

    axios.post(`${url}/api/room`, {
      name: name,
      password: password
    }).then((response) => {
      window.location.href = `/room?id=${response.data.id}&password=${response.data.password}`;
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    return (
      <>
        <div>
          <form>
            <input ref={this.roomnameInput} placeholder='Room Name' />
            <br />
            <input ref={this.passwordInput} placeholder='Password' type='password' />
            <br />
            <button type='submit' onClick={e => {
              e.preventDefault()
              this.createRoom()
            }}>CREATE ROOM</button>
          </form>
        </div>
      </>
    );
  }
}
