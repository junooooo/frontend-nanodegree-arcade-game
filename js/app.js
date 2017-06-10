"use strict";

// some constants

var BLOCK_WIDTH = 101;
var BLOCK_HEIGHT = 83;
var HEIGHT_OFFSET = 25;
var MAX_WIDTH = BLOCK_WIDTH * 5;
var MAX_HEIGHT = BLOCK_HEIGHT * 6;

// Superclass of player and enemy
var Character = function(sprite) {
    if (typeof this.init === 'function') {
        this.init();
    }
    this.sprite = sprite;
};

// Draw the character on the screen
Character.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Enemies our player must avoid
// Enemy inherits from Character
var Enemy = function(level) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    var enemy = Object.create(Enemy.prototype);
    Character.call(enemy, 'images/enemy-bug.png');
    enemy.speed = Math.random() * 60 * level + 50;
    return enemy;
};

// inherit from Character
Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.init = function () {
    this.x = Math.random() * BLOCK_WIDTH / 2;
    this.y = getRandomInt(1, 3) * BLOCK_HEIGHT - HEIGHT_OFFSET;
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

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
// Player inherits from Character

var Player = function () {
    var player = Object.create(Player.prototype);
    Character.call(player, 'images/char-boy.png');

    player.score = 0;
    player.level = 1;

    return player;
};

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

Player.prototype.init = function () {
    this.x = 200;
    this.y = 400;
};

Player.prototype.update = function () {

    if (this.x < 0) {
        this.x = 0;
    }

    if (this.x > MAX_WIDTH - BLOCK_WIDTH) {
        this.x = MAX_WIDTH - BLOCK_WIDTH;
    }

    if (this.y < 0) {
        this.onSuccess();
    }

    if (this.y > MAX_HEIGHT - BLOCK_HEIGHT) {
        this.y = this.y - BLOCK_HEIGHT;
    }
};

Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function (direction) {
    switch (direction) {
        case 'left':
            this.x -= BLOCK_WIDTH;
            break;
        case 'right':
            this.x += BLOCK_WIDTH;
            break;
        case 'up':
            this.y -= BLOCK_HEIGHT;
            break;
        case 'down':
            this.y += BLOCK_HEIGHT;
            break;
    }
};

Player.prototype.onSuccess = function () {
    showTips('<p>Success!</p> <p>Score + ' + (this.level * 10) + '</p>');

    this.init();
    this.score += this.level * 10;
    this.level++;

    updateLevel(this.level, this.score);

    while (allEnemies.length < Math.ceil(this.level/2)) {
        allEnemies.push(new Enemy(this.level));
    }

    allEnemies.forEach(function (enemy) {
        enemy.init();
    })
};

function updateLevel(level, score) {
    document.querySelector('.level').textContent = level;
    document.querySelector('.score').textContent = score;
}

function showTips(tips) {
    document.querySelector('.tips').innerHTML = tips;
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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
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
