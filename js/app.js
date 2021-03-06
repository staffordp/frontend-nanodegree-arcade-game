// The World object holds many of the variables and conditions outside the enemy, player, or loot objects.
// This contains elements that specify respawn rates, highscore, loot statistics, etc.

var World = function() {
    this.height = 4;
    this.width = 4;
    this.gameactive = false;
    this.highscore = 0;
    this.lootstats = {
        total: 0,
        max: 3,
        respawntime: 0,
        removeidx: null
    },

    // add audio elements
    this.sound_start = document.getElementById('audio-start');
    this.sound_extra = document.getElementById('audio-exta');
    this.sound_hop = document.getElementById('audio-hop');
    this.sound_plunk = document.getElementById('audio-plunk');
    this.sound_squash = document.getElementById('audio-squash');
    this.sound_time = document.getElementById('audio-squash');
    // this.sound_time = new Audio('./audio/dp_frogger_time.wav');
    // this.sound_start = new Audio('./audio/dp_frogger_coin.wav');
    // this.sound_extra = new Audio('./audio/dp_frogger_extra.wav');
    // this.sound_hop = new Audio('./audio/dp_frogger_hop.wav');
    // this.sound_plunk = new Audio('./audio/dp_frogger_plunk.wav');
    // this.sound_squash = new Audio('./audio/dp_frogger_squash.wav');
    // this.sound_time = new Audio('./audio/dp_frogger_time.wav');
    // this.sound_start.volume = 0.4;
    this.multiplier = 0;
    this.audioEnabled = true;

//  Defines the play grid.
World.prototype.grid = {
    "x": {
        1: 0,
        2: 100,
        3: 200,
        4: 400
    },
    "y": {
        1: 65,
        2: 140,
        3: 230,
        4: 310,
        5: 435
    }
};

// World.prototype.checkSounds = function() {
//     for (x = 0; x < this.audio.length; x++) {
//         var item = this.audio[x];
//         console.log('this.audio[' + x + '] state = ' + item.playState);
//         console.log(this.audio[x]);
//         if (item.playState === 1) {
//             console.log('sound playing. forcing it to stop.')

//         }

//     }

// }

World.prototype.createListeners = function(mobile, multiplier) {
    console.log(multiplier);
    console.log(mobile);
    this.isMobile = mobile;
    this.multiplier = multiplier;

    console.log(this.grid);

    var item;
    console.log('here');
    console.log(Object.keys(this.grid.x).length);
    console.log(this.grid.x[1]);
    // for (i = 1; i < Object.keys(this.grid.x).length; i++) {
    //     item = this.grid.x[i];
    //     // console.log(item);
    //     // console.log(this.multiplier);
    //     this.grid.x[i] = item;
    //     // console.log(this.grid.x[i]);
    // }

    // for (j = 1; j < Object.keys(this.grid.y).length; j++) {
    //         item = this.grid.y[j];
    //         // console.log(item);
    //         // console.log(this.multiplier);
    //         this.grid.y[j] = item * this.multiplier;
    //         console.log(this.grid.y[j]);
    //     }

    // this.grid = this.multiplier * this.grid;
    console.log(this.grid);

    this.canvasElement = document.getElementById('canvas-game');
    this.offsetLeft = ctx.canvas.offsetLeft;
    this.offsetTop = ctx.canvas.offsetTop;
    this.menuElement = document.getElementById('start-touch');
    this.menuElement.addEventListener('click', this.showMenu, false);
    console.log(this.isMobile);

        if (mobile) {
            if (!this.audioEnabled) {
                this.audioEnabled = false;
            }

            this.menuElement.addEventListener('touchstart', function(e) {
                e.preventDefault();
                // the event object has an array
                // named touches; we just want
                // the first touch
                world.showMenu();
            }, false);

            this.canvasElement.addEventListener('touchmove', function(e) {
                // we're not interested in this,
                // but prevent default behaviour
                // so the screen doesn't scroll
                // or zoom
                e.preventDefault();
            }, false);
            this.canvasElement.addEventListener('touchend', function(e) {
                // as above
                console.log('this');
                e.preventDefault();
            }, false);
        };
    }
}

