const styles = {
  main: {
    height: "100vh",
    display: "grid",
    gridTemplateColumns: "50% 50%",
  },
  left: {
    backgroundColor: "#163B6E",
    gridColumn: 1,
  },
  right: {
    backgroundColor: "black",
    gridColumn: 2,
    filter: "invert(100%)",
    size: "100%",
    margin: "auto",
  },
  textFieldStyle: {
    mb: 2.0,
    mt: 1.5,
    width: 300,
    backgroundColor: "white",
  },
  loginBoxStyle: {
    width: 300,
    color: "white",
    fontFamily: "Nunito",
    m: "auto",
    pt: "15%",
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
    marginLeft: 15,
  },
};

export default styles;