import React from "react";
import styles from "./loginStyle";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const LoginComponent = () => {
  const [usernameInputText, setUsernameInputText] = React.useState("");
  const handleUsernameTextInputChange = (event) => {
    setUsernameInputText(event.target.value);
  };
  const [passwordInputText, setPasswordInputText] = React.useState("");
  const handlePasswordTextInputChange = (event) => {
    setPasswordInputText(event.target.value);
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
        <div sx={styles.forgotPasswordStyle}>
          {/* TODO: Line sign in and forgot password in one line. */}
          <div>
            <Button sx={styles.forgotPasswordStyle}>Forgot password?</Button>
          </div>
          <div>
            <Button
              variant="contained"
              sx={styles.signInButtonStyle}
              // onClick={() => {
              //   createRoom();
              // }}
            >
              Sign in
            </Button>
          </div>
        </div>

        <div>
          <span>Not registered yet?</span>
          <Button href="/newaccount">Cretae an Account</Button>
        </div>
      </Box>
    </>
  );
};

export default LoginComponent;
