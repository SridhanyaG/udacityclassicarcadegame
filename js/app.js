let possibleYs = [230, 150, 60];
let xUpperLimit = 400;
let yUpperLimit = 400;
let xLowerLimit = 0;
let yLowerLimit = 60;
let colspace = 100;
let rowspace = 82;
let keyListenerFunction =  function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
};
// Enemies our player must avoid
var Enemy = function(ypos) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = 0;
    this.y = possibleYs[ypos];
    this.col = 0;
    this.row = ypos + 2;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x < xUpperLimit + 100 ) 
      this.x = this.x + (100 * dt); 
    else
      this.x = 0; 
    this.computeColInfoBasedOnXY()
    compareLocationWithEnemies()
};

// colspace is 100
Enemy.prototype.computeColInfoBasedOnXY = function () {
  if (this.x > 0 && this.x <= 80) {
      this.col = 0
    };
    if (this.x > 80 && this.x <= 190) {
      this.col = 1
    };
    if (this.x > 190 && this.x <= 280) {
      this.col = 2
    };
    if (this.x > 280 && this.x <= 360) {
      this.col = 3
    };
    if (this.x > 360 && this.x <= 440) {
      this.col = 4
    };
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function (sprite, x, y, successAttempts, failureAttempts) {
  this.sprite = sprite;
  this.x = x;
  this.y = y;
  this.successAttempts = successAttempts;
  this.failureAttempts = failureAttempts;
  this.totalAllowedAttempts = 5;
  this.row = 0;
  this.col = 0;
  this.resetProcessing = false;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
allEnemies = []
// creating a delay in enemies adding to the array
window.setTimeout(function (self) {
  self.push(new Enemy(1)); 
}, 500, allEnemies);
window.setTimeout(function (self) {
  self.push(new Enemy(2)); 
}, 2500, allEnemies);
window.setTimeout(function (self) {
  self.push(new Enemy(0)); 
}, 3500, allEnemies);
var player = new Player('images/char-boy.png', 0, 405, 0, 0);

// player methods

Player.prototype.update = function(dt) {
  if (this.y < 0 && this.resetProcessing === false) {
    this.resetProcessing = true;
    // after a small delay move it back to start position
    window.setTimeout(function (self) {
      self.y = yUpperLimit;
      self.row=0;
      self.incrementSuccessCount();
      self.resetProcessing = false;
    }, 200, this);
  }
}

Player.prototype.handleInput = function(key) {
  if (key == 'up' && this.y > yLowerLimit) {
        this.y = this.y - rowspace;
        this.row += 1;
    }
    if (key == 'down' && this.y < yUpperLimit) {
        this.y = this.y + rowspace;
        this.row += -1;
    }
    if (key == 'right' && this.x < xUpperLimit) {
        this.x = this.x + colspace;
        this.col += 1;
    }
    if (key == 'left' && this.x > xLowerLimit) {
        this.x = this.x - colspace;
        this.col += -1;
    }
}

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  ctx.font="30px Arial";
  ctx.fillText('Success: ' + this.successAttempts, 350, 90);
  ctx.fillText('Failed: ' + this.failureAttempts, 200, 90);
  ctx.fillText('Reserve: ' + this.totalAllowedAttempts, 0, 90);
  ctx.fillStyle = 'red';
}

Player.prototype.incrementSuccessCount = function() {
  this.successAttempts++;
  this.totalAllowedAttempts -= 1;
  this.stopGameIfReserveIsEmpty();
}

Player.prototype.incrementFailureCount = function() {
  this.failureAttempts++;
  this.totalAllowedAttempts -= 1;
  this.stopGameIfReserveIsEmpty();
}

Player.prototype.stopGameIfReserveIsEmpty = function() {
  if (this.totalAllowedAttempts <= 0) {
    allEnemies = []
    document.removeEventListener('keyup', keyListenerFunction);
  }
}
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', keyListenerFunction);

function compareLocationWithEnemies() {
  for(let enemy of allEnemies) {
    if (player.row === enemy.row && enemy.col === player.col) {
      player.y = yUpperLimit;
      player.incrementFailureCount()
      player.row = 0
    }
  }
}