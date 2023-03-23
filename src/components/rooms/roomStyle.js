import * as Constants from '../../util/constants';

const styles = {
    textFieldStyle: {
        mb: 4.5,
        mt: 1.5,
        width: 300
    },
    roomBoxStyle: {
        height: "420px",
        width: "400px",
        ml: "calc(50% - 200px)",
        border: "2px solid lightseagreen",
        borderRadius: 10,
        mt: 10,
        pt: 3,
        pl: 5,
    },
    board: {
        width: "800px",
        height: "400px",
        position: "absolute",
        borderRadius: "5px",
        marginLeft: `${0.5 * Constants.CANVAS_WIDTH - 400}px`,
        marginTop: `${0.5 * (Constants.CANVAS_HEIGHT - Constants.HAND_HEIGHT) - 200}px`,
    },
    createRoomButtonStyle: {
        mt: "20px",
    },
    canvasWrapper: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: '2em'
    },
    stageWrapper: {
        width: Constants.CANVAS_WIDTH + "px",
        height: Constants.CANVAS_HEIGHT + "px",
    },
    roomWrapper: {
        height: "100%",
        width: "100%",
        minWidth: `${Constants.CANVAS_WIDTH}px`,
        maxWidth: "100%",
        minHeight: `${Constants.CANVAS_HEIGHT}px`,
        boxSizing: "border-box"
    },
    createRoomErrorStyle: {
        color: "red",
        fontSize: "12px",
        marginBottom: "0px",
    }
}

export default styles;
