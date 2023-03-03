import React from "react";
import styles from "./registerStyle";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {SMARTButton} from '../button/button';
import axios from 'axios';
import logo from "../icons/Group_89.png";

const Register = () => {
  const [usernameInputText, setUsernameInputText] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const handleUsernameTextInputChange = (event) => {
    setUsernameInputText(event.target.value);
  };

  const [emailInputText, setEmailInputText] = React.useState("");
  const handleEmailInputtTextChange = (event) => {
    setEmailInputText(event.target.value);
  };
  const [passwordInputText, setPasswordInputText] = React.useState("");
  const handlePasswordTextInputChange = (event) => {
    setPasswordInputText(event.target.value);
  };

  const [confirmPasswordInputText, setConfirmPasswordInputText] =
    React.useState("");
  const handleConfirmPasswordTextInputChange = (event) => {
    setConfirmPasswordInputText(event.target.value);
  };

  const handleSubmit = () => {
    let username = usernameInputText;
    let email = emailInputText;
    let password = passwordInputText;
    let confirmPw = confirmPasswordInputText;

    if (password !== confirmPw) {
      setErrorMessage("Passwords do not match");
    } else {
      const url = process.env.NODE_ENV === 'production' ? "https://smartgamesandbox.herokuapp.com" : "http://localhost:5000";
      axios.post(`${url}/api/register`, {
        username: username,
        email: email,
        password: password
      }).then((response) => {
        if (response.status === 200) {
          setErrorMessage("");
          window.location.href = "/login";
        } else {
          setErrorMessage(response.data.message);
        }
      }).catch((errResponse) => {
        setErrorMessage(errResponse.response.data.message);
      });
    }
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
              />
              <br />
              <TextField
                id="password-input"
                sx={styles.textFieldStyle}
                placeholder="Please create your password"
                value={passwordInputText}
                onChange={handlePasswordTextInputChange}
                className="text-field"
                required
                label="Password"
                type={"password"}
                size="large"
              />
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
