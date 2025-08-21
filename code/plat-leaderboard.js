const LIST_LEN = 20;

let levels_file = "/data/plat-levels.json";
let players_file = "/data/plat-players.json";
let contact_file = "/data/player-contact.json";
let tag_file = "/data/tags-desc.json";

let levels = [];
let players = {};
let contacts = {};
let tags = {};

let list = [];

$.getJSON(levels_file, function(data) {
  levels = data["lvl"];
});

$.getJSON(players_file, function(data) {
  players = data;
});

$.getJSON(contact_file, function(data) {
  contacts = data;
});

$.getJSON(tag_file, function(data) {
  tags = data;
})

$(document).ajaxStop(function() {
  // structure data
  for (let player in players) {
    let player_completion = {
      player: player,
      levels: [],
      points: 0,
      count: [0, 0],
      contact: contacts[player]
    };

    for (var level in players[player]) {
      let id = GetIndex(level);
      if (id < 30) {
        player_completion.count[0]++;
      }
      else {
        player_completion.count[1]++;
      }

      if (id != -1) {
        let level_data = {
          level: levels[id].name,
          id: level,
          placement: id + 1,
          video: players[player][level].video,
          date: players[player][level].completion_date,
          is_mobile: players[player][level].is_mobile,
          pts: +FORMULA(id + 1, LIST_LEN)
        }
        player_completion.points += +FORMULA(id + 1, LIST_LEN);
        player_completion.levels.push(level_data);
      }
    }

    player_completion.points = player_completion.points.toFixed(2);

    // sort levels
    player_completion.levels.sort(function(a, b) {
        if (a.placement > LIST_LEN && b.placement > LIST_LEN) {
          return ("" + a.level).localeCompare(b.level);
        }
        return a.placement - b.placement;
      } 
    );
    list.push(player_completion);
  }

  // sort players (according to rule 五.2.i)
  list.sort(function(a, b) {
    // a. POINTS
    if (a.points != b.points) {
      return b.points - a.points;
    }
    // b. HARDEST PLACEMENT
    else if (a.levels[0].placement != b.levels[0].placement) {
      return a.levels[0].placement - b.levels[0].placement;
    }
    // c. CHALLENGE COUNT
    else if (a.levels.length != b.levels.length) {
      return b.levels.length - a.levels.length;
    }
    else {
      // d. HARDEST VIDEO UPLOAD TIME
      let aDate = new Date(a.levels[0].date).getTime();
      let bDate = new Date(b.levels[0].date).getTime();
      if (aDate != bDate) {
        return aDate - bDate;
      }
      // e. PLAYER NAME
      else {
        return ("" + a.player).localeCompare(b.player);
      }
    }
  });

  var str = "";
  for (let rank in list) {
    let player = list[rank];
    str += "<div class='leaderboard-btn";
    if (rank == 0) {
      str += " selected";
    }
    str += "' data-id='" + (+rank + 1) + "'>\
              <h3>\
                <span style='width: 40px; color: var(--text-list-default); float: left; text-align: right; padding-right: 20px; padding-left: 15px;'>" +
                  ((player.points > 0) ? "#" + (+rank + 1) : "&nbsp") + "\
                </span>\
                <span style='color: var(--text-list-default); float: left'>" + player.player + "</span>\
                <span style='float: right; font-size: 0.9em'>" +
                  player.points + " pts\
                </span>\
              </h3>\
            </div>";
  }
  $("#list").html(str);

  // mobile
  str = "";
  for (let rank in list) {
    let player = list[rank];
    str += "<div class='leaderboard-btn' data-id='" + (+rank + 1) + "'>\
              <h3>\
                <span style='width: 40px; color: var(--text-list-default); float: left; text-align: right; padding-right: 20px;'>\
                  #" + (+rank + 1) + "\
                </span>\
                <span style='color: var(--text-list-default); float: left'>" + player.player + "</span>\
                <span style='float: right; font-size: 0.9em'>" +
                  player.points + " pts\
                </span>\
              </h3>\
            </div>\
            <div style='width: 95%; border-bottom: solid 2px var(--list-border); margin: 5px auto;'></div>";
  }
  $("#list_mobile").html(str);

  // load details
  loadDetails(1);

  $(".selected").css("background-color", setColorOpacity($(":root").css("--list-selected"), 0.16));

  // show list
  $(".loaderContainer").css("display", "none");
  $(".content").css("opacity", "100%").css("top", "0");
  $(".addr").css("opacity", "100%");
})

$("#list").on("click", ".leaderboard-btn", function() {
  if (!$(this).hasClass("selected")) {
    $(".selected").css("background-color", setColorOpacity($(":root").css("--list-selected"), 0))
      .removeClass("selected");
    $(this).addClass("selected");
    let col_str = $(this).css("background-color");
    $(this).css("background-color", setColorOpacity(col_str, 0.16));

    $("#detail").scrollTop(0);
    loadDetails(+$(this).attr("data-id"));
  }
});

// popup modal
$("#list_mobile").on("click", ".leaderboard-btn", function() {
  $(".selected").css("background-color", setColorOpacity($(":root").css("--list-selected"), 0))
    .removeClass("selected");
  $("#list .leaderboard-btn[data-id='" + $(this).attr("data-id") + "']")
    .css("background-color", setColorOpacity($(":root").css("--list-selected"), 0.16))
    .addClass("selected");
  loadDetails(+$(this).attr("data-id"));

  $("#detail_mobile").scrollTop(0);

  // display detail
  $("#detail-container_mobile")
    .css("height", "100%")
    .css("opacity", "1");
  
  $("#modal_mobile")
    .css("top", "20px");

  // disable leaderboard scroll
  $("html")
    .css("overflow", "hidden");
});

