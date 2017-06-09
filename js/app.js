// some constants

var BLOCK_WIDTH = 101;
var BLOCK_HEIGHT = 83;
var HEIGHT_OFFSET = 40;
var MAX_WIDTH = BLOCK_WIDTH * 5;
var MAX_HEIGHT = BLOCK_HEIGHT * 6;
var PLAY_STEP_WIDTH = 30;


// Enemies our player must avoid
var Enemy = function(level) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.speed = Math.random() * 70 * level + 50;
};

Enemy.prototype.init = function () {
    this.x = Math.random() * BLOCK_WIDTH / 2;
    this.y = Math.random() * BLOCK_HEIGHT * 2.5+ HEIGHT_OFFSET;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;

    if (this.x >= MAX_WIDTH) {
        this.init();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function () {
    this.sprite = 'images/char-boy.png';
    this.score = 0;
    this.level = 1;
};

Player.prototype.init = function () {
    this.x = 200;
    this.y = 400;
};

Player.prototype.update = function () {

    if (this.x < 0) {
        this.x = 0;
    }

    if (this.x > MAX_WIDTH) {
        this.x = MAX_WIDTH;
    }

    if (this.y < 0) {
        this.onSuccess();
    }

    if (this.y > MAX_HEIGHT - BLOCK_HEIGHT) {
        this.y = MAX_HEIGHT - BLOCK_HEIGHT;
    }
};

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function (direction) {
    switch (direction) {
        case 'left':
            this.x -= PLAY_STEP_WIDTH;
            break;
        case 'right':
            this.x += PLAY_STEP_WIDTH;
            break;
        case 'up':
            this.y -= PLAY_STEP_WIDTH;
            break;
        case 'down':
            this.y += PLAY_STEP_WIDTH;
            break;
    }
};

Player.prototype.onSuccess = function () {
    showTips('Success!');
    this.init();
    this.score++;
    this.level++;

    updateLevel(this.level);

    while (allEnemies.length < this.level) {
        allEnemies.push(new Enemy(this.level));
    }

    allEnemies.forEach(function (enemy) {
        enemy.init();
    })
};

function updateLevel(level) {
    document.querySelector('.level').textContent = level;
}

function showTips(tips) {
    document.querySelector('.modal div').textContent = tips;
    toggleModal(true);
    setTimeout(function(){toggleModal(false)}, 1000);
}

function toggleModal(show) {
    if (show) {
        document.querySelector('.modal').removeAttribute('hidden');
    } else {
        document.querySelector('.modal').setAttribute('hidden', '');
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();
var allEnemies = [new Enemy(player.level)];


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
