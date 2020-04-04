//This is some p5.js code. Test it out on https://editor.p5js.org/

// amountStations is the number of spots, where coal can be dropped (including the first one with inifinite coal and the target)
// This means, that the task in MPMP has 9 stations 
const amountStations = 9;
// This is the number of stations you can go on one tank. In the MPMP you can go 5 stations.
const maxCoal = 5;

var coalAtStations;
var currentCoal = maxCoal;
var currentStation = 0;

//0: on the forward pass 1: on the backward pass.
var wantToVisitTactic = 0;
var wantToVisitTimes;

var victory = false;

var amountSteps = 0;

function setup() {
  //change the 600 to bigger if you need more space.
  createCanvas(600, 100);
  //change the framerate... 1 is pretty readable while 60 is fast.
  frameRate(10);
  
  (wantToVisitTimes = []).length = amountStations;
  (coalAtStations = []).length = amountStations;
  coalAtStations.fill(0);
  coalAtStations[0] = 1000000;
  
  wantToVisitSetup();
}

function draw() {
  if (!victory) {
    background(220);
    text("coal in train: " + currentCoal, 0, 12);
    for (let i = 0; i < amountStations; i++) {
      let xPos = (i + 0.5) * (width / amountStations);
      if (i === 0) {
        stroke(255, 0, 0);
      } if (i === amountStations - 1) {
        stroke(255, 255, 0);
      }
      if (i === currentStation) {
        stroke(0, 255, 0);
      } 
      strokeWeight(10);
      point(xPos, 40);
      stroke(0);
      strokeWeight(0);
      if(i>0){
        text(coalAtStations[i], xPos - 3, 65);
        text(wantToVisitTimes[i], xPos - 3, 85);
      }
    }
    wantToVisit();

    if (currentStation === amountStations) {
      console.log(amountSteps);
      victory = true;
    }
  }
}

function wantToVisitSetup() {
  for(let i = amountStations - 1, wantedPasses = 1, wantedLoads = 0; i > 0; i--){
    if(amountStations - i - 1 === maxCoal) {
      wantedLoads += 1;
    } else if (amountStations - i - 1 > maxCoal){
      //sooo... yeah... that was some work with whiteboard... I will not explain it here.
      wantedPasses = 2 * wantedLoads + wantedPasses;
      wantedLoads = ceil(wantedPasses / (maxCoal - 2))
    }
    wantToVisitTimes[i] = wantedPasses + wantedLoads;
  }
}

function wantToVisit() {
  if(wantToVisitTactic === 0) {
    if(atStart()) {
      loadMax();
      wtvMoveForward();
    } else if (coalAtCurrent() < wantToVisitTimes[currentStation]) {
      unload(min(currentCoal - 1, wantToVisitTimes[currentStation] - coalAtCurrent()));
      wtvMoveBackward();
      wantToVisitTactic = 1;
    } else {
      load(1);
      wtvMoveForward();
    }
  } else {
    if(currentStation === 0) {
      loadMax();
      wantToVisitTactic = 0;
    } else {
      load(1);
      wtvMoveBackward();
    }
  }
}

function wtvMoveForward() {
  moveForward();
  wantToVisitTimes[currentStation] -= 1;
}

function wtvMoveBackward() {
  moveBackward();
  wantToVisitTimes[currentStation] -= 1;
}

function moveForward() {
  currentCoal -= 1;
  currentStation += 1;
  amountSteps++;
}

function moveBackward() {
  currentCoal -= 1;
  currentStation -= 1;
  amountSteps++;
}

function load(amount) {
  if (coalAtCurrent() > 0) {
    coalAtStations[currentStation] -= amount;
    currentCoal += amount
  }
}

function unload(amount) {
  coalAtStations[currentStation] += amount;
  currentCoal -= amount
}

function loadMax() {
  load(min(coalAtCurrent(), maxCoal - currentCoal));
}

function coalAtCurrent() {
  return coalAtStations[currentStation];
}
    
function atStart() {
  return currentStation === 0;
}