var Barrel = require('./barrel');
var Beam = require('./beam');
var MovingObject = require("./movingObject");
var Utils = require('./utils');
var Ladder = require('./ladder');
var Player = require('./player');

var Game = function (DIM_X, DIM_Y, ctx) {
  this.DIM_X = DIM_X;
  this.DIM_Y = DIM_Y;
  this.gameOver = false;
  this.gameWon = false;
  this.gameStart = true;
  this.barrels = [];
  this.addBarrel();
  this.player = new Player({
      pos: [this.DIM_X * 0.02, this.DIM_Y * 0.89],
      game:this
    });
  this.start(ctx);
};

Game.prototype.start = function (ctx) {
  var keystate = {};
  // keep track of keyboard presses
  document.addEventListener("keydown", function(e) {
    keystate[e.keyCode] = true;
  });
  document.addEventListener("keyup", function(e) {
    delete keystate[e.keyCode];
  });
  var can = document.getElementById("canvas");
  can.addEventListener("click", function(e){
    this.gameStart = false;
  });
  var idx = 0;
  var animateCallback = function(){
    this.step(keystate);
    this.draw(ctx);
    if (idx === 200) {
      this.addBarrel(ctx);
      idx = 0;
    }
    idx ++;

    requestAnimationFrame(animateCallback);

  }.bind(this);

  animateCallback();
};

Game.prototype.addBarrel = function(ctx) {
   this.barrels.push(new Barrel({game: this, speed: 1}));
};

Game.prototype.draw = function(ctx) {
  if (this.gameStart) {
    ctx.beginPath();
    ctx.font = "120px Inconsolata";
    ctx.fillStyle = "#0000FF";
    ctx.fillText("Instructions: \n[←] to move blocko left \n[→] to move blocko right \n[↑] to climb the ladder \n[space] to jump", this.DIM_X/5, this.DIM_Y/2);
    ctx.closePath();
  } else if (this.gameWon) {
    ctx.beginPath();
    ctx.font = "120px Inconsolata";
    ctx.fillStyle = "#0000FF";
    ctx.fillText("Game Won!", this.DIM_X/5, this.DIM_Y/2);
    ctx.closePath();
  } else if (this.gameOver) {
    ctx.beginPath();
    ctx.font = "120px Inconsolata";
    ctx.fillStyle = "#0000FF";
    ctx.fillText("Game Over", this.DIM_X/5, this.DIM_Y/2);
    ctx.closePath();

  } else {

    ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
    ctx.fillStyle = "orange";
    ctx.fillRect(0,0,this.DIM_X,this.DIM_Y);
    ctx.fillStyle = "black";
    ctx.fillRect(4,4,this.DIM_X-8,this.DIM_Y-8);
    //home
    ctx.beginPath();
    ctx.fillStyle = "#993300";
    ctx.fillRect(30,40,50,50);
    ctx.closePath();
    ctx.beginPath();
    ctx.fillStyle = "#993300";
    ctx.moveTo(25, 40);
    ctx.lineTo(85, 40);
    ctx.lineTo(55, 10);
    ctx.fill();
    // grid
    for (var i = 0; i < 9; i++) {
      ctx.beginPath();
      ctx.strokeStyle = "white";
      ctx.moveTo(0, this.DIM_Y * (i+1)/9);
      ctx.lineTo(this.DIM_X ,this.DIM_Y * (i+1)/9);
      ctx.lineWidth = 0.1;
      ctx.stroke();
      ctx.closePath();
    }
    for (var i = 0; i < 9; i++) {
      ctx.beginPath();
      ctx.strokeStyle = "white";
      ctx.moveTo(this.DIM_X * (i+1)/9, 0);
      ctx.lineTo(this.DIM_X * (i+1)/9,this.DIM_Y);
      ctx.lineWidth = 0.1;
      ctx.stroke();
      ctx.closePath();
    }
    var beam1 = new Beam({
      startPos: [0, this.DIM_Y * 0.1],
      endPos: [this.DIM_X  * 0.8, this.DIM_Y * 0.15],
      game: this
    });
    var beam2 = new Beam({
      startPos: [this.DIM_X * 0.2, this.DIM_Y * 0.3],
      endPos: [this.DIM_X, this.DIM_Y * 0.25],
      game: this
    });
    var beam3 = new Beam({
      startPos: [0, this.DIM_Y * 0.4],
      endPos: [this.DIM_X  * 0.8, this.DIM_Y * 0.45],
      game: this
    });
    var beam4 = new Beam({
      startPos: [this.DIM_X * 0.2, this.DIM_Y * 0.6 ],
      endPos: [this.DIM_X , this.DIM_Y * 0.55],
      game: this
    });
    var beam5 = new Beam({
      startPos: [0, this.DIM_Y * 0.7],
      endPos: [this.DIM_X  * 0.8, this.DIM_Y * 0.75],
      game: this
    });
    var beam6 = new Beam({
      startPos: [0, this.DIM_Y * 0.90],
      endPos: [this.DIM_X, this.DIM_Y * 0.85 ],
      game: this
    });

    beam1.draw(ctx);
    beam2.draw(ctx);
    beam3.draw(ctx);
    beam4.draw(ctx);
    beam5.draw(ctx);
    beam6.draw(ctx);

    var ladder1 = new Ladder({
      pos: [655, 130],
      game: this
    });
    var ladder2 = new Ladder({
      pos: [230, 265],
      game: this
    });
    var ladder3 = new Ladder({
      pos: [655, 400],
      game: this
    });
    var ladder4 = new Ladder({
      pos: [230, 535],
      game: this
    });
    var ladder5 = new Ladder({
      pos: [655, 670],
      game: this
    });

    ladder1.draw(ctx);
    ladder2.draw(ctx);
    ladder3.draw(ctx);
    ladder4.draw(ctx);
    ladder5.draw(ctx);

    this.player.draw(ctx);

    for (var i = 0; i < this.barrels.length; i++) {
      this.barrels[i].draw(ctx);
    }

  }
};

Game.prototype.moveObjects = function(){
  for (var i = 0; i < this.barrels.length; i++) {
    this.barrels[i].move(this.barrels[i].pos, this.barrels[i].vel);
  }
};
//
Game.prototype.step = function(keystate){
  this.moveObjects();
  this.player.move(keystate);
  this.checkCollisions();
  for (var i = 0; i < this.barrels.length; i++) {
    if(this.barrels[0].pos[1] > this.DIM_Y){
      this.barrels = this.barrels.splice(1,this.barrels.length);
    }
  }
};

Game.prototype.allObjects = function () {
  return [].concat(this.ships, this.asteroids, this.bullets);
};

var distance = function(pos1, pos2) {
  var first = (pos1[0]- pos2[0]) * (pos1[0]- pos2[0]);
  var second = (pos1[1]- pos2[1]) * (pos1[1]- pos2[1]);
  return Math.sqrt(first + second);
};

Game.prototype.checkCollisions = function () {
  var game = this;
  for (var i = 0; i < this.barrels.length; i++) {
    if (distance(this.barrels[i].pos,  this.player.pos) < 23){
      this.gameOver = true;
    }
  }
  if (this.player.pos[0] < 5 || this.player.pos[0] > this.DIM_X - 5 ||
    this.player.pos[1] < 5 || this.player.pos[1] > this.DIM_Y - 5 ) {
    this.gameOver = true;
  }
  if (this.player.pos[0] > 5 && this.player.pos[0] < 90 &&
    this.player.pos[1] > 5 && this.player.pos[1] < 100 ) {
    this.gameWon = true;
  }
};

module.exports = Game;
