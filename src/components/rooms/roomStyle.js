import * as Constants from '../../util/constants';

const styles = {
    textFieldStyle: {
        mb: 4.5,
        mt: 1.5,
        width: 300
    },
    roomBoxStyle: {
        height: 420,
        width: 400,
        ml: "calc(50% - 250px)",
        border: "2px solid lightseagreen",
        borderRadius: 10,
        mt: 15,
        pt: 3,
        pl: 5
    },
    board: {
        width: "800px",
        height: "400px",
        position: "absolute",
        marginLeft: "calc(50% - 400px)",
        marginTop: "40px",
        borderRadius: "5px"
    },
    createRoomButtonStyle: {
        bgcolor: 'lightseagreen',
        mt: "20px",
    },
    stageWrapper: {
        backgroundColor: "white",
        width: Constants.CANVAS_WIDTH + "px",
        height: Constants.CANVAS_HEIGHT + "px",
        display: "block",
    },
    roomWrapper: {
        backgroundColor: "rgba(0, 150, 136, 0.3)",
        width: "100%",
        minWidth: `${Constants.CANVAS_WIDTH}px`,
        paddingTop: "50px",
        paddingLeft: `calc(50% - ${0.5 * Constants.CANVAS_WIDTH}px)`,
        maxWidth: "100%",
        margin: 0,
        paddingBottom: "50px",
        minHeight: "calc(100% - 64px)",
        boxSizing: "border-box"
    }
}

export default styles;