// When invoked, shows the player menu.
World.prototype.showMenu = function() {
    if (this.mobile) {
        if (!this.audioEnabled) {
            this.audioEnabled = true;
        }
        this.menuElement.removeEventListener('touchstart', function(e) {
            e.preventDefault();
            // the event object has an array
            // named touches; we just want
            // the first touch
            world.showMenu();
        }, false);

        this.canvasElement.removeEventListener('touchend', function(e) {
                // as above
                e.preventDefault();
            }, false);
    }

    // Trigger the sounds to load. This is a hack for the autoplay limitation on mobile devices
    for (var x = 0; x < 6; x++) {
        var item = document.getElementsByTagName('audio')[x];
        // console.log(item);
        item.oncanplaythrough=function(){ console.log('can play audio here.');}
        item.load();
    }




    if (!menu.fade) {
        menu.fade = true;
        menu.fade_d = 1;
    }

    if (!menu.show) {
        // menu.show = true;
        menu.init();
        menu.refresh();
    } else {
        menu.init();
    }
};

//  This function is called after player selection.  The actual gameplay starts here.
World.prototype.gameStart = function(choice) {
    // this.checkSounds();


    // soundManager.play('sound_start');

    world.sound_start.play();
    if (choice === 1) {
        player.sprite = 'images/char-boy.png';
    } else {
        player.sprite = 'images/char-cat-girl.png';
    }

    ctx.globalAlpha = 1;
    player.x = 501 / 2 - (player.width / 2);
    player.y = 606 - player.height;
    player.lives = 3;
    player.score = 0;

    allLoot = [];
    this.lootstats = {
        total: 3,
        max: 3,
        respawntime: 0,
        removeidx: null
    };

    allEnemies = [];
    addEnemies(totalEnemies);
    this.addLoot(this.lootstats.total);
    // Add event listeners

    document.addEventListener('keyup', keyPress);
    // listen for touches
    // window.addEventListener("touchstart", handleStart, false);

    // document.addEventListener('touchstart', function(e) {
    //     e.preventDefault();
    //     // the event object has an array
    //     // named touches; we just want
    //     // the first touch
    //     handleStart.set(e.touches[0]);
    // }, false);

    // document.addEventListener('touchend', function(e) {
    //     // as above
    //     e.preventDefault();
    //     // console.log(e.changedTouches[0]);
    //     identifyTouchLoc.set(e.changedTouches[0]);
    // }, false);



    document.getElementById('scoretotal').style.display = "block";
    document.getElementById('toptotal').style.display = "block";
    document.getElementById('livestotal').style.display = "block";
    document.getElementById('game-over').style.display = "none";

    document.getElementById('score').innerHTML = player.score;
    document.getElementById('lives').innerHTML = player.lives;

    // This flags the game for start when the main method is called.
    world.gameactive = true;
};

World.prototype.audioReady = function(e) {
    console.log(e);
    console.log('audio ready for play through');

};

// Game ends function.
World.prototype.gameEnd = function() {
    world.gameactive = false;
    document.removeEventListener('keyup', keyPress);
    document.getElementById('game-over').style.display = "block";
};

//  This aligns the text for the Game Over and Restart text.
World.prototype.alignGameOver = function(multiplier) {
    this.multiplier = multiplier;
    console.log(world.multiplier);
    var x = ctx.canvas.getBoundingClientRect().left;
    var sb = document.getElementById('score-board');
    var go = document.getElementById('game-over');
    var tt = document.getElementById('toptotal');
    var st = document.getElementById('scoretotal');
    var lt = document.getElementById('livestotal');

    var width = ctx.canvas.getBoundingClientRect().width;
    var height = ctx.canvas.getBoundingClientRect().height;
    // var width = engine.actualCanvasWidth;
    console.log(width);
    console.log(x);
    console.log(ctx.canvas.width);

    // Centers the game-over message
    // document.getElementById('game-over').style.left = x + width / 4 + 'px';
    sb.style.width = width + 'px';
    sb.style.marginleft = width / 10 + 'px';



    console.log(go.style.width = width + 'px');
   // document.getElementById('game-over').style.left = x + width / 4 + 'px';
    tt.style.left = x + width / 2.8 + 'px';
    st.style.left = x + width / 1.4 + 'px';
    lt.style.left = x + width / 15 + 'px';
    go.style.top = x + height / 2 + 'px';
    go.style.display = "block";
};

