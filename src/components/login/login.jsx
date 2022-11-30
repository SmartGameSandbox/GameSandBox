import React from "react";
import styles from "./loginStyle";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import { ReactSession } from "react-client-session";
ReactSession.setStoreType("localStorage");

const Login = () => {
  const [usernameInputText, setUsernameInputText] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const handleUsernameTextInputChange = (event) => {
    setUsernameInputText(event.target.value);
  };
  const [passwordInputText, setPasswordInputText] = React.useState("");
  const handlePasswordTextInputChange = (event) => {
    setPasswordInputText(event.target.value);
  };

  const handleSubmit = () => {
    let username = usernameInputText;
    let password = passwordInputText;
    const url =
      process.env.NODE_ENV === "production"
        ? "https://smartgamesandbox.herokuapp.com"
        : "http://localhost:5000";
    axios
      .post(`${url}/api/login`, {
        username: username,
        password: password,
      })
      .then((response) => {
        if (response.status === 200) {
          setErrorMessage("");
          ReactSession.set("username", response.data.user.username);
          window.location.href = "/createroom";
        }
      })
      .catch((error) => {
        setErrorMessage(error.response.data.message);
      });
  };

  return (
    <>
      <Box
        sx={styles.roomBoxStyle}
        id="login-container"
        component="form"
        autoComplete="off"
      >
        <h1>Login to your account</h1>
        <h4>Hey, good to see you again!</h4>
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
          />
          <br />
          <TextField
            id="password-input"
            sx={styles.textFieldStyle}
            placeholder="Please enter your password"
            value={passwordInputText}
            onChange={handlePasswordTextInputChange}
            className="text-field"
            required
            label="Password"
            type={"password"}
            size="large"
          />
        </div>
        <div>
          <p style={styles.errorMessageStyle}>{errorMessage}</p>
          <br />
          <Button
            variant="contained"
            disabled={usernameInputText === "" || passwordInputText === ""}
            sx={styles.signInButtonStyle}
            onClick={handleSubmit}
          >
            Sign in
          </Button>
        </div>

        <div>
          <span> Not registered yet?</span>
          <Button href="/newaccount">Create an Account</Button>
        </div>
      </Box>
    </>
  );
};

export default Login;
