import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { SMARTButton } from "../button/button";
import { BASE_URL } from '../../util/constants';

/**
 * @component
 * @property {function} closePopup toggle visibility of parent modal.
 */

const SidebarProfile = ({closePopup}) => {

    const [userEmail, setUserEmail] = useState(null);
    const [roomId, setRoomId] = useState(null);

    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      setRoomId(urlParams.get('id'));

      axios
        .get(`${BASE_URL}/api/profile`, {
          params: {
            creatorId: localStorage.getItem('id'),
          },
        })
        .then((response) => {
          setUserEmail(response.data.email);
        })
        .catch((error) => {
          console.log("Error" + error);
        });
  }, []);
  
    return (
        <>
        <div>

            <div className={'profile-form'}>
                <form onSubmit={handleSubmit}>
                    <div className={'row'}>
                        <label>USERNAME:</label>
                        <input
                            type="text"
                            name="name"
                            defaultValue={localStorage.getItem("username")}
                            maxLength={20}
                            required
                        />
                    </div>
                    <div className={'row'}>
                        <label>EMAIL:</label>
                        <p>{userEmail}</p>
                    </div>

                    <SMARTButton
                    type="submit"
                    theme="secondary"
                    size="large"
                    variant="contained"
                    >
                    Update Profile
                    </SMARTButton>
                    <p id="errorModal"></p>
                </form>
            </div>

        </div>
        </>
    );

    function handleSubmit(e) {
      e.preventDefault();

      const formData = new FormData(e.target);
      const name = formData.get('name');
      const errorModal = document.getElementById('errorModal');
      
      if(!roomId) {
        axios
          .post(`${BASE_URL}/api/profileUpdate?creatorId=${localStorage.getItem('id')}`, { username: name })
          .then((response) => {
            // Update local and session storage with the new username
            localStorage.setItem("username", response.data.user.username);
            sessionStorage.setItem("username", response.data.user.username);
            closePopup();
          })
          .catch((error) => {
            console.log("Error: " + error);
            // Display the error message in the modal
            errorModal.innerHTML = error.response.data.message;
            errorModal.style.display = 'block'; // Show the modal
          });
      } else {
        // Display the error message in the modal
        errorModal.innerHTML = "Username cannot be altered within a lobby";
        errorModal.style.display = 'block'; // Show the modal
      }
    }
  
};
  export default SidebarProfile;