// This function adds the loot to the allLoot array.  It also verifies that no loot will exist
// in the same location.  this sets the individual effects of each loot type.  For instance, Rock
// provides negative points but grants a temporary armor (i.e. the player is sitting on top of the rock
// and therfore will not take damage while the rock still exists.)  Additionally, the heart item grants an additional life.

World.prototype.addLoot = function(amount) {
    var placed = 0,
        maxAttempts = amount * 10,
        x = 0,
        y = 0,
        available = false,
        item,
        idx;
    while (placed < amount && maxAttempts > 0) {
        x = Math.floor((Math.random() * world.width) + 1);
        x = this.grid.x[x];
        y = this.grid.y[Math.floor((Math.random() * this.height) + 1)];
        available = true;
        for (item in allLoot) {
            if (allLoot.hasOwnProperty(item)) {
                idx = allLoot[item];
                if (Math.abs(idx.x - x) < 1 && Math.abs(idx.y - y) < 1) {
                    available = false;
                    break;
                }
            }
        }
        if (available) {
            var intType = Math.floor((Math.random() * 7) + 1),
                loot = new Loot('loot');
            // default loot values
            loot.life = 0;
            loot.death = false;
            loot.deathanimate = 0.5;
            loot.animationend = 0;
            loot.respawntime = 0;

            switch (intType) {
                case 1:
                    loot.name = "gemblue";
                    loot.points = 5;
                    loot.sprite = 'images/Gem Blue.png';
                    loot.hitbox = new Hitbox(3, 58, 93, 105);
                    break;
                case 2:
                    loot.name = "gemorange";
                    loot.points = 10;
                    loot.sprite = 'images/Gem Orange.png';
                    loot.hitbox = new Hitbox(3, 58, 93, 105);
                    break;
                case 3:
                    loot.name = "gemgreen";
                    loot.points = 15;
                    loot.sprite = 'images/Gem Green.png';
                    loot.hitbox = new Hitbox(3, 58, 93, 105);
                    break;
                case 4:
                    loot.name = "heart";
                    loot.points = 0;
                    loot.life = 1;
                    loot.sprite = 'images/Heart.png';
                    loot.hitbox = new Hitbox(7, 48, 88, 89);
                    break;
                case 5:
                    loot.name = "rock";
                    loot.points = -10;
                    loot.sprite = 'images/Rock.png';
                    loot.hitbox = new Hitbox(8, 67, 85, 87);
                    break;
                case 6:
                    loot.name = "key";
                    loot.points = 20;
                    loot.sprite = 'images/Key.png';
                    loot.hitbox = new Hitbox(30, 50, 43, 91);
                    break;
                case 7:
                    loot.name = "star";
                    loot.points = 50;
                    loot.sprite = 'images/Star.png';
                    loot.hitbox = new Hitbox(15, 67, 70, 66);
                    break;
                default:
                    break;
            }
            loot.x = x;
            loot.y = y;
            loot.height = 171;
            loot.width = 101;
            placed += 1;
            allLoot.push(loot);
            world.lootstats.total += 1;
        }
        maxAttempts -= 1;
    }
};

// This function is called when the loot fade timer expires, thus erasing the from the array.
World.prototype.clearLoot = function() {
    var idx = world.lootstats.removeidx,
        type = allLoot[idx].name,
        points = allLoot[idx].points,
        life = allLoot[idx].life;
    allLoot.splice(idx, 1);
    world.lootstats.removeidx = null;
    world.lootstats.total -= 1;
    world.lootstats.respawntime = Math.floor((Math.random() * 5) + 1);
    player.lives += life;
    player.score += points;
    updateScore();

    //Turn off the armor if the rock disappears.
    if (type === 'rock' && player.armor) {
        player.armor = false;
    }
};

