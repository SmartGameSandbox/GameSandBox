import * as Constants from '../../util/constants';

// Styles following a theme
const buttonThemes = {
    // Uses primarily the PRIMARY color
    primary: {
        bgcolor: Constants.COLOR_PRIMARY,
        color: 'white',

        '&:hover': {
            bgcolor: Constants.COLOR_PRIMARY_VARIANT,
        },
        '&:disabled': {
            bgcolor: Constants.COLOR_PRIMARY,
            opacity: 0.8
        },
    },

    // Uses primarily the SECONDARY color
    secondary: {
        bgcolor: Constants.COLOR_SECONDARY,
        color: Constants.COLOR_PRIMARY,

        '&:hover': {
            bgcolor: Constants.COLOR_SECONDARY_VARIANT,
        },
        '&:disabled': {
            bgcolor: Constants.COLOR_SECONDARY,
            opacity: 0.8
        }
    },
}

export default buttonThemes;