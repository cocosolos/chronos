window.onload = pageLoad;
var defaultSession = 25*60;
var defaultBreak = 5*60;
var stopped = false;
var playSound = true;
var breakTone = new Audio('/media/beep.mp3');
var sessionTone = new Audio('/media/beep2.mp3');
var sessionTime = defaultSession;
var breakTime = defaultBreak;
var initialOffset = '630';

function pageLoad() {

    var minutes = Math.floor(sessionTime/60);
    var seconds = Math.floor(sessionTime % 60);
    var fSeconds = ("0" + seconds).slice(-2);
    document.getElementById("remainingTime").innerHTML = minutes+":"+fSeconds;
    var startButton = document.getElementById("pause");
    var stopButton = document.getElementById("stop");
    var soundButton = document.getElementById("sound");
    document.getElementById("stop").style.visibility="hidden";
    startButton.onclick = start;
    stopButton.onclick = stop;
    soundButton.onclick = toggleSound;
    document.getElementById("test").onclick = function(){
      stop();
        sessionTime=10;
        breakTime=5;
        var minutes = Math.floor(sessionTime/60);
        var seconds = Math.floor(sessionTime % 60);
        var fSeconds = ("0" + seconds).slice(-2);
        document.getElementById("remainingTime").innerHTML = minutes+":"+fSeconds;
    };
    document.getElementById("default").onclick = function(){
      stop();
        sessionTime=defaultSession;
        breakTime=defaultBreak;
        var minutes = Math.floor(sessionTime/60);
        var seconds = Math.floor(sessionTime % 60);
        var fSeconds = ("0" + seconds).slice(-2);
        document.getElementById("remainingTime").innerHTML = minutes+":"+fSeconds;
    };
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
  var minutes = Math.floor(sessionTime/60);
  var seconds = Math.floor(sessionTime % 60);
  var fSeconds = ("0" + seconds).slice(-2);
//  sessionTime = defaultSession;
//  breakTime = defaultBreak;
  $('.progress').css('stroke-dashoffset', initialOffset);
  document.getElementById("test").checked = false;
  document.getElementById("remainingTime").innerHTML = minutes+":"+fSeconds;
  document.getElementById("pause").style.visibility="visible";
  document.getElementById("stop").style.visibility="hidden";
}

function start() {
  sessionTone.play(); sessionTone.pause();
  breakTone.play(); breakTone.pause();
  stopped = false;
  var now = 1;
  var endTime = sessionTime;


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
      $('.progress').css('stroke-dashoffset', initialOffset-(now*(initialOffset/sessionTime)));

      if (now > endTime) {
        clearInterval(x);
        $('.progress').css('stroke-dashoffset', initialOffset);
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
  var endTime = breakTime;

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
      $('.progress').css('stroke-dashoffset', initialOffset-(now*(initialOffset/breakTime)));
      if (now > endTime) {
        clearInterval(x);
        $('.progress').css('stroke-dashoffset', initialOffset);
        if (playSound){
          sessionTone.play();
        }
        stop();
      }
    }
  }, 1000); // end of interval
}
