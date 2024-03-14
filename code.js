const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// constants
const halfWidth = canvas.width / 2;
const halfHeight = canvas.height / 2;
const radRatio = Math.PI/180

// variables
var players = 0;
var selected = 0;
var hasPressed = false;
var hasPressedPlayers = false;
var gaming = false/// if the game is running

// enter button
var enter = false;
var enterPressed = false;
var hasEnter = false; // Track if Enter was pressed in the previous frame

function getRandomInt(max) { // function for generating a random int
  return Math.floor(Math.random() * max);
}

// player constants
const pl = 1 // how far player moves each fram
const pRadius = 5;
const gapSize = 30; // size of the player gaps 
const gapBuffer = 400; // how often gap should happen

// spelar class
class Player {
  constructor(px, py, pa, dx, dy, coordCount, coordCount2, color) {
    this.px = px;
    this.py = py;
    this.pa = pa;
    this.dx = dx;
    this.dy = dy;
    this.coordCount = coordCount;
    this.coordCount2 = coordCount2;
    this.color = color;
    this.playerCoordinates = [];
    this.right = false;
    this.left = false;
    this.clearLine = false;
    this.dead = false;
  }

  drawPlayer() { // function for drawing player

    // draw the circle at players position
    ctx.beginPath();
    ctx.arc(this.px, this.py, pRadius, 0, Math.PI*2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  
    // draw the line that shows player direction 
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle  = "#0";
    ctx.moveTo(this.px, this.py);
    ctx.lineTo(this.px+this.dx*pRadius, this.py+this.dy*pRadius);
    ctx.stroke();
  }

  addCoordinates(x, y) { // Function to add coordinates to the array of cordinates player has been to
    this.playerCoordinates.push({ x, y });
    this.coordCount += 1;
  }

  killCheck(skipCount, p2coords, p3coords, p4coords, radiusClearance) { // function for checking if player has colided with wall or other player, this could be reworked to use a loop that does it for every existing player but im too lazy for that and since theres a fixed number i just copy pasted the code
  
    if (skipCount >= this.playerCoordinates.length) { // skipp some of the first indexes in order to stop player from coliding with themselves
      return false
    }
  
    for (let i = 0; i <= this.playerCoordinates.length - skipCount; i++) { // iterate thgrough this players cordinates and skip some of the newly added in order to stop player from coliding with the last frame
      const coord = this.playerCoordinates[i];
    
      if (Math.sqrt( (Math.round(this.px)-Math.round(coord.x))**2 + (Math.round(this.py)-Math.round(coord.y))**2) <= (pRadius*2)-3) { // check if distance to these points is within the radius of the players current point
        return true
      }
    }

    for (let i = 0; i < p2coords.length; i++) { // itterate through array
      const coord = p2coords[i];
    
      if (Math.sqrt( (Math.round(this.px)-Math.round(coord.x))**2 + (Math.round(this.py)-Math.round(coord.y))**2) <= (pRadius*2)-3) { // check if value in array is within radius of the player
        return true
      }
    }

    for (let i = 0; i < p3coords.length; i++) {
      const coord = p3coords[i];
    
      if (Math.sqrt( (Math.round(this.px)-Math.round(coord.x))**2 + (Math.round(this.py)-Math.round(coord.y))**2) <= (pRadius*2)-3) {
        return true
      }
    }

    for (let i = 0; i < p4coords.length; i++) {
      const coord = p4coords[i];
    
      if (Math.sqrt( (Math.round(this.px)-Math.round(coord.x))**2 + (Math.round(this.py)-Math.round(coord.y))**2) <= (pRadius*2)-3) {
        return true
      }
    }
  
    if (this.px - radiusClearance < 0 || this.px + radiusClearance > canvas.width || this.py - radiusClearance < 0 || this.py + radiusClearance > canvas.height) { // check if player is out of bounds if so return true
      return true
    }
  }

  updatePlayer() { // function for handleing the movement of the player
    if (this.right) { // left and right movement
      this.pa += 1
    } else if (this.left) {
      this.pa -= 1
    }

    this.dx = Math.cos(this.pa*radRatio); // math for calculating dx and dy based on angle
    this.dy = Math.sin(this.pa*radRatio);
  
    this.px += this.dx * pl; // add dx and dy to px and py
    this.py += this.dy * pl;
  
    // code for handleing the gaps
    if (this.coordCount <= gapBuffer) { // if gap is not active add the cordinates to the array and draw the player
      this.addCoordinates(this.px, this.py);
      this.drawPlayer();
      this.clearLine = false;
    } else {
      if (!this.clearLine) { // when a gap is created re draw the frame without the direction line, this is because the screen never actually clears in order to save on memory, so we have to draw over the things that we want removed.
        ctx.beginPath();
        ctx.arc(this.px, this.py, pRadius, 0, Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        this.clearLine = true;
      }
      

      this.coordCount2 += 1; // iterate the buffer
      if (this.coordCount2 >= gapSize) { // reset the buffer
        this.coordCount2 = 0;
        this.coordCount = 0;
      }
    }
  }
}

// create players
p1 = new Player(getRandomInt(canvas.width-200) + 100, getRandomInt(canvas.height-200) + 100, getRandomInt(360), 0, 0, 0, 0, "#0095DD");

p2 = new Player(getRandomInt(canvas.width-200) + 100, getRandomInt(canvas.height-200) + 100, getRandomInt(360), 0, 0, 0, 0, "#FFA836");

p3 = new Player(getRandomInt(canvas.width-200) + 100, getRandomInt(canvas.height-200) + 100, getRandomInt(360), 0, 0, 0, 0, "#6abe30");

p4 = new Player(getRandomInt(canvas.width-200) + 100, getRandomInt(canvas.height-200) + 100, getRandomInt(360), 0, 0, 0, 0, "#d95763");

// all the keyboard stuff, im not gonna comment this since its just basic js and i stole it from the js documentation.
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
function keyDownHandler(e) {
  if(e.key == "w") {
    p1.right = true;
  }
  else if(e.key == "q") {
    p1.left = true;
  }

  if(e.key == "p") {
    p2.right = true;
  }
  else if(e.key == "o") {
    p2.left = true;
  }

  if(e.key == "x") {
    p3.right = true;
  }
  else if(e.key == "z") {
    p3.left = true;
  }

  if(e.key == "m") {
    p4.right = true;
  }
  else if(e.key == "n") {
    p4.left = true;
  }

  if(e.key == "Enter") {
    enter = true;
  }
}

function keyUpHandler(e) {
  if(e.key == "w") {
    p1.right = false;
  }
  else if(e.key == "q") {
    p1.left = false;
  }

  if(e.key == "p") {
    p2.right = false;
  }
  else if(e.key == "o") {
    p2.left = false;
  }

  if(e.key == "x") {
    p3.right = false;
  }
  else if(e.key == "z") {
    p3.left = false;
  }

  if(e.key == "m") {
    p4.right = false;
  }
  else if(e.key == "n") {
    p4.left = false;
  }

  if(e.key == "Enter") {
    enter = false;
  }
}

function enterOnce() { // code i wrote for making the enter bool only be triggered for one frame, making it a wasPressed and not pressed
  if (hasEnter == true) {
    enterPressed = false
  }
  if (hasEnter == false) {
    if (enter) {
      enterPressed = true
      hasEnter = true
    } 
  } else if (!enter) {
    hasEnter = false
  }
}

// load all the images
var background = new Image();
background.src = "img/menuBG.png";

var startIMG = new Image();
startIMG.src = "img/startBTN.png";

var startIMGoverlay = new Image();
startIMGoverlay.src = "img/startBTNoverlay.png";

var playersText = new Image();
playersText.src = "img/playersText.png";

var playersTextOverlay = new Image();
playersTextOverlay.src = "img/playersTextOverlay.png";

var img2 = new Image();
img2.src = "img/2.png";

var img3 = new Image();
img3.src = "img/3.png";

var img4 = new Image();
img4.src = "img/4.png";

var p1W = new Image();
p1W.src = "img/p1W.png";

var p2W = new Image();
p2W.src = "img/p2W.png";

var p3W = new Image();
p3W.src = "img/p3W.png";

var p4W = new Image();
p4W.src = "img/p4W.png";

var pressStart = new Image();
pressStart.src = "img/presstostart.png";

// function for the fatality animations
winStaggerFrame = 0; // variable for skipping frames in order for the animation to play at a lower fixed framrate. 
winAnimFrame = 1; // current frame of the sprite sheet
function playerWINAnim(img) { // fucntion that just draws a new section of a sprite sheet, really straight forward. 
  if (winAnimFrame < 11) {
    ctx.drawImage(img, winAnimFrame * 381, 0, 381, 176, halfWidth - 191, halfHeight - 88, 381, 176);
    if (winStaggerFrame == 0) {
      winAnimFrame += 1;
      winStaggerFrame = 15;
    } else {
      winStaggerFrame -= 1;
    }  
  } else {
    ctx.drawImage(img, 11 * 381, 0, 381, 176, halfWidth - 191, halfHeight - 88, 381, 176);
  }
}

function mainMenu() { // main menu game state

  // draw the main menu background images with the logo and the snakes and the press start and controlls.
  ctx.fillStyle = "#eeeeee";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(background,0,0); 
  ctx.drawImage(pressStart, halfWidth - 187, canvas.height - 35); 


  // code for scrolling up and down the menu, current menu item is represented by a int "selected" 
  if (hasPressed == false) {
    if (p1.right) {
      if (selected < 1) {
        selected += 1
      }
      hasPressed = true
    } else if (p1.left) {
      if (selected>0) {
        selected -= 1
      }
      hasPressed = true
    }
  } else if (!p1.right && !p1.left) {
    hasPressed = false
  }
  
  if (selected == 0) {  // if selected = 0 draw the first menu item as selected
    ctx.drawImage(startIMGoverlay,halfWidth-161,halfHeight-62); 
    ctx.drawImage(startIMG,halfWidth-137,halfHeight-39); 

    if (enterPressed) { // if start game is selected and enter is pressed start the game
      gaming = true
    }
  } else { // otherwise just draw the star game text without it being selected
    ctx.drawImage(startIMG,halfWidth-137,halfHeight-39); 
  }


  if (selected == 1) { // same thing but for the amount of players
    ctx.drawImage(playersTextOverlay,halfWidth-202,(halfHeight-78)+120); 
    ctx.drawImage(playersText,halfWidth-160,(halfHeight-49)+120); 

    if (players == 0) { // draw the correct number for the amount of players
      ctx.drawImage(img2,halfWidth-29,(halfHeight+48)+120); 
    } else if (players == 1) {
      ctx.drawImage(img3,halfWidth-29,(halfHeight+48)+120); 
    } else {
      ctx.drawImage(img4,halfWidth-29,(halfHeight+48)+120); 
    }

    if (enterPressed) { // if enter is pressed cycle through the amount of players, 2-4
      if (players < 2) {
        players += 1
      } else {
        players = 0
      }
    } 
  } else { // otherwise draw it as deselcted.
    ctx.drawImage(playersText,halfWidth-160,(halfHeight-49)+120); 

    if (players == 0) {
      ctx.drawImage(img2,halfWidth-29,(halfHeight+48)+120); 
    } else if (players == 1) {
      ctx.drawImage(img3,halfWidth-29,(halfHeight+48)+120); 
    } else {
      ctx.drawImage(img4,halfWidth-29,(halfHeight+48)+120); 
    }
  } 
}

function game() { // game loop state
  if(players == 0) {// game state when there is 2 players

    if(p1.dead == false && p2.dead == false) { // if no one is dead update the players
      p1.updatePlayer();
      p2.updatePlayer();
    }
    if (p1.dead == true) { // if player dies play the other pkayers win anim
      playerWINAnim(p2W);
      if (enterPressed) {
        gaming = false; 
      }
    } else if (p2.dead == true) {
      playerWINAnim(p1W);
      if (enterPressed) {
        gaming = false; 
      }
    }

  } else if(players == 1) { // game state when there is 3 players

    if(p1.dead == false) { // if not dead update player 
      if(p2.dead == false || p3.dead == false) {
        p1.updatePlayer();
      }
    }
    if(p2.dead == false) {
      if(p1.dead == false || p3.dead == false) {
        p2.updatePlayer();
      }
    }
    if(p3.dead == false) {
      if(p1.dead == false || p2.dead == false) {
        p3.updatePlayer();
      }
    }

    if (p1.dead == true && p3.dead == true) { // if dead and other player dead play remaining players win animation
      playerWINAnim(p2W);
      if (enterPressed) { // if enter pressed return to main menu
        gaming = false; 
      }
    } else if (p2.dead == true && p3.dead == true) {
      playerWINAnim(p1W);
      if (enterPressed) {
        gaming = false; 
      }
    } else if (p2.dead == true && p1.dead == true) {
      playerWINAnim(p3W);
      if (enterPressed) {
        gaming = false; 
      }
    }
    
  } else if(players == 2) { // game state when there is 4 players
    // same as with 3 players just more copy paste
    if(p1.dead == false) {
      if(p2.dead == false || p3.dead == false || p4.dead == false) {
        p1.updatePlayer();
      }
    }
    if(p2.dead == false) {
      if(p1.dead == false || p3.dead == false || p4.dead == false) {
        p2.updatePlayer();
      }
    }
    if(p3.dead == false) {
      if(p1.dead == false || p2.dead == false || p4.dead == false) {
        p3.updatePlayer();
      }
    }
    if(p4.dead == false) {
      if(p1.dead == false || p2.dead == false || p3.dead == false) {
        p4.updatePlayer();
      }
    }

    if (p1.dead == true && p3.dead == true && p4.dead == true) {
      playerWINAnim(p2W);
      if (enterPressed) {
        gaming = false; 
      }
    } else if (p2.dead == true && p3.dead == true && p4.dead == true) {
      playerWINAnim(p1W);
      if (enterPressed) {
        gaming = false; 
      }
    } else if (p2.dead == true && p1.dead == true && p4.dead == true) {
      playerWINAnim(p3W);
      if (enterPressed) {
        gaming = false; 
      }
    } else if (p1.dead == true && p2.dead == true && p3.dead == true) {
      playerWINAnim(p4W);
      if (enterPressed) {
        gaming = false; 
      }
    }
  }

  // run the function for if a player dies on each player objecy, doesent matter that the not used players are being checked since their arrays are empty and the 0.0001kb of memory i save is not worth the 10min of code
  if(p1.killCheck(pRadius+10, p2.playerCoordinates, p3.playerCoordinates, p4.playerCoordinates, pRadius - 3)) {
    p1.dead = true;
  }
  if(p2.killCheck(pRadius+10, p1.playerCoordinates, p3.playerCoordinates, p4.playerCoordinates,pRadius - 3)) {
    p2.dead = true;
  }  
  if(p3.killCheck(pRadius+10, p1.playerCoordinates, p2.playerCoordinates, p4.playerCoordinates, pRadius - 3)) {
    p3.dead = true;
  }  
  if(p4.killCheck(pRadius+10, p1.playerCoordinates, p2.playerCoordinates, p3.playerCoordinates, pRadius - 3)) {
    p4.dead = true;
  } 
}

var hasCleared = false; // bool for if game has been reset
function megaLoop() { // mega loop where all game states are swithched and all code that runs indefinetly runs in
  enterOnce();

  if (!gaming) { // if gaming is false has cleared is false and mainMenu state is active
    hasCleared = false;
    mainMenu();
  } else if (gaming) {
    if (!hasCleared) { // if just entered game reset everything and re create the player objects along with reset the animation frames also clear the screen
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      staggerFrame = 0;
      winAnimFrame = 1;

      p1 = new Player(getRandomInt(canvas.width-200) + 100, getRandomInt(canvas.height-200) + 100, getRandomInt(360), 0, 0, 0, 0, "#0095DD");

      p2 = new Player(getRandomInt(canvas.width-200) + 100, getRandomInt(canvas.height-200) + 100, getRandomInt(360), 0, 0, 0, 0, "#FFA836");

      p3 = new Player(getRandomInt(canvas.width-200) + 100, getRandomInt(canvas.height-200) + 100, getRandomInt(360), 0, 0, 0, 0, "#6abe30");

      p4 = new Player(getRandomInt(canvas.width-200) + 100, getRandomInt(canvas.height-200) + 100, getRandomInt(360), 0, 0, 0, 0, "#d95763");
    }
    hasCleared = true; // hasCleared is now true so reset cant happen untill another main menu cycle
    game(); // run the game loop
  }

}

const interval = setInterval(megaLoop, 10); // run the mega loop 