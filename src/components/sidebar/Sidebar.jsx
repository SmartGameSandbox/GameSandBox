import React, { useState } from "react";
import "./Sidebar.css";
import profileIcon from "../icons/account_circle_FILL0_wght400_GRAD0_opsz48.png";
import settingsIcon from "../icons/settings_FILL0_wght400_GRAD0_opsz48.png";
import logoutIcon from "../icons/power_settings_new_FILL0_wght400_GRAD0_opsz48.png";
import arrowIcon from "../icons/arrow_forward_ios_FILL0_wght400_GRAD0_opsz48.png";
import $ from "jquery";

let currVal = 2;
if (process.env.NODE_ENV === "production") {
  currVal = 1;
}

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const firstTime = React.useRef(0);

  React.useEffect(() => {
    if (open) {
      $("#close-arrow").css({
        animation: "rotationBackwards 0.3s forwards",
      });
      $("#options").css({
        display: "grid",
      });
      $(".navbar").css({
        animation: "openingColumns 0.3s forwards",
      });

      $("#profile").css({
        display: "grid",
      });
      $("#settings").css({
        display: "grid",
      });
      $("#logout").css({
        display: "grid",
      });
    } else {
      if (firstTime.current < currVal) {
        firstTime.current += 1;
        return;
      }
      $("#close-arrow").css({
        animation: "rotation 0.3s forwards",
      });
      setTimeout(() => {
        $("#options").css({
          display: "none",
        });
      }, 300);
      $(".navbar").css({
        animation: "closingColumns 0.3s forwards",
      });
    }
  }, [open]);

  return (
    <nav className="navbar">
      <div id="options">
        <div id="profile" className="option">
          <img src={profileIcon} alt="Profile" />
          <a href="/profile">Profile</a>
        </div>
        <div id="settings" className="option">
          <img src={settingsIcon} alt="Settings" />
          <a href="/settings">Settings</a>
        </div>
        <div id="logout" className="option" onClick={() => { window.location.href = "/logout" }}>
          <img src={logoutIcon} alt="Logout" />
          <a href="/logout">Logout</a>
        </div>
      </div>
      <div id="close-open" onClick={() => { setOpen(!open) }}>
        <img id="close-arrow" src={arrowIcon} alt="Close" />
      </div>
    </nav>
  );
}

export default Sidebar;
