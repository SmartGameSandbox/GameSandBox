import {Button, IconButton} from '@mui/material';
import buttonThemes from './buttonThemes';
import React from "react";

// Styles specific to the SMART buttons 
const buttonStyles = {
    smartBtn: {
        fontWeight: "bold",
        fontFamily: "Nunito",
        borderRadius: "15px",
        textTransform: "none",
        
        // Default theme
        backgroundColor: '#f0f0f0',
        color: 'black',

        '&:hover': {
            backgroundColor: "#DBDBDB"
        }
    },
    smartIconBtn: {
        fontWeight: "bold",
        fontFamily: "Nunito",
        borderRadius: "15px",
        textTransform: "none",
        
        // Default theme
        backgroundColor: '#f0f0f0',
        color: 'black',

        '&:hover': {
            backgroundColor: "#DBDBDB"
        },
        "& .MuiTouchRipple-root .MuiTouchRipple-child": {
            borderRadius: '8px'
        },
    }
}

/**
 * SMARTButton for text buttons.
 * 
 * Set props.theme to a key from buttonThemes.js (optional)
 * Set props.sx to an Object of jsx CSS styles to set custom CSS to this component (optional)
 * @param {Object} props any props to pass along to mui Button
 * @returns 
 */
export const SMARTButton = (props) => {
    const { theme, children, sx, ...pass } = props;
    return (
        <Button sx={{...buttonStyles.smartBtn, ...sx, ...(theme && buttonThemes[theme])}} {...pass}>
            {children}
        </Button>
    )
}

export const SMARTIconButton = (props) => {
    const { theme, children, sx, ...pass } = props;
    return (
        <IconButton sx={{...buttonStyles.smartIconBtn, ...sx, ...(theme && buttonThemes[theme])}} {...pass}>
            {children}
        </IconButton>
    )
}