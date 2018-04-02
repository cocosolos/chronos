/*
  timer.js
  Corey Sotiropoulos
  11/20/17

  Core timer functionality
*/

window.onload = pageLoad;
var maxSeconds = 86400;
var maxMinutes = 1440;
var defaultSession = 25*60; // 25 mins
var defaultBreak = 5*60; // 5 mins
var sessionTime = defaultSession;
var breakTime = defaultBreak;
var stopped = true;
var playSound = true;
var breakTone = new Audio('/media/beep.mp3');
var sessionTone = new Audio('/media/beep.mp3');
var initialOffset = '630';
var interval;

function pageLoad() {
  var startButton = document.getElementById("pause");
  var stopButton = document.getElementById("stop");
  var soundButton = document.getElementById("sound");
  var testButton = document.getElementById("test");
  var defaultButton = document.getElementById("default");
  var customButton = document.getElementById("setCustom");
  startButton.onclick = start;
  stopButton.onclick = stop;
  soundButton.onclick = toggleSound;
  testButton.onclick = setTest;
  defaultButton.onclick = setDefault;
  customButton.onclick = setCustom;
  setDefault();
}

function setTest(){ // 10 sec / 5 sec timers for testing
  stop();
  sessionTime=10;
  breakTime=5;
  var minutes = Math.floor((sessionTime/60)%60);
  var seconds = Math.floor(sessionTime % 60);
  var fSeconds = ("0" + seconds).slice(-2);
  document.getElementById("remainingTime").innerHTML = minutes+":"+fSeconds;
}

function setDefault(){
  stop();
  sessionTime=defaultSession;
  breakTime=defaultBreak;
  //document.getElementById("customSession").value = sessionTime;
  document.getElementById("customSession").value = sessionTime/60;
  //document.getElementById("customBreak").value = breakTime;
  document.getElementById("customBreak").value = breakTime/60;
  var hours = Math.floor((sessionTime/60)/60);
  var minutes = Math.floor((sessionTime/60)%60);
  var seconds = Math.floor(sessionTime % 60);
  var fSeconds = ("0" + seconds).slice(-2);
  if (hours > 0){
    var fMinutes = ("0" + minutes).slice(-2);
    document.getElementById("remainingTime").innerHTML = hours+":"+fMinutes+":"+fSeconds;
  }
  else{
    document.getElementById("remainingTime").innerHTML = minutes+":"+fSeconds;
  }
}

function setCustom(){
  stop();
  //var customSession = document.getElementById("customSession").value;
  var customSession = document.getElementById("customSession").value*60;
  //var customBreak = document.getElementById("customBreak").value;
  var customBreak = document.getElementById("customBreak").value*60;
  if (customBreak == '' || customSession == ''){
    //document.getElementById("customSession").value = sessionTime;
    document.getElementById("customSession").value = sessionTime/60;
    //document.getElementById("customBreak").value = breakTime;
    document.getElementById("customBreak").value = breakTime/60;
    window.alert("Both fields are required.");
    return;
  }
  sessionTime = customSession;
  breakTime = customBreak;
  if (sessionTime > maxSeconds){
    sessionTime = maxSeconds;
  }
  if (breakTime > maxSeconds){
    breakTime = maxSeconds;
  }
  var hours = Math.floor((sessionTime/60)/60);
  var minutes = Math.floor((sessionTime/60)%60);
  var seconds = Math.floor(sessionTime % 60);
  var fSeconds = ("0" + seconds).slice(-2);
  if (hours > 0){
    var fMinutes = ("0" + minutes).slice(-2);
    document.getElementById("remainingTime").innerHTML = hours+":"+fMinutes+":"+fSeconds;
  }
  else{
    document.getElementById("remainingTime").innerHTML = minutes+":"+fSeconds;
  }
}

function toggleSound(){
  if (playSound){
    playSound = false;
    document.getElementById("sound").style.backgroundColor = "#e5e5e5";
    document.getElementById("soundButton").className ="glyphicon glyphicon-volume-off";
  }
  else{
    playSound = true;
    document.getElementById("sound").style.backgroundColor = "#FFFFFF";
    document.getElementById("soundButton").className ="glyphicon glyphicon-volume-up";
  }
}

function reset(){
  $(".progress").addClass("notransition");
  var hours = Math.floor((sessionTime/60)/60);
  var minutes = Math.floor((sessionTime/60)%60);
  var seconds = Math.floor(sessionTime % 60);
  var fSeconds = ("0" + seconds).slice(-2);
  if (hours > 0){
    var fMinutes = ("0" + minutes).slice(-2);
    document.getElementById("remainingTime").innerHTML = hours+":"+fMinutes+":"+fSeconds;
  }
  else{
    document.getElementById("remainingTime").innerHTML = minutes+":"+fSeconds;
  }
  setTimeout(function(){$('.progress').css('stroke-dashoffset', initialOffset)},1);
}

function update(now, time){
  if (now > time){
    stop();
  }
  else{
    var distance = time - now;
    var hours = Math.floor((distance/60)/60);
    var minutes = Math.floor((distance/60)%60);
    var seconds = Math.floor(distance % 60);
    var fSeconds = ("0" + seconds).slice(-2);
    if (hours > 0){
      var fMinutes = ("0" + minutes).slice(-2);
      document.getElementById("remainingTime").innerHTML = hours+":"+fMinutes+":"+fSeconds;
    }
    else{
      document.getElementById("remainingTime").innerHTML = minutes+":"+fSeconds;
    }
    $('.progress').css('stroke-dashoffset', initialOffset-((now+1)*(initialOffset/time)));
  }
}

function stop() {
  stopped = true;
  clearInterval(interval);
  reset();
  document.getElementById("base").style.stroke = '#C50105';
  document.getElementById("progress").style.stroke = '#09A101';
  document.getElementById("pause").style.visibility="visible";
  document.getElementById("stop").style.visibility="hidden";
}

function start() {
  $(".progress").removeClass("notransition");
  document.getElementById("base").style.stroke = '#C50105';
  document.getElementById("progress").style.stroke = '#09A101';
  breakTone.play(); breakTone.pause();
  stopped = false;
  var now = 0;
  document.getElementById("pause").style.visibility="hidden";
  document.getElementById("stop").style.visibility="visible";
  update(now, sessionTime);
  interval = setInterval(function() {
    if (stopped){
      clearInterval(interval);
    }
    if (!stopped){
      now++;
      update(now, sessionTime);
      if (now == sessionTime) {
        clearInterval(interval);
        reset();
        if (playSound){
          breakTone.play();
        }
        takeBreak();
      }
    }
  }, 1000); // end of interval
}

function takeBreak() {
  $(".progress").removeClass("notransition");
  document.getElementById("base").style.stroke = '#09A101';
  document.getElementById("progress").style.stroke = '#C50105';
  sessionTone.play(); sessionTone.pause();
  stopped = false;
  var now = 0;
  document.getElementById("pause").style.visibility="hidden";
  document.getElementById("stop").style.visibility="visible";
  update(now, breakTime);
  interval = setInterval(function() {
    if (stopped){
      clearInterval(interval);
    }
    if (!stopped){
      now++;
      update(now, breakTime);
      if (now == breakTime) {
        clearInterval(interval);
        if (playSound){
          sessionTone.play();
        }
      //  window.alert("Time to work!");
        if (document.getElementById("loop").checked){
          $(".progress").addClass("notransition");
          reset();
          start();
        }
        else{
          stop();
        }
      }
    }
  }, 1000); // end of interval
}
