import React from "react";
import "./Sidebar.css";
import profileIcon from "../icons/account_circle_FILL0_wght400_GRAD0_opsz48.png";
import settingsIcon from "../icons/settings_FILL0_wght400_GRAD0_opsz48.png";
import logoutIcon from "../icons/power_settings_new_FILL0_wght400_GRAD0_opsz48.png";
import arrowIcon from "../icons/arrow_forward_ios_FILL0_wght400_GRAD0_opsz48.png";
import $ from "jquery";

let open = false;
let firstTime = true;

const hideSidebar = () => {
  if (open) {
    $("#profile").slideToggle();
    $("#settings").slideToggle();
    $("#logout").slideToggle();

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

    open = false;
  } else {

    if (firstTime) {
      $("#options").append(`
    <div id="profile" >
      <img src=${profileIcon} alt="Profile" />
      <p>Profile</p>
    </div>
    <div id="settings" >
      <img src=${settingsIcon} alt="Settings" />
      <p>Settings</p>
    </div>
    <div id="logout" >
      <img src=${logoutIcon} alt="Logout" />
      <p>Logout</p>
    </div>`);

      $("#profile").css({
        gridRow: 2,
        display: "none",
        gridTemplateColumns: " 30% 70%",
        alignItems: "center",
        pl: "5%",
      });
      $("#settings").css({
        gridRow: 3,
        display: "none",
        gridTemplateColumns: " 30% 70%",
        alignItems: "center",
        pl: "5%",
      });
      $("#logout").css({
        gridRow: 5,
        display: "none",
        gridTemplateColumns: " 30% 70%",
        alignItems: "center",
        pl: "5%",
      });
      $("p").css({
        margin: "auto auto auto 10%",
      });
      firstTime = false;
    }

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

    open = true;
  }
};

function Sidebar() {
  return (
    <nav className="navbar">
      <div id="close-open" onClick={hideSidebar}>
        <img id="close-arrow" src={arrowIcon} alt="Close" />
      </div>
      <div id="options"></div>
    </nav>
  );
}

export default Sidebar;
