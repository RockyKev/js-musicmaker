//load music
document.addEventListener("DOMContentLoaded", function(){

  console.log("music loaded")
  const audio = document.querySelector("#intro");
  audio.currentTime = 0;
  // audio.play()

});





function playAudio(e) {

  //   const audio = document.querySelector(`audio [data-key="${e.keyCode}"]`);
  const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
  const key = document.querySelector(`.key[data-key="${e.keyCode}"]`);
  console.log(e.keyCode);

  //if there's no audio, return nothing
  if (!audio) return;

  //set it to start playing rom the beginnin
  audio.currentTime = 0;
  audio.play();

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
