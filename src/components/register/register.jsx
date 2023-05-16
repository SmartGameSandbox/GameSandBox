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


const Register = () => {
  const [usernameInputText, setUsernameInputText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailInputText, setEmailInputText] = useState("");
  const [passwordInputText, setPasswordInputText] = useState("");
  const [confirmPasswordInputText, setConfirmPasswordInputText] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const isPasswordEmpty = passwordInputText.trim() === '';

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
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_!@#$%^&*?/])[\w!@#$%^&*?/]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = () => {
    if (passwordInputText !== confirmPasswordInputText) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (!isPasswordValid) {
      setErrorMessage("Password must contain at least 8 characters, including at least one lowercase letter, one uppercase letter, one number, and one special character");
      return;
    }

    const salt = bcryptjs.genSaltSync(10);
    const hashedPassword = bcryptjs.hashSync(passwordInputText, salt);

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
                    backgroundColor: isPasswordEmpty
                    ? "#f2f2f2"
                    : isPasswordValid
                      ? "lightgreen"
                      : "pink",
                    borderRadius: "15px",
                  },
                  endAdornment: isPasswordEmpty ? null : (
                    <div style={{ position: "absolute", right: 10 }}>
                      {isPasswordValid ? (
                        <FaCheck style={{ color: "green" }} />
                      ) : (
                        <FaTimes style={{ color: "red" }} />
                      )}
                    </div>
                  ),
                }}
              />
              {isPasswordEmpty === false && (
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