//  This function maintains that the  amount of loot on the game board is kept to what the minimum should be.
World.prototype.cycleloot = function() {
    var ct = null;
    var item, currentItem;

    if (allLoot.length < 3) {
        world.addLoot(1);
        if (world.lootstats.respawntime === 0) {
            for (item in allLoot) {
                if (allLoot.hasOwnProperty(item)) {
                    currentItem = allLoot[item];
                    if (currentItem.animate) {
                        if (ct === null || ct < currentItem.respawntime) {
                            ct = currentItem.respawntime;
                        }
                    }
                }
            }
        }
    }
};


// This is called when the player collides with loot.
World.prototype.loseLoot = function(entity, time) {
    var idx = allLoot.indexOf(entity);
    var item = allLoot[idx];

    if (item.name === 'rock') {
        player.armor = true;
        player.armor_x = player.x;
        player.armor_y = player.y;
    }

    world.lootstats.removeidx = allLoot.indexOf(item);
    item.respawntime = time + (item.deathanimate * 1000);
    item.death = true;
    updateScore();
};

// Function to start game after it has already been played at least once.
World.prototype.startOver = function() {
    player = new Player();
};

// Prototype for the player, enemy and loot objects.
var Actor = function(type) {
    this.type = type;
    this.x = 0;
    this.y = 0;
    this.height = 171; // all sprites currently have this height.
    this.width = 101; // all sprites currently have this width;
    this.sprite = null;
    this.life = 0;
    this.death = false;
    this.deathanimate = false;
    this.animationend = 0;
    this.rotate = 0;
    this.animate = false;
    this.animation = null;
    this.death = false;
    this.scale = 1;
    this.scalechange = 0;
    this.scaleup = null;
    this.alpha = 1;
};

// Render for loot, player and enemy objects.
Actor.prototype.render = function() {
    ctx.save();
    if (this.type === 'loot') {
        if (world.lootstats.removeidx !== null) {
            if (allLoot.indexOf(this) === world.lootstats.removeidx) {
                ctx.globalAlpha = this.alpha;
                ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
            }
        }
    } else if (this.type === 'player') {
        if (this.animate) {
            switch (this.animation) {
                case 'death':
                    ctx.globalAlpha = player.alpha;
                    ctx.translate(player.x + player.hitbox.x, player.y + player.hitbox.y);
                    ctx.rotate(player.rotate * Math.PI / 180);
                    ctx.scale(player.alpha, player.alpha);
                    ctx.drawImage(Resources.get(this.sprite), -player.hitbox.x, -player.hitbox.y, this.width, this.height);
                    break;
                case 'jump':
                    var scale_width = this.width / this.scale;
                    var scale_height = this.height / this.scale;
                    ctx.translate(this.x, this.y);
                    ctx.translate(scale_width, scale_height);
                    ctx.scale(this.scale, this.scale);
                    ctx.drawImage(Resources.get(this.sprite), -scale_width, -scale_height, this.width, this.height);
                    break;
                default:
                    break;
            }
        }
    }

    if (this.animation != 'death' && this.animation != 'jump') {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
    }

    if (hitboxEnabled) {
        this.renderHitbox();
    }

    ctx.restore();
};

// If hitbox is enabled, renders it.  Hitbox is used primarily for debug purposes and can be turned
// on or off depending on the variable.
Actor.prototype.renderHitbox = function() {
    ctx.strokeStyle = "red";
    ctx.strokeRect(this.x + this.hitbox.x, this.y + this.hitbox.y, this.hitbox.width, this.hitbox.height);
    ctx.strokeStyle = "black";
};


// This Hitbox object.
var Hitbox = function(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
};

// Loot object that uses the Actor as a prototype.
function Loot(type) {
    Actor.call(this, type);
}