// close modal
$(document).on("click", function(event) {
  if (!$(event.target).parents("#detail-container_mobile").length && $("#detail-container_mobile").css("opacity") != "0" && !$(event.target).parents("#darkmode-switch-container").length) {
    $("#detail-container_mobile")
      .css("height", "0")
      .css("opacity", "0");
    
    $("#mobile-modal")
      .css("top", "40px");

    $("html")
      .css("overflow", "auto");
  }
});

$(window).on("resize", function() {
    $("#detail-container_mobile")
      .css("height", "0")
      .css("opacity", "0");
    
    $("#mobile-modal")
      .css("top", "40px");

    $("html")
      .css("overflow", "auto");
});

$("#list, #mobile-list").on("mouseenter", ".leaderboard-btn:not(.selected)", function() {
  $(this).css("background-color", setColorOpacity($(":root").css("--list-selected"), 0.05));
}).on("mouseleave", ".leaderboard-btn:not(.selected)", function() {
  $(this).css("background-color", setColorOpacity($(":root").css("--list-selected"), 0));
});

$("#modal-close").on("click", function() {
  $("#detail-container_mobile")
      .css("height", "0")
      .css("opacity", "0");
    
    $("#mobile-modal")
      .css("top", "40px");

    $("html")
      .css("overflow", "auto");
});

$("#detail-tag").on("mouseenter", ".tag", function() {
  let colorStr = $(this).css("border-color");
  $(this).children("span:first-of-type").css("color", colorStr);
}).on("mouseleave", ".tag", function() {
  $(this).children("span:first-of-type").css("color", "var(--text-default)");
});


function listLevels(player, levels) {
  // convert to HTML
  let str = "";
  for (let lvl in levels) {
    let level = levels[lvl];
    if (HasTag("REMOVED", level.id)) continue;
    str += "<div class='" + ((level.placement <= LIST_LEN) ? "" : "legacy") + "' style='height: 30px; width: 98%; line-height: 30px; font-size: 20px; margin: 10px 0;'>\
              <span class='lvl-tag' style='width: 35px; height: 30px; float: left;'>";
    if (level.is_mobile) {
      str += "<img src='/resource/img/mobile.png' height='25px' style='position: relative; top: 50%; transform: translateY(-50%)'>"
    }
    str +=   "</span>\
              <span class='lvl-tag' style='width: 30px; height: 30px; float: left;'>";
    if (IsCreator(player, level.id)) {
      str += "<img src='/resource/img/creator.png' height='25px' style='position: relative; top: 50%; transform: translateY(-50%)'>"
    }
    str +=   "</span>";
    let color = IsVerifier(player, level.id) ? "var(--text-list-default)" : "var(--text-default)";
    str += "<span class='lvl-place' style='float: left; width: 40px; text-align: center; margin-right: 20px; margin-left: 10px; color: " + color + "'>";
            if (level.placement <= LIST_LEN) {
              str += "#" + level.placement;
            }
            else {
              str += "-";
            }
    str += "</span>\
            <span class='lvl-name' style='color: " + color + "'>";
    str +=    level.level + "&nbsp&nbsp\
            </span>\
            <span class='lvl-link link' style='float: right; width: 30px; height: 30px;'>";
    // video
    if (level.video != " ") {
      if (level.video.includes("facebook.com") || level.video.includes("fb.watch")) {
        var img = "fb.png";
      }
      else if (level.video.includes("youtube.com")) {
        var img = "yt.png";
      }
      else {
        var img = "link.png";
      }
      str += "<a class='link' href=" + level.video + ">\
                <img src='/resource/img/" + img + "' width='25px' style='position: relative; top: 50%; transform: translateY(-50%)'>\
              </a>";
    }
    else {
      str += "<img src='/resource/img/broken.png' width='25px' style='position: relative; top: 50%; transform: translateY(-50%)'>";
    }
    str += "  </span>\
              <span class='lvl-date' style=' width: 80px; float: right; height: 30px; margin-right: 20px; font-size: 15px; color: var(--text-note)'>" +
                ((level.video != " ") ? formatDate(level.date) : "&nbsp") +
             "</span>";
    if (level.placement <= LIST_LEN) {
      str += "<span  class='lvl-pts' style='float: right; text-align: right; width: 100px; height: 30px; padding-right: 20px; border-right: solid 3px var(--list-border); margin-right: 20px;'>\
                " + level.pts + " &nbsppts\
              </span>";
    }
    str += "</div>";
  }
  return str;
}

function loadDetails(dID) {
  let player = list[dID - 1];
  
  // load info
  $("#detail-name").html(player.player);
  $("#detail-rank").html("#" + dID);
  $("#detail-pts").html(player.points);
  $("#detail-num").html(player.count[0] + "<span style='color: var(--text-note); font-size: 15px;'> &nbsp&nbsp(+" + player.count[1] + ")</span>");

  // load contact
  $("#detail-status").css("display", player.contact["left-group"] ? "block" : "none");
  $("#contact").html(LoadContact(player.contact));

  // load completions
  $("#detail-completions").html(listLevels(player.player, player.levels));
}

// HELPER FUNCTION //
function GetIndex(id) {
    for (let level in levels) {
        if (levels[level].id == id) {
            return +level;
        }
    }
}

function IsCreator(player, level) {
    let i = GetIndex(level);
    return levels[i].creator.includes(player);
}

function IsVerifier(player, level) {
    let i = GetIndex(level);
    return player == levels[i].verifier;
}

function HasTag(tag, level) {
  let i = GetIndex(level);
  return levels[i].tags.includes(tag);
}