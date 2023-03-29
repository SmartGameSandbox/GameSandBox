import { margin } from "@mui/system";

const styles = {
  main: {
    height: "100vh",
    display: "grid",
  },
  left: {
    backgroundColor: "#163B6E",
    gridColumn: 1,
  },
  right: {
    gridColumn: 2,
    size: "100%",
    margin: "auto",
  },
  textFieldStyle: {
    mb: 2.0,
    mt: 1.5,
    width: 300,
    // backgroundColor: "white",
  },
  roomBoxStyle: {
    width: 300,
    color: "white",
    fontFamily: "Nunito",
    m: "auto",
    pt: "25%",
  },
  forgotPasswordStyle: {
    mt: 0,
    pt: 0,
    ml: 9,
    mb: 1.2,
    color: "black",
  },
  signInButtonStyle: {
    bgcolor: "lightseagreen",
    width: 200,
    ml: 6,
    mb: 2,
    fontSize: "1.5em",
  },
  errorMessageStyle: {
    color: "red",
    marginLeft: 5,
    marginBottom: 0,
    marginTop: 0,
  },
  gameButtons: {
    height: "2em",
    width: "80%",
    marginLeft: "10%",
    marginTop: "0.5em",
    backgroundColor: "#163B6E",
    color: "white",
    fontSize: "2em",
    border: "none",
    fontWeight: "bold",
    fontFamily: "Nunito",
    justifyContent: "center",
  },
  btnGroup: {
    boxSizing: "border-box",
    padding: "2%",
    gridGap: "2%",
    justifyItems: "center",
    justifyContent: "center",
  },
  loading: {
    height: "2em",
    width: "20%",
    marginLeft: "10%",
    marginTop: "0.5em",
    backgroundColor: "#163B6E",
    color: "white",
    fontSize: "2em",
    border: "none",
    fontWeight: "bold",
    fontFamily: "Nunito",
    justifyContent: "center",
  },
};

export default styles;
