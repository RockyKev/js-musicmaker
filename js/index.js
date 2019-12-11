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

  console.log(dataIcon);
  console.log("-------");
  console.log(dataSound);

  //if id matches the following, change the graphic
  switch (parseInt(dataKeyNumber)) {
    case 32: //space = change playing or pausnig
      console.log("playing or pausing");

      if (dataIcon.classList.contains("im-play")) {
        dataIcon.classList.add("im-pause");
        dataIcon.classList.remove("im-play");
        dataSound.innerText = "Pause";
      } else {
        dataIcon.classList.add("im-play");
        dataIcon.classList.remove("im-pause");
        dataSound.innerText = "Play";
      }
      break;

    case 219: //[ key
      console.log("pushed 219");

      skipVideo10sec("back");

      break;

    case 221: // ] key
      console.log("pushed 32");

      skipVideo10sec("front");
      break;

    case 65: // A key =
      console.log("pushed 219");
      dataIcon.classList.toggle("rotate");

      addAutoplayToLocalStorage(true);

      break;

    case 78: // N key = switch next video
      console.log("pushed 32");

      break;
    case 67: // C key = turn on captions
      console.log("pushed 67");
      dataIcon.classList.toggle("set-activate");

      if (dataIcon.classList.contains("set-activate")) {
        turnOnCaptions(true);
      } else {
        turnOnCaptions(false);
      }

      break;

    case 68: // D key = set as completed
      if (dataIcon.classList.contains("im-star-o")) {
        dataIcon.classList.add("im-star", "set-activate");
        dataIcon.classList.remove("im-star-o");
        dataSound.innerText = "Pause";
      } else {
        dataIcon.classList.add("im-star-o");
        dataIcon.classList.remove("im-star", "set-activate");
        dataSound.innerText = "Play";
      }

      break;

    default:
      return;
  }
}

function turnOnCaptions(boolean) {}

function addAutoplayToLocalStorage(boolean) {}

function skipVideo10sec(string) {}

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