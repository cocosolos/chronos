window.onload = pageLoad;
var defaultSession = 10;
var defaultBreak = 5;
var stopped = false;
var playSound = true;
var breakTone = new Audio('/media/beep.mp3');
var sessionTone = new Audio('/media/beep2.mp3');

function pageLoad() {
    var minutes = Math.floor(defaultSession/60);
    var seconds = Math.floor(defaultSession % 60);
    var fSeconds = ("0" + seconds).slice(-2);
    document.getElementById("remainingTime").innerHTML = minutes+":"+fSeconds;
    var startButton = document.getElementById("pause");
    var stopButton = document.getElementById("stop");
    var soundButton = document.getElementById("sound");
    document.getElementById("stop").style.visibility="hidden";
    startButton.onclick = start;
    stopButton.onclick = stop;
    soundButton.onclick = toggleSound;

}
function toggleSound(){
  if (playSound){
    playSound = false;
    document.getElementById("sound").style.backgroundColor = "#e5e5e5";
  }else{
    playSound = true;
    document.getElementById("sound").style.backgroundColor = "#FFFFFF";
  }
}


function stop() {
  stopped = true;
  var minutes = Math.floor(defaultSession/60);
  var seconds = Math.floor(defaultSession % 60);
  var fSeconds = ("0" + seconds).slice(-2);
  document.getElementById("remainingTime").innerHTML = minutes+":"+fSeconds;
  document.getElementById("pause").style.visibility="visible";
  document.getElementById("stop").style.visibility="hidden";
}

function start() {
  stopped = false;
  var now = 1;
  var endTime = defaultSession;
  document.getElementById("pause").style.visibility="hidden";
  document.getElementById("stop").style.visibility="visible";

  var x = setInterval(function() {
    if (stopped){
      clearInterval(x);
    }
    if (!stopped){
      var distance = endTime - now;
      var minutes = Math.floor(distance/60);
      var seconds = Math.floor(distance % 60);
      var fSeconds = ("0" + seconds).slice(-2);
      document.getElementById("remainingTime").innerHTML = minutes+":"+fSeconds;
      now++;
      if (now > endTime) {
        clearInterval(x);
        if (playSound){
          breakTone.play();
        }
        takeBreak();
      }
    }
  }, 1000); // end of interval
}

function takeBreak() {
  var now = 0;
  var endTime = defaultBreak;

  var x = setInterval(function() {
    if (stopped){
      clearInterval(x);
    }
    if (!stopped){
      var distance = endTime - now;
      var minutes = Math.floor(distance/60);
      var seconds = Math.floor(distance % 60);
      var fSeconds = ("0" + seconds).slice(-2);
      document.getElementById("remainingTime").innerHTML = minutes+":"+fSeconds;
      now++;
      if (now > endTime) {
        clearInterval(x);
        if (playSound){
          sessionTone.play();
        }
        minutes = Math.floor(defaultSession/60);
        seconds = Math.floor(defaultSession % 60);
        fSeconds = ("0" + seconds).slice(-2);
        document.getElementById("remainingTime").innerHTML = minutes+":"+fSeconds;
        document.getElementById("pause").style.visibility="visible";
        document.getElementById("stop").style.visibility="hidden";
      }
    }
  }, 1000); // end of interval
}