// Enemy object that uses the Actor as a prototype.
function Enemy(type) {
    Actor.call(this, type);
    this.sprite = 'images/enemy-bug.png';
    this.speed = Math.floor(Math.random() * 201);
    //  Uncomment below line to slow enemies down for testing purposes.  Additionally, comment line above.
    //this.speed = 1;
    this.clear = false;
    this.hitbox = new Hitbox(1, 77, 98, 66);

}
// Player object that uses the Actor as a prototype.
function Player(type) {
    Actor.call(this, type);
    this.sprite = 'images/char-boy.png';
    this.speed = 100;
    this.startingx = 501 / 2 - (this.width / 2);
    this.startingy = 606 - this.height;
    // this.startingx = 0;
    // this.startingy=0;
    this.score = 0;
    this.hitbox = new Hitbox(17, 63, 67, 76);
    this.deathanimate = 1;
    this.animationend = 0;
    this.rotate = 0;
    this.alpha = 1;
    this.offset = {
        x: 0,
        y: 0
    };
    this.armor = false;
    this.armor_x = null;
    this.armor_y = null;
    this.reset();
}
// These statements set the Loot, Player, and Enenmy objects to use the Actor prototype.
Loot.prototype = Object.create(Actor.prototype);
Loot.prototype.constructor = Loot;
Enemy.prototype = Object.create(Actor.prototype);
Enemy.prototype.constructor = Enemy;
Player.prototype = Object.create(Actor.prototype);
Player.prototype.constructor = Player;


//  These serieis of updates apply to the object following its render phase.  Includes movement,
//  animation and everything else that needs to be metered by a dt variable.

Enemy.prototype.update = function(dt) {
    var item, currentItem;
    for (item in allEnemies) {
        if (allEnemies.hasOwnProperty(item)) {
            currentItem = allEnemies[item];
            currentItem.x += currentItem.speed * dt;
            if (currentItem.x > 500) { // Check if enemy has reached end of board.
                currentItem.clear = true;
            }
        }
    }
};

Loot.prototype.update = function(dt) {
    var idx;
    idx = allLoot.indexOf(this);
    if (this.animate && this.animation === 'death') {
        this.alpha -= dt;
        if (this.alpha < 0) {
            world.lootstats.removeidx = idx;
            world.clearLoot();
        }
    }
};

//  This update encompasses the many different animations and their effects based on a dt calculation which can be adjusted
//  by altering the coordinating variables.  These include a death animation (self-explanatory), and a jump animation for when yoy
//  player jumps over the water to the magical bonus heaven. It also covers a time-based bonus area of the map where your points
//  are incremented over a variable set of time. Armor (for lack of a beter term) serves as a time-based shield for after
//  you collide with a (AKA step on a) rock.  You step on  the rock so you are above the bug before the rock crumbles away.  Not sold
//  on the idea but it's a start.

Player.prototype.update = function(dt, time) {
    if (this.animate) {
        if (this.animation === 'death') {
            this.rotate += (550 * dt);
            this.offset.x += (550 * dt);
            this.offset.y += (550 * dt);
            this.alpha -= dt;
            this.death = true;
            if (this.alpha <= 0) {
                this.rotate = 0;
                this.animationend = 0;
                this.animation = null;
                this.animate = false;
                this.death = false;
                if (this.lives === 0) {
                    this.reset();
                    world.gameEnd();
                } else {
                    this.reset();
                }
            }
        } else if (this.animation === 'jump') {
            if (this.scaleup) {
                this.scalechange = (this.scale * 1.05 - this.scale);
                this.scale *= 1.05;
                if (this.scale >= 1.5) {
                    this.scaleup = false;
                }
            } else {
                this.scalechange = (this.scale * 0.95 - this.scale);
                this.scale *= 0.95;
                if (this.scale <= 1) {
                    this.score += 100;
                    updateScore();
                    this.reset();
                }
            }
        } else if (this.animation === 'move') {
            // world.sound_hop.play();
            // soundManager.play('sound_hop');
            switch (this.animation_d) {
                case 'left':
                    if (this.anime_dest < this.x) {
                        world.sound_hop.play();
                        this.x -= (dt * 800);
                    } else {
                        this.x = this.anime_dest;
                        this.animation = null;
                        this.animation_d = null;
                        this.animationend = 0;
                    }
                    break;
                case 'right':
                    if (this.anime_dest > this.x) {
                        world.sound_hop.play();
                        this.x += (dt * 800);
                    } else {
                        this.x = this.anime_dest;
                        this.animation = null;
                        this.animation_d = null;
                        this.animationend = 0;
                    }
                    break;
                case 'up':
                    if (this.anime_dest < this.y) {
                        world.sound_hop.play();
                        this.y -= (dt * 800);
                    } else {
                        this.y = this.anime_dest;
                        this.animation = null;
                        this.animation_d = null;
                        this.animationend = 0;
                    }
                    break;
                case 'down':
                    if (this.anime_dest > this.y) {
                        world.sound_hop.play();
                        this.y += (dt * 800);
                    } else {
                        this.y = this.anime_dest;
                        this.animation = null;
                        this.animation_d = null;
                        this.animationend = 0;
                    }
                    break;
                default:
                    break;
            }
        }
    }
    if (this.y <= 0 && this.animation != 'jump') {
        world.sound_time.play();
        // soundManager.play('sound_jump');
        this.score += 100;
        this.animate = true;
        this.animation = 'jump';
        this.scaleup = true;
        this.animationend = time + (this.deathanimate * 1000);
        updateScore();
    }
    if (this.y > 73 && this.y < 256) { // Check if player is in danger zone
        if (this.bonus === false) { // Checks to see if they had already been in zone.
            this.bonus = true;
            this.bonustime = time + (this.bonuswait * 1000);
        } else if (this.bonustime <= time) {
            this.score += this.bonusscore;
            updateScore();
            this.bonustime = time + (this.bonuswait * 1000);
        }
        updateScore();
    } else {
        this.bonus = false;
    }
    if (this.armor) {
        if (this.x != this.armor_x || this.y != this.armor_y) {
            this.armor = false;
            this.armor_x = null;
            this.armor_y = null;
        }
    }
};

