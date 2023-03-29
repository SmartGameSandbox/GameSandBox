import React, { useState } from "react";
import "./Sidebar.css";
import profileIcon from "../icons/account_circle_FILL0_wght400_GRAD0_opsz48.png";
import settingsIcon from "../icons/settings_FILL0_wght400_GRAD0_opsz48.png";
import logoutIcon from "../icons/power_settings_new_FILL0_wght400_GRAD0_opsz48.png";
import arrowIcon from "../icons/arrow_forward_ios_FILL0_wght400_GRAD0_opsz48.png";
import $ from "jquery";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const firstTime = React.useRef(0);

  React.useEffect(() => {
    if (open) {
      $("#close-arrow").css({
        animation: "rotationBackwards 1s forwards",
      });
      $("#options").css({
        display: "grid",
      });
      $(".navbar").css({
        animation: "openingColumns 1s forwards",
      });
  
      setTimeout(() => {
        $("#profile").slideToggle();
        $("#settings").slideToggle();
        $("#logout").slideToggle();
  
        $("#profile").css({
          display: "grid",
        });
        $("#settings").css({
          display: "grid",
        });
        $("#logout").css({
          display: "grid",
        });
      }, 800);
    } else {
      $("#profile").slideToggle();
      $("#settings").slideToggle();
      $("#logout").slideToggle();

      if (firstTime.current < 2) {
        firstTime.current += 1;
        return;
      }
  
      setTimeout(() => {
        $("#close-arrow").css({
          animation: "rotation 1s forwards",
        });
        setTimeout(() => {
          $("#options").css({
            display: "none",
          });
        }, 1000);
        $(".navbar").css({
          animation: "closingColumns 1s forwards",
        });
      }, 300);
    }
  }, [open]);

  return (
    <nav className="navbar">
      <div id="options">
        <div id="profile" >
          <img src={profileIcon} alt="Profile" />
          <p>Profile</p>
        </div>
        <div id="settings" >
          <img src={settingsIcon} alt="Settings" />
          <p>Settings</p>
        </div>
        <div id="logout" onClick={() => {window.location.href = "/logout"}}>
          <img src={logoutIcon} alt="Logout" />
          <a href="/logout">Logout</a>
        </div>
      </div>
      <div id="close-open" onClick={() => {setOpen(!open)}}>
        <img id="close-arrow" src={arrowIcon} alt="Close" />
      </div>
    </nav>
  );
}

export default Sidebar;
