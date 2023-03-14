import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";

const Header = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{boxShadow: "none", backgroundColor: "unset"}}>
            <div>
                <img 
                    src={`${process.env.PUBLIC_URL}/assets/images/logo.png`} 
                    alt="BCIT SMART logo"
                    style={{width: "200px", marginLeft: '3em', marginTop: '3em', cursor: 'pointer'}}
                    onClick={() => {window.location.href="/dashboard"}}
                />
            </div> 
            </AppBar>
        </Box>
    )
}

export default Header;