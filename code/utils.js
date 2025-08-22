// HELPER FUNCTIONS //

// compute score
function FORMULA(n, length) {
  if (n > length) {
    return 0;
  }
  var N = (150 - 1) / (length - 1) * (n - 1) + 1;
  return (75.9783 / Math.pow(1.02, N - 50) - 0.4896).toFixed(2);
}

function setColorOpacity(colorStr, opacity) {
  if(colorStr.indexOf("rgb(") == 0)
  {
    var rgbaCol = colorStr.replace("rgb(", "rgba(");
    rgbaCol = rgbaCol.replace(")", ", "+opacity+")");
    return rgbaCol;
  }

  if(colorStr.indexOf("rgba(") == 0)
  {
    var rgbaCol = colorStr.substr(0, colorStr.lastIndexOf(",")+1) + opacity + ")";
    return rgbaCol;
  }

  if(colorStr.length == 6)
    colorStr = "#" + colorStr;

  if(colorStr.indexOf("#") == 0)
  {
    var rgbaCol = 'rgba(' + parseInt(colorStr.slice(-6, -4), 16)
        + ',' + parseInt(colorStr.slice(-4, -2), 16)
        + ',' + parseInt(colorStr.slice(-2), 16)
        + ','+opacity+')';
    return rgbaCol;
  }
  return colorStr;
}

function formatDate(dateStr) {
  let first_deli = dateStr.indexOf("-");
  let second_deli = dateStr.lastIndexOf("-");
  return dateStr.substring(0, first_deli) + "/" + dateStr.substring(first_deli + 1, second_deli) + "/" + dateStr.substring(second_deli + 1);
}

/**
 * 
 * @param {number} sec 
 */
function formatTime(sec) {
  if (sec == 0) {
    return "-";
  }
  let m = String(Math.floor(sec / 60)).padStart(2, "0");
  let s = (sec - m * 60).toFixed(3);
  let str = ""
  if (m != 0) {
    str += m + ":"
    s = s.padStart(6, "0");
  }
  str += s;
  return str;
}

function LoadSongStr(song) {
  let str = "";
  if (song.nong) {
    str += "<a class='link' href='" + song.link + "'>" + song.name + "</a><span style='color: var(--text-note); font-size: 15px;'> &nbsp&nbsp[NONG]</span>";
  }
  else {
    str += song.name + "<span style='color: var(--text-note); font-size: 15px;'> &nbsp&nbsp[" + song.id + "]</span> ";
  }
  return str;
}

function LoadCreator(creator) {
  str = "";
  for (let i = 0; i < creator.length - 1; i++) {
    str += creator[i] + ", &nbsp";
  }
  str += creator[creator.length - 1];
  return str;
}

/**
 * @param {JQuery} target 
 * @param {number} toVal
 */
async function RatingTransition(target, toVal) {
  let fromVal = +target.attr("data-deg");
  target.attr("data-deg", toVal);
  
  // use easing function
  let duration = 500; // milliseconds
  let interval = 20; // step interval, milliseconds
  let t = 0;
  var step = function() {
    let delta = GetQuintOutVal(toVal - fromVal, duration, t + interval) - GetQuintOutVal(toVal - fromVal, duration, t);
    SetDeg(target, GetCurrentDeg(target) + delta);
    if (t >= duration) {
    }
    else {
      t += interval;
      setTimeout(step, interval);
    }
  };

  step();
}

/**
 * @param {JQuery} target 
 * @param {number} val
 */
function SetDeg(target, val) {
  target.css("background", "conic-gradient(var(--text-rating) 0deg, var(--text-rating) " + val + "deg, var(--rating-base) " + val + "deg)");
}

function GetQuintOutVal(len, duration, t) {
  return len * (1 - Math.pow(1 - t / duration, 5));
}

/**
 * @param {JQuery} target 
 */
function GetCurrentDeg(target) {
  let gradientStr = target.css("background");
  let index = gradientStr.indexOf("deg)");
  let temp = gradientStr.substring(0, index);
  index = temp.lastIndexOf(" ");
  let deg = +temp.substring(index + 1);
  return deg;
}

/**
 * 
 * @param {string} url 
 * @param {function(bool)} callback 
 */
function CheckImage(url, callback) {
    let image = new Image();

    image.onload = function()
    {
      callback(true);
    }
    image.onerror = function()
    {
      callback(false);
    }

    image.src = url;
}

function LoadContact(contact) {
  let str = "";
  if ("youtube" in contact) {
    str += "  <a href='" + contact.youtube + "' style='display: inline-block; margin: 2.5px 5px; height: 45px;'>\
                <img height='45px' src='../resource/img/yt_color.png'>\
              </a>";
  }
  if ("facebook" in contact) {
    str += "  <a href='" + contact.facebook + "' style='display: inline-block; margin: 2.5px 0; height: 45px;'>\
                <img height='45px' src='../resource/img/fb_color.png'>\
              </a>";
  }
  if ("gd" in contact) {
    str += "  <span style='position: relative; display: inline-block; width: 50px; text-align: center; top: -2px'>\
                <a href='https://gdbrowser.com/u/" + contact.gd.username + "' style='display: inline-block; margin: 5px 0; height: 40px;'>\
                  <img height='40px' src='../resource/icon/" + contact.gd.icon + ".png'>\
                </a>";
  }
  return str;
}