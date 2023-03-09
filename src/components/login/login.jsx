import React from "react";
import styles from "./loginStyle";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import { ReactSession } from "react-client-session";
import {SMARTButton, SMARTIconButton} from '../button/button';
import CasinoIcon from '@mui/icons-material/Casino';
import logo from "../icons/Group_89.png";
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
        : "http://localhost:8000";
    axios
      .post(`${url}/api/login`, {
        username: username,
        password: password,
      })
      .then((response) => {
        if (response.status === 200) {
          setErrorMessage("");
          ReactSession.set("username", response.data.user.username);
          window.location.href = "/dashboard";
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
                    color: "white",
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
                className="text-field"
                required
                label="Password"
                type={"password"}
                size="large"
                InputLabelProps={{
                  style: {
                    color: "white",
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
