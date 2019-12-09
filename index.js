function playAudio(e) {
  console.log("in play audio");

  //   const audio = document.querySelector(`audio [data-key="${e.keyCode}"]`);
  const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);

  const key = document.querySelector(`.key[data-key="${e.keyCode}"]`);

  console.log(e.keyCode);
  console.log(audio);
  console.log(key);
  //if there's no audio, return nothing
  if (!audio) return;

  //set it to start playing rom the beginnin
  audio.currentTime = 0;
  audio.play();
  console.log(audio);
  0;
  key.classList.add("playing");
}

function removeTransition(e) {
  if (e.propertyName !== "transform") {
    return;
  }

  this.classList.remove("playing");
  console.log(e.propertyName);
}

// passing the div elements into variables
const keys = Array.from(document.querySelectorAll(".key"));
keys.forEach(key => key.addEventListener("transitionend", removeTransition));

window.addEventListener("keydown", playAudio);
