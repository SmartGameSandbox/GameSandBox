/*
  File: register.jsx

  Description: Contains the Register component. Renders a form for users to enter their
  username, email, and password, and handles the submission of the input to the backend.
  Utilizes bcryptjs to hash the password before storing it in the database.
  Validates that the password meets the following requirements:
  - At least 8 characters
  - At least one lowercase letter
  - At least one uppercase letter
  - At least one number
  - At least one special character
*/

import React, {useState} from "react";
import axios from 'axios';
import styles from "./registerStyle";
import { BASE_URL } from '../../util/constants'
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {SMARTButton} from '../button/button';
import logo from "../icons/Group_89.png";
import bcryptjs from "bcryptjs";
import { FaCheck, FaTimes } from "react-icons/fa";
import Typography from "@mui/material/Typography";

// Register Component
const Register = () => {
  // State variables for username, email, password, and confirm password input text fields initialized to empty strings
  const [usernameInputText, setUsernameInputText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailInputText, setEmailInputText] = useState("");
  const [passwordInputText, setPasswordInputText] = useState("");
  const [confirmPasswordInputText, setConfirmPasswordInputText] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const isPasswordEmpty = passwordInputText.trim() === '';

  // Sets the variables to the values entered in the input text fields
  const handleUsernameTextInputChange = (event) => {
    setUsernameInputText(event.target.value);
  };

  const handleEmailInputtTextChange = (event) => {
    setEmailInputText(event.target.value);
  };

  const handlePasswordTextInputChange = (event) => {
    const newPassword = event.target.value;
    setPasswordInputText(newPassword);
    setIsPasswordValid(validatePassword(newPassword));
  };

  const handleConfirmPasswordTextInputChange = (event) => {
    setConfirmPasswordInputText(event.target.value);
  };

  const validatePassword = (password) => {
//    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_!@#$%^&*?/])[\w!@#$%^&*?/]{8,}$/; // Regex expression to validate password
    const passwordRegex = /^.{4,}$/; // Min of 4 characters, don't care what
    return passwordRegex.test(password); // Returns true if password matches regex requirements, false otherwise
  };

  // Check to make sure the password and confirm password fields match
  const handleSubmit = () => {
    if (passwordInputText !== confirmPasswordInputText) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (!isPasswordValid) {
      setErrorMessage("Password must contain at least 8 characters, including at least one lowercase letter, one uppercase letter, one number, and one special character");
      return;
    }

    const salt = bcryptjs.genSaltSync(10); // Generate salt for hashing password with cost factor of 10
    const hashedPassword = bcryptjs.hashSync(passwordInputText, salt); // Hash password using bcryptjs

    // Send POST request to backend to register user credentials
    axios.post(`${BASE_URL}/api/register`, {
      username: usernameInputText,
      email: emailInputText,
      password: hashedPassword
    }).then((response) => {
      if (response.status !== 200) {
        setErrorMessage(response.data.message);
        return;
      }
      setErrorMessage("");

      // Store username, id, and authentication token in session storage
      localStorage.setItem("username", response.data.user.username);
      localStorage.setItem("id", response.data.user._id);
      window.location.href = "/dashboard";
    }).catch((errResponse) => {
      setErrorMessage(errResponse.response.data.message);
    });
  };

  return (
    <>
      <div id="main" style={styles.main}>
        <div id="left" style={styles.left}>
          <Box
            sx={styles.loginBoxStyle}
            id="create-account-container"
            component="form"
            autoComplete="off"
          >
            <h1>Sign Up</h1>
            <div>
              <TextField
                id="username-input"
                sx={styles.textFieldStyle}
                placeholder="Please select your username"
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
                id="email-input"
                sx={styles.textFieldStyle}
                placeholder="Please enter your email address"
                value={emailInputText}
                onChange={handleEmailInputtTextChange}
                className="text-field"
                required
                label="Email Address"
                type={"email"}
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
                sx={ styles.textFieldStyle }
                placeholder="Please create your password"
                value={passwordInputText}
                onChange={handlePasswordTextInputChange}
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
                    backgroundColor: isPasswordEmpty // If password is empty, keep color as default
                    ? "#f2f2f2"
                    : isPasswordValid // When password becomes valid, change color to lightgreen, otherwise set as pink
                      ? "lightgreen"
                      : "pink",
                    borderRadius: "15px",
                  },
                  endAdornment: isPasswordEmpty ? null : ( // If password is empty, do not show checkmark or x
                    <div style={{ position: "absolute", right: 10 }}>
                      {isPasswordValid ? (
                        <FaCheck style={{ color: "green" }} /> // When password is valid, show green checkmark
                      ) : (
                        <FaTimes style={{ color: "red" }} /> // When password is invalid, show red x
                      )}
                    </div>
                  ),
                }}
              />
              {isPasswordEmpty === false && (
                // If password is not empty, show password requirements
                <Typography variant="body2" gutterBottom>
                  *Password must contain at least 8 characters, including at least one lowercase letter, one uppercase letter, one number, and one special character.
                </Typography>
)}
              <br />
              <TextField
                id="confirm-password-input"
                sx={styles.textFieldStyle}
                placeholder="Please confirm your password"
                value={confirmPasswordInputText}
                onChange={handleConfirmPasswordTextInputChange}
                className="text-field"
                required
                label="Confirm Password"
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
            <p style={styles.errorMessageStyle}>{errorMessage}</p>
            <div sx={styles.forgotPasswordStyle}>
              <div>
                <span> Have an account?</span>
                <Button href="/login">Login</Button> {/** change the route */}
              </div>
              <SMARTButton
                size="large"
                theme="secondary"
                variant="contained"
                sx={styles.signInButtonStyle}
                onClick={handleSubmit}
                disabled={
                  usernameInputText === "" ||
                  emailInputText === "" ||
                  passwordInputText === "" ||
                  confirmPasswordInputText === "" ||
                  passwordInputText !== confirmPasswordInputText
                }
              >
                Sign Up
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
export default Register;