// Called to reset the player (beginning of game, player respawn, etc.)
Player.prototype.reset = function() {
    this.height = 171;
    this.width = 101;
    this.x = this.startingx;
    this.y = this.startingy;
    this.bonus = false;
    this.bonustime = 0;
    this.bonusscore = 5;
    this.bonuswait = 2;
    this.hitbox = null;
    this.hitbox = new Hitbox(17, 63, 67, 76);
    this.offset = {
        x: 0,
        y: 0
    };
    this.alpha = 1;
    this.scale = 1;
    this.animate = false;
    this.animation = null;
    this.scalechange = 0;
    this.scaleup = null;
};

// Called when a player loses a life by being collided with an enemy.
Player.prototype.loseLife = function() {
    this.lives -= 1;
    this.death = true;
    this.animation = 'death';
    updateScore();
};

// Player.prototype.checkDirection = function( touchX, touchY ) {
//     console.log(this.x + ', ' + this.y);
//     var distanceX = touchX + player.width / 2 - this.x;
//     // var distanceY = Math.abs(this.y + player.height - touchY);
//     var distanceY = touchY + player.height / 2 - this.y;

//     console.log('x distance: ' + distanceX);
//     console.log('y distance: ' + distanceY);

//     if (Math.abs(distanceX) > Math.abs(distanceY)) {
//         console.log('horizontal move');
//         if (distanceX > 0) {
//             console.log('move right.');
//             this.handleInput('right');
//         } else {
//              console.log('move left.');
//             this.handleInput('left');
//         }
//     } else {
//         console.log('vertical move.');
//         if (distanceY > 0) {
//             console.log('move down.');
//             this.handleInput('down');
//         } else {
//              console.log('move up.');
//             this.handleInput('up');
//         }
//     }

// }

