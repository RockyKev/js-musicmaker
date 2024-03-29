// Loads the IFrame Player API code asynchronously.
var tag = document.createElement("script");
let userCompleteStatus; //for checking status
let player; //for video player

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
  player = new YT.Player("youtube-video", {
    // height: document.querySelector(".grid-video").offsetHeight /2,
    // width: document.querySelector(".grid-video").offsetWidth /2,
    height: 480, 
    width: 640,
    videoId: "6zvIxD4FUTA",
    events: {
      onReady: onPlayerReady
    }
  });
}

// The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();

  //check on load, if the complete button is on or not.
  if (!localStorage.getItem("userComplete")) {
    userCompleteStatus = false;
    localStorage.setItem("userComplete", false);
    console.log("SET the local storage: " + userCompleteStatus);

    //leave button alone
  } else {
    userCompleteStatus = localStorage.getItem("userComplete");
    console.log("got the local storage: " + userCompleteStatus);

    //change button to complete

    const key = document.querySelector(`.key[data-key="68"]`);
    const icons = key.querySelector("kbd").querySelector("i");
    const lowerText = key.querySelector(".sound");

    console.log(key);
    icons.classList.add("im-star", "set-activate");
    icons.classList.remove("im-star-o");
    lowerText.innerText = "COMPLETE!";
  }
}

const switchPlayAndPause = (icons, lowerText) => {
  if (icons.classList.contains("im-play")) {
    icons.classList.add("im-pause");
    icons.classList.remove("im-play");
    lowerText.innerText = "Pause";
    player.playVideo();
  } else {
    icons.classList.add("im-play");
    icons.classList.remove("im-pause");
    lowerText.innerText = "Play";
    player.pauseVideo();
  }
};

const changeSpeedOfVideo = (icons, lowerText) => {
  //Playback rates may include values like 0.25, 0.5, 1, 1.5, and 2.

  let currentSpeed = icons.dataset.speed;
  // const speedArray = ["0.25", "0.5", "0.75", "1", "1.25", "1.5", "1.75", "2"]; -- originally hardcode
  const speedArray = player.getAvailablePlaybackRates();

  /*find the currentSpeed in array and get the index */
  //findIndex takes a function
  const arrayCompare = element => element == currentSpeed;

  //find the index, add one, so it moves from 0.5 -> 1 -> 1.5, etc
  let value = speedArray.findIndex(arrayCompare);
  value += 1;

  //if the value is higher than the array total, loop back to zero
  if (value == speedArray.length) {
    value = 0;
  }

  //Put the indexOf into the values.
  player.setPlaybackRate(parseFloat(speedArray[value]));
  lowerText.innerText = ` Speed (${speedArray[value]}x) `;
  icons.dataset.speed = speedArray[value];
  console.log(`switch to ${speedArray[value]}`);
};

//rate limit the function
let wait500ms = true; //declare in global namespace

const changeVideoMuteUnmute = (icons, lowerText) => {
  if (icons.classList.contains("im-volume-off")) {
    icons.classList.add("im-volume");
    icons.classList.remove("im-volume-off");
    lowerText.innerText = "Unmute";
    console.log("unmute");
    player.unMute();
  } else {
    icons.classList.add("im-volume-off");
    icons.classList.remove("im-volume");
    lowerText.innerText = "Mute";
    console.log("mute");
    player.mute();
  }
};

const skipVideo10sec = timeskip => {
  if (!wait500ms) {
    console.log("slow down tiger");
    return;
  }
  player.seekTo(player.getCurrentTime() + timeskip, true);
  wait500ms = false;

  setTimeout(function() {
    wait500ms = true;
  }, 500);
};

const copyLinkToClipboard = () => {
  const linkText = player.getVideoUrl();

  let dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
  dummy.value = linkText;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);

  console.log(linkText);

  /* Alert the copied text */
  swal("Copied the text: " + linkText);
  // swal("Hello world!");
};

const saveCompletionStatus = (icons, lowerText) => {
  console.log("inside change status");
  console.log(userCompleteStatus);
  console.log(typeof userCompleteStatus);
  userCompleteStatus = localStorage.getItem("userComplete");

  if (userCompleteStatus == "false") {
    icons.classList.add("im-star", "set-activate");
    icons.classList.remove("im-star-o");
    lowerText.innerText = "COMPLETE!";
    localStorage.setItem("userComplete", true);
    console.log("change status - TRUE - complete");
  } else if (userCompleteStatus == "true") {
    icons.classList.add("im-star-o");
    icons.classList.remove("im-star", "set-activate");
    lowerText.innerText = "Mark Complete";
    localStorage.setItem("userComplete", false);
    console.log("change status - FALSE - NOT COMPLETE");
  }
};

function videoController(divContent = null) {
  let dataKeyNumber, dataIcon, dataSound;

  //if blank == exit; else pass values
  if (!divContent) {
    return;
  } else {
    dataKeyNumber = divContent.getAttribute("data-key");
    dataIcon = divContent.querySelector("kbd").querySelector("i");
    dataSound = divContent.querySelector(".sound");
  }

  //if id matches the following, change the graphic
  switch (parseInt(dataKeyNumber)) {
    case 32: //space = change playing or pausnig
      console.log("playing or pausing");
      switchPlayAndPause(dataIcon, dataSound);
      break;

    case 219: //[ key
      console.log("pushed 219");
      skipVideo10sec(-10);
      break;

    case 221: // ] key
      console.log("pushed 32");

      skipVideo10sec(10);
      break;

    case 65: // A key =
      console.log("pushed 219");
      // dataIcon.classList.toggle("rotate");
      // addAutoplayToLocalStorage(true);

      changeSpeedOfVideo(dataIcon, dataSound);

      break;

    case 78: // N key = Mute
      console.log("pushed 32");

      changeVideoMuteUnmute(dataIcon, dataSound);

      break;
    case 67: // C key = Create link
      console.log("pushed 67");

      copyLinkToClipboard();

      break;

    case 68: // D key = set as completed
      saveCompletionStatus(dataIcon, dataSound);

      break;

    default:
      return;
  }
}

function playAudio(e) {
  const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
  const key = document.querySelector(`.key[data-key="${e.keyCode}"]`);

  //exit if not audio
  if (!audio) return;

  //activate custom feature depending on button
  videoController(key);

  //set it to start playing rom the beginning
  audio.currentTime = 0;
  audio.play();
  key.classList.add("playing");
}

function removeTransition(e) {
  if (e.propertyName !== "transform") {
    return;
  }

  this.classList.remove("playing");
}

// passing the div elements into variables
const keys = Array.from(document.querySelectorAll(".key"));
keys.forEach(key => key.addEventListener("transitionend", removeTransition));

window.addEventListener("keydown", playAudio);
