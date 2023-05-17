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


const Login = () => {
  const [usernameInputText, setUsernameInputText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordInputText, setPasswordInputText] = useState("");

  const handleUsernameTextInputChange = (event) => {
    setUsernameInputText(event.target.value);
  };
  const handlePasswordTextInputChange = (event) => {
    setPasswordInputText(event.target.value);
  };

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
          bcryptjs.compare(password, response.data.user.password, (err, result) => {
            if (result) {
              setErrorMessage("");
              sessionStorage.setItem("username", response.data.user.username);
              sessionStorage.setItem("id", response.data.user._id);
              sessionStorage.setItem("token", response.data.token); 
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