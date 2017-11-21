window.onload = pageLoad;
var defaultSession = 25*60;
var defaultBreak = 5*60;
var sessionTime = defaultSession;
var breakTime = defaultBreak;
var stopped = false;
var playSound = true;
var breakTone = new Audio('/media/beep.mp3');
var sessionTone = new Audio('/media/beep.mp3');
var initialOffset = '630';

function pageLoad() {
  var startButton = document.getElementById("pause");
  var stopButton = document.getElementById("stop");
  var soundButton = document.getElementById("sound");
  var testButton = document.getElementById("test");
  var defaultButton = document.getElementById("default");
  startButton.onclick = start;
  stopButton.onclick = stop;
  soundButton.onclick = toggleSound;
  testButton.onclick = setTest;
  defaultButton.onclick = setDefault;
  var minutes = Math.floor(sessionTime/60);
  var seconds = Math.floor(sessionTime % 60);
  var fSeconds = ("0" + seconds).slice(-2);
  document.getElementById("remainingTime").innerHTML = minutes+":"+fSeconds;
}

function setDefault(){
  stop();
  sessionTime=defaultSession;
  breakTime=defaultBreak;
  var minutes = Math.floor(sessionTime/60);
  var seconds = Math.floor(sessionTime % 60);
  var fSeconds = ("0" + seconds).slice(-2);
  document.getElementById("remainingTime").innerHTML = minutes+":"+fSeconds;
}

function setTest(){
  stop();
  sessionTime=10;
  breakTime=5;
  var minutes = Math.floor(sessionTime/60);
  var seconds = Math.floor(sessionTime % 60);
  var fSeconds = ("0" + seconds).slice(-2);
  document.getElementById("remainingTime").innerHTML = minutes+":"+fSeconds;
}

function toggleSound(){
  if (playSound){
    playSound = false;
    document.getElementById("sound").style.backgroundColor = "#e5e5e5";
  }
  else{
    playSound = true;
    document.getElementById("sound").style.backgroundColor = "#FFFFFF";
  }
}

function reset(){
  var minutes = Math.floor(sessionTime/60);
  var seconds = Math.floor(sessionTime % 60);
  var fSeconds = ("0" + seconds).slice(-2);
  document.getElementById("remainingTime").innerHTML = minutes+":"+fSeconds;
  $(".progress").addClass("notransition");
  $('.progress').css('stroke-dashoffset', initialOffset);
}

function update(now, time){
  var distance = time - now;
  var minutes = Math.floor(distance/60);
  var seconds = Math.floor(distance % 60);
  var fSeconds = ("0" + seconds).slice(-2);
  document.getElementById("remainingTime").innerHTML = minutes+":"+fSeconds;
  $('.progress').css('stroke-dashoffset', initialOffset-((now+1)*(initialOffset/time)));
}

function stop() {
  stopped = true;
  reset();
  document.getElementById("pause").style.visibility="visible";
  document.getElementById("stop").style.visibility="hidden";
}

function start() {
  $(".progress").removeClass("notransition");
  breakTone.play(); breakTone.pause();
  stopped = false;
  var now = 0;
  document.getElementById("pause").style.visibility="hidden";
  document.getElementById("stop").style.visibility="visible";
  update(now, sessionTime);
  var x = setInterval(function() {
    if (stopped){
      clearInterval(x);
    }
    if (!stopped){
      now++;
      update(now, sessionTime);
      if (now == sessionTime) {
        reset();
        clearInterval(x);
        if (playSound){
          breakTone.play();
        }
        window.alert("Time to take a break!");
        takeBreak();
      }
    }
  }, 1000); // end of interval
}

function takeBreak() {
  $(".progress").removeClass("notransition");
  sessionTone.play(); sessionTone.pause();
  stopped = false;
  var now = 0;
  document.getElementById("pause").style.visibility="hidden";
  document.getElementById("stop").style.visibility="visible";
  update(now, breakTime);
  var x = setInterval(function() {
    if (stopped){
      clearInterval(x);
    }
    if (!stopped){
      now++;
      update(now, breakTime);
      if (now == breakTime) {
        reset();
        clearInterval(x);
        if (playSound){
          sessionTone.play();
        }
        window.alert("Time to work!");
        stop();
      }
    }
  }, 1000); // end of interval
}
