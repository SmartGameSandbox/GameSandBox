/*
    File: logout.jsx

    Description: Contains the Logout component.
    Clears the user's information and authentication token from the session,
    and redirects the user to the login page.
*/

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
