import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Logout = () => {
    useEffect(() => {
        sessionStorage.clear();
    }, []);

    return (
        <Navigate to="/login" />
    );
};

export default Logout;
