/*
  File: login.jsx

  Description: Contains the Login component. Renders a form for users to enter their username and password, and handles 
  the submission of the input to the backend for authentication. Utilizes bcryptjs to compare the hashed password from
  the database with the password input by the user. Once the user is authenticated, the component stores the user's
  information and authentication token in the session storage and redirects the user to dashboard.
*/

import axios from "axios";
import React, { useState } from "react";
import styles from "./loginStyle";
import { BASE_URL } from '../../util/constants'
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {SMARTButton} from '../button/button';
import logo from "../icons/Group_89.png";
import bcryptjs from "bcryptjs";

// Login Component
const Login = () => {
  // State variables for username and password input text fields initialized to empty strings
  const [usernameInputText, setUsernameInputText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordInputText, setPasswordInputText] = useState("");

  // Sets the value of usernameInputText and passwordInputText to the value of the username and password input text fields
  const handleUsernameTextInputChange = (event) => {
    setUsernameInputText(event.target.value);
  };
  const handlePasswordTextInputChange = (event) => {
    setPasswordInputText(event.target.value);
  };

  // Function to handle login form submission to backend
  const handleSubmit = () => {
    let username = usernameInputText;
    let password = passwordInputText;
    axios
      .post(`${BASE_URL}/api/login`, {
        username: username,
        password: password,
      })
      .then((response) => {
        if (response.status === 200) {
          // Compare hashed password from database with password input by user using bcryptjs.compare
          bcryptjs.compare(password, response.data.user.password, (err, result) => {
            if (result) {
              setErrorMessage("");

              // INVESTIGATE WHY THIS WORKS ON LIVE BUT NOT DEV =====================
              localStorage.setItem("username", response.data.user.username);
              localStorage.setItem("id", response.data.user._id);

              sessionStorage.setItem("username", response.data.user.username);
              sessionStorage.setItem("id", response.data.user._id);
              sessionStorage.setItem("token", response.data.token); // Store generated authentication token in session storage
              window.location.href = "/dashboard";
            } else {
              setErrorMessage("Incorrect password");
            }
          });
        }
      })
      .catch((error) => {
        setErrorMessage(error.response.data.message);
      });
  };

  return (
    <>
      <div id="main" style={styles.main}>
        <div id="left" style={styles.left}>
          <Box
            sx={styles.roomBoxStyle}
            id="login-container"
            component="form"
            autoComplete="off"
          >
            <h1>Login</h1>
            <div>
              <TextField
                id="username-input"
                sx={styles.textFieldStyle}
                placeholder="Please enter your username"
                value={usernameInputText}
                onChange={handleUsernameTextInputChange}
                className="text-field"
                required
                label="Username"
                size="large"
                InputLabelProps={{
                  style: {
                    color: "gray",
                    position: "relative",
                    top: "10px",
                  },
                }}
                InputProps={{
                  style: {
                    backgroundColor: "#f2f2f2",
                    borderRadius: "15px",
                  },
                }}
              />
              <br />
              <TextField
                id="password-input"
                sx={styles.textFieldStyle}
                placeholder="Please enter your password"
                value={passwordInputText}
                onChange={handlePasswordTextInputChange}
                onKeyDown={(e) => {
                  if (e.code !== "Enter") return;
                  handleSubmit();
                }}
                className="text-field"
                required
                label="Password"
                type={"password"}
                size="large"
                InputLabelProps={{
                  style: {
                    color: "gray",
                    position: "relative",
                    top: "10px",
                  },
                }}
                InputProps={{
                  style: {
                    backgroundColor: "#f2f2f2",
                    borderRadius: "15px",
                  },
                }}
              />
            </div>
            <div>
              <p style={styles.errorMessageStyle}>{errorMessage}</p>
              <div>
                <span> Don't have an account?</span>
                <Button href="/newaccount">Sign up</Button>
              </div>
              <SMARTButton
                theme="secondary"
                size="large"
                variant="contained"
                disabled={usernameInputText === "" || passwordInputText === ""}
                sx={styles.signInButtonStyle}
                onClick={handleSubmit}
              >
                Sign in
              </SMARTButton>
            </div>
          </Box>
        </div>
        <div id="right" style={styles.right}>
          <img src={logo} style={{ width: "200px" }} />
        </div>
      </div>
    </>
  );
};

export default Login;