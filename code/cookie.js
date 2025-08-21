// check if light mode is on
if (getCookie("light_mode") == "on") {
  lightmode($("#darkmode-switch-checkbox").prop("checked", true));
  lightmode(true);
}

// darkmode checkbox
$("#darkmode-switch-display").on("click", function() {
  lightmode($("#darkmode-switch-checkbox").prop("checked"));
    
  // set leaderboard selected color
  $(".leaderboard-btn").css("background-color", setColorOpacity($(":root").css("--list-selected"), 0));
  $(".selected").css("background-color", setColorOpacity($(":root").css("--list-selected"), 0.16));
});

/**
 * Search cookie from name.
 * @param {String} name 
 * @returns {String}
 */
function getCookie(name) {
  let cookie_arr = decodeURIComponent(document.cookie).split("; ");
  for (cookie of cookie_arr) {
    let index = cookie.indexOf("=");
    let key = cookie.substring(0, index);
    let val = cookie.substring(index + 1);
    if (key == name) {
      return val;
    }
  }
  return "";
}

/**
 * Toggle light mode
 * @param {Boolean} toggle
 */
function lightmode(toggle) {
  if (toggle) {
    // switch animation
    $("#darkmode-switch").css("left", "36px");
    $("#darkmode-switch-icon").html("light_mode");

    // color
    $(":root")
      .css("--bg", "rgb(238, 254, 255)")
      .css("--menu", "rgb(159, 205, 201)")
      .css("--menu-visit", "rgb(103, 153, 153)")
      .css("--menu-mobile-hover", "rgb(130, 192, 187)")
      .css("--menu-mobile-nav", "rgb(116, 185, 181)")
      .css("--menu-mobile-nav-hover", "rgb(92, 160, 161)")
      .css("--text-default", "black")
      .css("--text-title", "rgb(70, 133, 119)")
      .css("--text-highlight", "rgb(83, 158, 181)")
      .css("--text-highlight-important", "rgb(220, 52, 52)")
      .css("--text-highlight-allow", "rgb(14, 186, 14)")
      .css("--text-note", "rgb(117, 117, 117)")
      .css("--text-platformer", "rgb(123, 45, 172)")
      .css("--text-list-top", "rgb(231, 77, 77)")
      .css("--text-list-main", "rgb(207, 198, 12)")
      .css("--text-list-extended", "rgb(67, 165, 72)")
      .css("--text-list-default", "rgb(85, 150, 152)")
      .css("--text-addition", "rgb(53, 86, 139)")
      .css("--text-removal", "rgb(203, 33, 21)")
      .css("--text-loader", "rgb(31, 57, 82)")
      .css("--link-default", "rgb(131, 7, 156)")
      .css("--link-hover", "rgb(0, 155, 186)")
      .css("--link-menu", "rgb(2, 41, 28)")
      .css("--link-menu-nav-hover", "rgb(211, 255, 240)")
      .css("--link-visit", "rgb(236, 255, 253)")
      .css("--list-base", "rgb(198, 240, 240)")
      .css("--list-border", "rgb(150, 179, 193)")
      .css("--switch", "rgb(232, 255, 182)")
      .css("--switch-base", "rgb(104, 142, 136)")
      .css("--footer", "rgb(207, 243, 239)")
      .css("--scroll-to-top-base", "rgb(133, 181, 178)")
      .css("--list-selected", "rgba(24, 68, 85, 0)")
      .css("--text-leaderboard-detail", "rgb(64, 104, 88)")
      .css("--bg-contact", "rgba(0, 0, 0, 0.08)")
      .css("--bg-switch", "rgba(176, 169, 42, 0.37)")
      .css("--bg-modal", "rgb(186, 224, 225)");

    // set cookie
    document.cookie = "light_mode=on";
  }
  else {
    // switch animation
    $("#darkmode-switch").css("left", "8px");
    $("#darkmode-switch-icon").html("dark_mode");

    // color
    $(":root")
      .css("--bg", "rgb(31, 33, 46)")
      .css("--menu", "rgb(52, 92, 116)")
      .css("--menu-visit", "rgb(81, 149, 191)")
      .css("--menu-mobile-hover", "rgb(46, 78, 101)")
      .css("--menu-mobile-nav", "rgb(105, 152, 149)")
      .css("--menu-mobile-nav-hover", "rgb(85, 125, 123)")
      .css("--text-default", "white")
      .css("--text-title", "rgb(165, 192, 255)")
      .css("--text-highlight", "rgb(199, 227, 255)")
      .css("--text-highlight-important", "rgb(243, 159, 159)")
      .css("--text-highlight-allow", "rgb(89, 214, 89)")
      .css("--text-note", "rgb(170, 170, 170)")
      .css("--text-platformer", "#a27dff")
      .css("--text-list-top", "rgb(195, 77, 77)")
      .css("--text-list-main", "rgb(223, 193, 125)")
      .css("--text-list-extended", "rgb(24, 186, 32)")
      .css("--text-list-default", "rgb(134, 217, 240)")
      .css("--text-addition", "rgb(167, 255, 255)")
      .css("--text-removal", "rgb(235, 110, 101)")
      .css("--text-loader", "rgb(120, 140, 161)")
      .css("--link-default", "rgb(181, 163, 199)")
      .css("--link-hover", "rgb(211, 255, 240)")
      .css("--link-menu", "rgb(207, 207, 207)")
      .css("--link-menu-nav-hover", "rgb(211, 255, 240)")
      .css("--link-visit", "rgb(211, 255, 240)")
      .css("--list-base", "rgb(43, 48, 70)")
      .css("--list-border", "#36444e")
      .css("--switch", "rgb(174, 138, 207)")
      .css("--switch-base", "rgb(29, 52, 60)")
      .css("--footer", "rgb(39, 42, 57)")
      .css("--scroll-to-top-base", "rgb(82, 149, 145)")
      .css("--list-selected", "rgba(132, 161, 255, 0)")
      .css("--text-leaderboard-detail", "rgb(159, 223, 198)")
      .css("--bg-contact", "rgba(255, 255, 255, 0.08)")
      .css("--bg-switch", "rgba(136, 161, 60, 0.226)")
      .css("--bg-modal", "rgb(38, 44, 57)");

    // delete cookie
    document.cookie = "light_mode=; expires=Thu, 01 Jan 1970 00:00:00 UTC"
  }
}