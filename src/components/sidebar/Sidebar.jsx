import React from "react";
import "./Sidebar.css";
import profileIcon from "/Users/abdullahhanani/Desktop/GameSandBox/public/assets/images/icons/account_circle_FILL0_wght400_GRAD0_opsz48.png";
import settingsIcon from "/Users/abdullahhanani/Desktop/GameSandBox/public/assets/images/icons/settings_FILL0_wght400_GRAD0_opsz48.png";
import logoutIcon from "/Users/abdullahhanani/Desktop/GameSandBox/public/assets/images/icons/power_settings_new_FILL0_wght400_GRAD0_opsz48.png";
import arrowIcon from "/Users/abdullahhanani/Desktop/GameSandBox/public/assets/images/icons/arrow_forward_ios_FILL0_wght400_GRAD0_opsz48.png";

function Sidebar() {
  return (
    <nav className="navbar">
      <div id="close-open">
        <img id="close-arrow" src={arrowIcon} alt="Close" />
      </div>
      <div id="options">
        <div id="profile" className="items">
          <img src={profileIcon} alt="Profile" />
          <p>Profile</p>
        </div>
        <div id="settings" className="items">
          <img src={settingsIcon} alt="Settings" />
          <p>Settings</p>
        </div>
        <div id="logout" className="items">
          <img src={logoutIcon} alt="Logout" />
          <p>Logout</p>
        </div>
      </div>
    </nav>
  );
}

export default Sidebar;
