const LIST_LEN = 30;

let levels_file = "../data/classical-levels.json";
let players_file = "../data/classical-players.json";
let contact_file = "../data/player-contact.json";
let tag_file = "../data/tags-desc.json";

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
  for (let i = LIST_LEN; i < levels.length; i++) {
    let level = levels[i];
    level.completion = [];

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

  // sort challenges
  list.sort(function(a, b) {
    if (HasTag("REMOVED", a.id) ^ HasTag("REMOVED", b.id)) {
      return HasTag("REMOVED", a.id);
    }
    else {
      return ("" + a.name).localeCompare(b.name);
    }
  })

  var str = "";
  for (let placement in list) {
    let lvl = list[placement];
    str += "<div class='leaderboard-btn";
    if (placement == 0) {
      str += " selected";
    }
    str += "' data-id='" + (+placement + 1) + "'>\
              <h3>\
                <span style='color: var(" + ((HasTag("REMOVED", lvl.id)) ? "--text-note" : "--text-list-default") +"); float: left; padding-left: 25px'>" + lvl.name + "</span>\
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
                <span style='color: var(--text-list-default); float: left'; padding-left: 25px>" + lvl.name + "</span>\
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
      str += "<img src='../resource/img/mobile.png' height='25px' style='position: relative; top: 50%; transform: translateY(-50%)'>"
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
                <img src='../resource/img/" + img + "' width='25px' style='position: relative; top: 50%; transform: translateY(-50%)'>\
              </a>";
    }
    else {
      str += "<img src='../resource/img/broken.png' width='25px' style='position: relative; top: 50%; transform: translateY(-50%)'>";
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
  let lvl = list[dID - 1];
  let img_url = "../resource/img/thumbnail/" + lvl.id + ".jpg";
  
  // load info
  $("#detail-name").html(lvl.name);
  $("#detail-creator").html("by &nbsp" + LoadCreator(lvl.creator));
  $("#detail-rank").html("#" + dID);
  $("#detail-id").html(lvl.id);
  $("#detail-pts").html(lvl.pts);
  $("#detail-len").html(lvl.length);
  $("#detail-song").html(LoadSongStr(lvl.song));
  $("#enj-val").html(GetOpinion(lvl, "enjoyment"));
  $("#ratings-ship .rating").html(GetOpinion(lvl, "ship"));
  $("#ratings-wave .rating").html(GetOpinion(lvl, "wave"));
  $("#ratings-swing .rating").html(GetOpinion(lvl, "swing"));
  $("#ratings-timing .rating").html(GetOpinion(lvl, "timing"));
  $("#ratings-cps .rating").html(GetOpinion(lvl, "cps"));
  $("#ratings-learny .rating").html(GetOpinion(lvl, "learny"));

  CheckImage(img_url, function(exist) {
    if (exist) {
        $("#thumbnail").attr("src", img_url);
    }
    else {
        $("#thumbnail").attr("src", "../resource/img/thumbnail/default.png");
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

  CheckReliability(lvl);
}

// HELPER FUNCTION //

function GetOpinion(lvl_data, type) {
  let tot_weight = 0;
  let tot_sum = 0;
  for (let p of lvl_data.completion) {
    if ("opinion" in p) {
      let opinion = p.opinion;
      if (type in opinion) {
        // get weight
        let w = GetReliability(lvl_data.verifier, p.player);
        // calculate score
        tot_weight += w;
        tot_sum += w * opinion[type];
      }
    }
  }

  // no opinions
  if (tot_weight == 0) {
    switch (type) {
        case "enjoyment": 
        $("#enj-val").css("filter", "hue-rotate(0deg) saturate(0)");
        break;
        case "ship":
        $("#ratings-ship .rating").css("filter", "hue-rotate(0deg) saturate(0)");
        $("#ratings-ship .skillset").css("filter", "hue-rotate(0deg) brightness(0.5) saturate(0.8)");
        RatingTransition($("#ratings-ship .skillset"), 0);
        break;
        case "wave":
        $("#ratings-wave .rating").css("filter", "hue-rotate(0deg) saturate(0)");
        $("#ratings-wave .skillset").css("filter", "hue-rotate(0deg) brightness(0.5) saturate(0.8)");
        RatingTransition($("#ratings-wave .skillset"), 0);
        break;
        case "swing":
        $("#ratings-swing .rating").css("filter", "hue-rotate(0deg) saturate(0)");
        $("#ratings-swing .skillset").css("filter", "hue-rotate(0deg) brightness(0.5) saturate(0.8)");
        RatingTransition($("#ratings-swing .skillset"), 0);
        break;
        case "timing":
        $("#ratings-timing .rating").css("filter", "hue-rotate(0deg) saturate(0)");
        $("#ratings-timing .skillset").css("filter", "hue-rotate(0deg) brightness(0.5) saturate(0.8)");
        RatingTransition($("#ratings-timing .skillset"), 0);
        break;
        case "cps":
        $("#ratings-cps .rating").css("filter", "hue-rotate(0deg) saturate(0)");
        $("#ratings-cps .skillset").css("filter", "hue-rotate(0deg) brightness(0.5) saturate(0.8)");
        RatingTransition($("#ratings-cps .skillset"), 0);
        break;
        case "learny":
        $("#ratings-learny .rating").css("filter", "hue-rotate(0deg) saturate(0)");
        $("#ratings-learny .skillset").css("filter", "hue-rotate(0deg) brightness(0.5) saturate(0.8)");
        RatingTransition($("#ratings-learny .skillset"), 0);
        break;
    }

    return "0.0";
  }
  else {
    let out = (tot_sum / tot_weight).toFixed(1);

    // change color
    let hue = 100 - out * 20;
    let deg = out * 72;
    switch (type) {
        case "enjoyment": 
        $("#enj-val").css("filter", "hue-rotate(" + out * 11 + "deg) saturate(1)");
        break;
        case "ship":
        $("#ratings-ship .rating").css("filter", "hue-rotate(" + hue + "deg) saturate(1)");
        $("#ratings-ship .skillset").css("filter", "hue-rotate(" + hue + "deg) brightness(0.5) saturate(0.8)");
        RatingTransition($("#ratings-ship .skillset"), deg);
        break;
        case "wave":
        $("#ratings-wave .rating").css("filter", "hue-rotate(" + hue + "deg) saturate(1)");
        $("#ratings-wave .skillset").css("filter", "hue-rotate(" + hue + "deg) brightness(0.5) saturate(0.8)");
        RatingTransition($("#ratings-wave .skillset"), deg);
        break;
        case "swing":
        $("#ratings-swing .rating").css("filter", "hue-rotate(" + hue + "deg) saturate(1)");
        $("#ratings-swing .skillset").css("filter", "hue-rotate(" + hue + "deg) brightness(0.5) saturate(0.8)");
        RatingTransition($("#ratings-swing .skillset"), deg);
        break;
        case "timing":
        $("#ratings-timing .rating").css("filter", "hue-rotate(" + hue + "deg) saturate(1)");
        $("#ratings-timing .skillset").css("filter", "hue-rotate(" + hue + "deg) brightness(0.5) saturate(0.8)");
        RatingTransition($("#ratings-timing .skillset"), deg);
        break;
        case "cps":
        $("#ratings-cps .rating").css("filter", "hue-rotate(" + hue + "deg) saturate(1)");
        $("#ratings-cps .skillset").css("filter", "hue-rotate(" + hue + "deg) brightness(0.5) saturate(0.8)");
        RatingTransition($("#ratings-cps .skillset"), deg);
        break;
        case "learny":
        $("#ratings-learny .rating").css("filter", "hue-rotate(" + hue + "deg) saturate(1)");
        $("#ratings-learny .skillset").css("filter", "hue-rotate(" + hue + "deg) brightness(0.5) saturate(0.8)");
        RatingTransition($("#ratings-learny .skillset"), deg);
        break;
    }
    
    return out;
  }
}

function GetReliability(verifier, player) {
  let w = 1;

  // if the player is the verifier
  if (verifier == player) {
    w *= 0.75;
  }

  // if the player beats less than 3 challenges
  if (Object.keys(players[player]).length < 3) {
    w *= 0.5;
  }
  // if the player beats over 10 challenges
  else if (Object.keys(players[player]).length >= 10) {
    w *= 1.2;
  }
  return w;
}

function CheckReliability(lvl_data) {
  let count = 0;
  for (let p of lvl_data.completion) {
    if ("opinion" in p) {
      count++;
    }
  }
  if (count > 2) {
    $("#detail-ratings")
      .css("border-color", "transparent");
    $("#ratings-warning")
      .css("color", "transparent")
      .css("border-color", "transparent")
      .attr("title", "");
    $(":root")
      .css("--rating-bg", "rgba(112, 183, 190, 0.1)");
  }
  else {
    $("#detail-ratings")
      .css("border-color", "var(--text-list-top)");
    $("#ratings-warning")
      .css("color", "var(--text-list-top)")
      .css("border-color", "var(--text-list-top)")
      .attr("title", "資料不足");
    $(":root")
      .css("--rating-bg", "rgba(156, 0, 0, 0.071)");
  }
}

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

function GetIndex(id) {
    for (let level in levels) {
        if (levels[level].id == id) {
            return +level;
        }
    }
}

function HasTag(tag, level) {
  let i = GetIndex(level);
  return levels[i].tags.includes(tag);
}