// Keypress function.
function keyPress(event) {
    console.log('key pressed.');
    var allowedKeys = {
        //       32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[event.keyCode]);
}

handleStart = {
    x: 0,
    y: 0,
    tapped :false,

    set: function(data) {
        // console.log(data);
        // console.log(data.pageX);
        // console.log(ctx.canvas.offsetLeft);
        // console.log(ctx.canvas.offsetTop);
        // console.log(world.offsetLeft);

        var up = document.getElementById("up");
        var left = document.getElementById("left");
        var down = document.getElementById("down");
        var right = document.getElementById("right");

        this.x = (data.pageX  - world.offsetLeft);
        this.y = (data.pageY  - world.offsetTop);
        this.tapped = true;
        console.log('Touch start: ' + this.x + ', ' + this.y);

        console.log(data.target);

        if (data.target === up) {
            up.setActive();
            player.handleInput('up');


        } else if (data.target === left) {
            player.handleInput('left');

        } else if (data.target === right) {
            player.handleInput('right');

        } else if (data.target === down) {
            player.handleInput('down');

        }



        // player.checkDirection(this.x, this.y);

    }
};

identifyTouchLoc = {
    x: 0,
    y: 0,
    tapped :false,

    set: function(data) {
        // console.log(data);
        // console.log(data.pageX);
        // console.log(ctx.canvas.offsetLeft);
        // console.log(ctx.canvas.offsetTop);
        // console.log(world.offsetLeft);

        this.x = (data.pageX - world.offsetLeft);
        this.y = (data.pageY - world.offsetTop);
        this.tapped = true;
        // console.log('Touch End: ' + this.x + ', ' + this.y);

        var deltaX = this.x - player.x;
        var deltaY = this.y - player.y;

        // var angle = Math.atan2(deltaY , deltaX);
        // console.log('angle = ' + angle);

    }

};

// function handleStart(evt) {
//   evt.preventDefault();
//   console.log("touchstart.");
//   var el = document.getElementsByTagName("canvas")[0];
//   var ctx = el.getContext("2d");
//   var touches = evt.changedTouches;

//   for (var i = 0; i < touches.length; i++) {
//     console.log("touchstart:" + i + "...");
//     ongoingTouches.push(copyTouch(touches[i]));
//     var color = colorForTouch(touches[i]);
//     ctx.beginPath();
//     ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false);  // a circle at the start
//     ctx.fillStyle = color;
//     ctx.fill();
//     log("touchstart:" + i + ".");
//   }
// }

Player.prototype.handleInput = function(key) {
    if (this.animation === null) {
        switch (key) {
            case "left":
                {
                    this.animate = true;
                    this.animation = 'move';
                    this.animation_d = 'left';
                    this.anime_dest = this.x - this.speed;
                    if (this.anime_dest < world.grid.x[1]) {
                        this.anime_dest = world.grid.x[1];
                    }
                    break;
                }
            case "up":
                {
                    this.animate = true;
                    this.animation = 'move';
                    this.animation_d = 'up';
                    this.anime_dest = this.y - this.speed;
                    break;
                }
            case "down":
                {
                    this.animate = true;
                    this.animation = 'move';
                    this.animation_d = 'down';
                    this.anime_dest = this.y + this.speed;
                    if (this.anime_dest > world.grid.y[5]) {
                        this.anime_dest = world.grid.y[5];
                    }
                    break;
                }
            case "right":
                {
                    this.animate = true;
                    this.animation = 'move';
                    this.animation_d = 'right';
                    this.anime_dest = this.x + this.speed;
                    if (this.anime_dest > world.grid.x[4]) {
                        this.anime_dest = world.grid.x[4];
                    }
                    break;
                }
                // Uncomment the below code to add some keyboard break point.
                // case "space": {
                //    world.gameactive = false;
                //    throw new Error("Game is being paused.");
                //    break;
                // }
            default:
                break;
        }
    }
};

// Should be called every time the score or lives change.  This handles the text on the screen
// to reflect the current lives, score, etc.
function updateScore() {
    document.getElementById('score').innerHTML = player.score;
    if (player.score > world.highscore) {
        world.highscore = player.score;
        document.getElementById('topscore').innerHTML = world.highscore;
    }
    document.getElementById('lives').innerHTML = player.lives;
}

// Populate enemy array function.
function addEnemies(total) {
    for (var idx = 1; idx <= total; idx++) {
        var enemy = new Enemy('enemy');
        enemy.x = 0;
        enemy.y = Math.floor((Math.random() * 250) + 51);
        allEnemies.push(enemy);
    }
}


// Instantiating all variables.
player = new Player('player');
world = new World();
menu = new Menu(["Choose Player", "Jack", "Jill"]);



var hitboxEnabled = false,
    allEnemies = [],
    totalEnemies = 3,
    allLoot = [];

addEnemies(totalEnemies);