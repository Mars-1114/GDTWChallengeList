const LIST_LEN = 10;

let levels_file = "/data/spam-levels.json";
let players_file = "/data/spam-players.json";
let contact_file = "/data/player-contact.json";
let tag_file = "/data/tags-desc.json";

let levels = [];
let players = {};
let contacts = {};
let tags = {};

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
  let list = [];
  // structure data
  for (let i = 0; i < LIST_LEN; i++) {
    let level = levels[i];
    level.completion = [];
    level.pts = FORMULA(i + 1, LIST_LEN);

    // check player completion
    for (let player in players) {
      let id = level.id;
      let player_data = players[player];
      if (id in player_data) {
        let player_completion = {
          player: player,
          video: player_data[id].video,
          is_mobile: player_data[id].is_mobile,
          completion_date: player_data[id].completion_date
        }
        if ("opinion" in player_data[id]) {
          player_completion.opinion = player_data[id].opinion;
        }
        level.completion.push(player_completion);
      }
    }
    // sort completion
    level.completion.sort((a, b) => {
      var timeA = new Date(a.completion_date).getTime();
      var timeB = new Date(b.completion_date).getTime();
      if (timeA != timeB) {
        return timeA - timeB;
      }
      else {
        return ("" + a.player).localeCompare(b.player);
      }
    });

    list.push(level);
  }

  var str = "";
  for (let placement in list) {
    let lvl = list[placement];
    str += "<div class='leaderboard-btn";
    if (placement == 0) {
      str += " selected";
    }
    str += "' data-id='" + (+placement + 1) + "'>\
              <h3>\
                <span style='width: 40px; color: var(--text-list-default); float: left; text-align: right; padding-right: 20px; padding-left: 15px;'>\
                  #" + (+placement + 1) + "\
                </span>\
                <span style='color: var(--text-list-default); float: left'>" + lvl.name + "</span>\
                <span style='float: right; font-size: 0.9em'>" +
                  lvl.pts + " pts\
                </span>\
              </h3>\
            </div>";
  }
  $("#list").html(str);

  // mobile
  str = "";
  for (let placement in list) {
    let lvl = list[placement];
    str += "<div class='leaderboard-btn' data-id='" + (+placement + 1) + "'>\
              <h3>\
                <span style='width: 40px; color: var(--text-list-default); float: left; text-align: right; padding-right: 20px;'>\
                  #" + (+placement + 1) + "\
                </span>\
                <span style='color: var(--text-list-default); float: left'>" + lvl.name + "</span>\
                <span style='float: right; font-size: 0.9em'>" +
                  lvl.pts + " pts\
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


//list the players of the demon
function listPlayers(players, show_rank = true) {
  // convert to HTML
  let str = "";
  for (let p in players) {
    let player = players[p];
    str += "<div style='height: 30px; width: 98%; line-height: 30px; font-size: 20px; margin: 10px 0;'>\
              <span class='lvl-tag' style='width: 30px; height: 30px; float: left;'>";
    if (player.is_mobile) {
      str += "<img src='/resource/img/mobile.png' height='25px' style='position: relative; top: 50%; transform: translateY(-50%)'>"
    }
    str +=   "</span>";
    if (show_rank) {
      str += "<span class='lvl-place' style='float: left; width: 40px; text-align: center; margin-right: 20px;'>\
                #" + (+p + 1) + "\
              </span>\
              <span class='lvl-name'>";
    }
    else {
      str += "&nbsp&nbsp\
              <span class='lvl-name' style='color: var(--text-list-default); font-weight: bold'>";
    }
    str +=      player.player + "&nbsp&nbsp\
              </span>\
              <span class='lvl-link link' style='float: right; width: 30px; height: 30px;'>";
    // video
    if (player.video != " ") {
      if (player.video.includes("facebook.com") || player.video.includes("fb.watch")) {
        var img = "fb.png";
      }
      else if (player.video.includes("youtube.com")) {
        var img = "yt.png";
      }
      else {
        var img = "link.png";
      }
      str += "<a class='link' href=" + player.video + ">\
                <img src='/resource/img/" + img + "' width='25px' style='position: relative; top: 50%; transform: translateY(-50%)'>\
              </a>";
    }
    else {
      str += "<img src='/resource/img/broken.png' width='25px' style='position: relative; top: 50%; transform: translateY(-50%)'>";
    }
    str += "  </span>";
    if (player.video != " ") {
      str += "<span class='lvl-date' style='float: right; height: 30px; margin-right: 20px; font-size: 15px;'>" + 
                formatDate(player.completion_date) +
              "</span>";
    }
    str += "</div>";
  }
  // no victors
  if (players.length == 0) {
    str += "<div style='text-align: center; font-size: 18px;'><strong>- 尚無人通關 -<strong><div>";
  }
  return str;
}

function loadDetails(dID) {
  let lvl = levels[dID - 1];
  let img_url = "/resource/img/thumbnail/" + lvl.id + ".jpg";
  
  // load info
  $("#detail-name").html(lvl.name);
  $("#detail-creator").html("by &nbsp" + LoadCreator(lvl.creator));
  $("#detail-rank").html("#" + dID);
  $("#detail-id").html(lvl.id);
  $("#detail-pts").html(lvl.pts);
  $("#detail-len").html(lvl.length);
  $("#detail-song").html(LoadSongStr(lvl.song));


  CheckImage(img_url, function(exist) {
    if (exist) {
        $("#thumbnail").attr("src", img_url);
    }
    else {
        $("#thumbnail").attr("src", "/resource/img/thumbnail/default.png");
    }
  });

  $("#detail-tag").html(GetTags(lvl));

  $("#detail-name_mobile").html(lvl.name);
  $("#detail-creator_mobile").html("by &nbsp" + lvl.creator);
  $("#detail-rank_mobile").html("#" + dID);
  $("#detail-id_mobile").html(lvl.id);
  $("#detail-pts_mobile").html(lvl.pts);

  // load completions
  let verifier_index = 0;
  for (let completion of lvl.completion) {
    if (completion.player == lvl.verifier) {
      break;
    }
    verifier_index++;
  }
  let verifier_data = [lvl.completion[verifier_index]];
  let victor_data = lvl.completion.toSpliced(verifier_index, 1);
  $("#detail-verifier").html(listPlayers(verifier_data, false));
  $("#detail-completions").html(listPlayers(victor_data));
  $("#detail-completions_mobile").html(listPlayers(victor_data));
}

// HELPER FUNCTION //
function GetTags(lvl_data) {
  let str = "";
  for (let type in tags) {
    let color = "";
    switch (type) {
      case "Requirement":
        color = "rgba(174, 0, 0, 0.2)";
        break;
      case "Gamemode":
        color = "rgba(3, 180, 200, 0.2)";
        break;
      case "Skillset":
        color = "rgba(147, 0, 157, 0.2)";
        break;
      case "Level":
        color = "rgba(88, 139, 0, 0.2)";
        break;
      case "Others":
        color = "rgba(115, 112, 132, 0.2)";
        break;
    }
    for (let tag in tags[type]) {
      if (tag == "FPS") {
        for (let t of lvl_data.tags) {
          if (t.includes(tag)) {
            str += "<span class='tag' style='border-color: " + setColorOpacity(color, 1) + "; background-color: " + color + "'>\
                      <span>" + t + "</span>\
                      <span class='tag-desc'>" + tags[type][tag][0] + t + tags[type][tag][1] + "</span>\
                    </span>";
          }
        }
      }
      else {
        if (lvl_data.tags.includes(tag)) {
          str += "<span class='tag' style='border-color: " + setColorOpacity(color, 1) + "; background-color: " + color + "'>\
                    <span>" + tag + "</span>\
                    <span class='tag-desc'>" + tags[type][tag] + "</span>\
                  </span>";
        }
      }
    }
  }
  
  $("#detail-tag").html(str);
}

