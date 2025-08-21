const navArr = {
  "Classical": {
    "Classical": "classical.html",
    //"Pack": "classical-pack.html",
    "Leaderboard": "classical-leaderboard.html",
    "Legacy": "classical-legacy.html"
  },
  "Platformer": {
    "Platformer": "plat.html",
    "Leaderboard": "plat-leaderboard.html",
    //"Legacy": "plat-legacy.html"
  },
  "Spam": {
    "Spam": "spam.html",
    "Leaderboard": "spam-leaderboard.html",
    "Legacy": "spam-legacy.html"
  },
  "Guidelines": "guidelines.html",
  "About": "about.html"
};

var path = window.location.pathname;
path = path.split("/")[path.split("/").length - 1];

// navigation menu (mobile)
var str = "<button class='menu navdrop'><b>&#9776;</b></button>\
          <div class='navdropMenu'>";
for (let i = 0; i < navArr.length; i++){
  str += "<a class='navdropContent";
  if (path == navArr[i][0]) {
    str += " visiting";
  }
  str += "' target='_self' href='/page/" + navArr[i][0] + "'>" + navArr[i][1] + "</a>";
}
// navigation menu (PC)
str += "</div>\
        <b class='menu-title'>GDTW Challenge List</b>";
for (let category in navArr) {
  if (navArr[category] instanceof Object) {
    let dropdownStr = "<div class='dropdown'>";
    for (let page in navArr[category]) {
      let url = navArr[category][page];
      if (page == category) {
        str += "<div class='dropdown-head' data-tabs='" + (Object.keys(navArr[category]).length - 1) + "'>\
                  <a class='menu' target='_self' href='" + url + "'>" + page + "<span style='float: right; margin-left: 10px;'>⯆</span></a>";
      }
      else {
        dropdownStr += "<a class='menu' style='margin-left: -5px; padding-left: 10px; width: 100%; text-align: left' target='_self' href='" + url + "'>" + page + "</a>";
      }
    }
    str += dropdownStr + "</div></div>";
  }
  else {
    str += "<a class='menu' target='_self' href='" + navArr[category] + "'>" + category + "</a>";
  }
}
for (let i = 0; i < navArr.length; i++){
  str += "<a class='menu";
  if (path == navArr[i][0]) {
    str += " visiting";
  }
  str += "' target='_self' href='" + navArr[i][0] + "'>" + navArr[i][1] + "</a>";
}
// dark mode
/*
str += "<span id='darkmode-switch-container'>\
          <label id='darkmode-switch-display'>\
            <input type='checkbox' id='darkmode-switch-checkbox'>\
            <span id='darkmode-switch'>\
              <span id='darkmode-switch-icon' class='material-symbols-outlined' style='font-size: 20px'>\
                dark_mode\
              </span>\
            </span>\
          </label>\
        </span>";
*/

$("#menuContainer").html(str);

$(".dropdown-head").on("mouseenter", function() {
  let tab_num = +$(this).attr("data-tabs");
  $(this).children(".dropdown").css("opacity", "1").css("height", (tab_num * 50) + "px");
}).on("mouseleave", function() {
  $(this).children(".dropdown").css("opacity", "0").css("height", "0");
});

let dropdownclick = false;

$(".navdrop").on("click", function() {
  if ($(".navdropMenu").css("display") == "none") {
    $(".navdropMenu").css("display", "block");
  }
  else {
    $(".navdropMenu").css("display", "none");
    $(this).trigger("blur");
  }
});

$("body").on("click", ".navdrop, .navdropMenu", function() {
  dropdownclick = true;
})

$("body").on("click", function() {
  if (!dropdownclick) {
    $(".navdropMenu").css("display", "none");
  }
  dropdownclick = false;
})

$(".navdropContent").on("click", function() {
  $(".visiting").removeClass("visiting");
  $(this).addClass("visiting");
});

$(window).on("resize", function() {
  $(".navdropMenu").css("display", "none");
})

let onTop = true;
$("#scroll-to-top").on("click", function() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
  $("#scroll-to-top").css("bottom", "-70px");
});

$(window).on("wheel", function() {
  if ($(window).scrollTop() > 30) {
    onTop = true;
  }
})

$(document).on("scroll", function() {
  if ($(window).scrollTop() < 30) {
    onTop = true;
    $("#scroll-to-top").css("bottom", "-70px");
  }
  else if (onTop) {
    onTop = false;
    $("#scroll-to-top").css("bottom", "0");
  }
})