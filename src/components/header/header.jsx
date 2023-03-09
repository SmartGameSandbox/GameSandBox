import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";

const Header = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{boxShadow: "none", backgroundColor: "unset"}}>
            <div>
                <img src={`${process.env.PUBLIC_URL}/assets/images/logo.png`} style={{width: "200px", margin: '1em'}}/>
            </div> 
            </AppBar>
        </Box>
    )
}

export default Header;