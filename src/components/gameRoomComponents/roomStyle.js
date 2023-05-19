import * as Constants from '../../util/constants';

export const canvasWrapper = {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: '2em'
};
export const stageWrapper = {
    width: Constants.CANVAS_WIDTH + "px",
    height: Constants.CANVAS_HEIGHT + "px",
};
export const roomWrapper = {
    height: "100%",
    width: "100%",
    minWidth: `${Constants.CANVAS_WIDTH}px`,
    maxWidth: "100%",
    minHeight: `${Constants.CANVAS_HEIGHT}px`,
    boxSizing: "border-box"
};
