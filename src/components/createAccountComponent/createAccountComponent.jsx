import React from "react";
import styles from "./createAccountStyle";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from 'axios';

const CreateNewAccountComponent = () => {
  const [usernameInputText, setUsernameInputText] = React.useState("");
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
      console.log("no matcing pw");
      // probably better to show a modal
    } else {
      console.log("password matches");
      const url = process.env.NODE_ENV === 'production' ? "https://smartgamesandbox.herokuapp.com" : "http://localhost:5000";
      axios.post(`${url}/api/register`, {
        username: username,
        email: email,
        password: password
      }).then((response) => {
        console.log(response);
      }).catch((error) => {
        console.log(error);
      });
    }
  };

  return (
    <>
      <Box
        sx={styles.loginBoxStyle}
        id="create-account-container"
        component="form"
        autoComplete="off"
      >
        <h1>Create User</h1>
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
          <div sx={styles.forgotPasswordStyle}>
            <Button
              variant="contained"
              sx={styles.signInButtonStyle}
              href="/login"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
      </Box>
    </>
  );
};
export default CreateNewAccountComponent;
