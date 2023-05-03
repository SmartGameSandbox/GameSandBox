import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Logout = () => {
    useEffect(() => {
        localStorage.clear();
    }, []);

    setTimeout(() => {
        return (
            <Navigate to="/login" />
        )    
    }, 0);
}

export default Logout;