// setup canvas

const canvas = document.querySelector('canvas');
const para = document.querySelector('p');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// constructor of Shape
function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;
}

// constructor of balls

function Ball(x, y, velX, velY, color, size, exists) {
  Shape.call(this,x,y,velX,velY,exists);
  this.color = color;
  this.size = size;
}

Ball.prototype = Object.create(Shape.prototype);

Object.defineProperty(Ball.prototype, 'constructor', {
  value: Ball,
  enumerable: false,
  writable: true
});

Ball.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
}

Ball.prototype.update = function() {
    if ((this.x + this.size) >= width) {
      this.velX = -(this.velX);
    }
  
    if ((this.x - this.size) <= 0) {
      this.velX = -(this.velX);
    }
  
    if ((this.y + this.size) >= height) {
      this.velY = -(this.velY);
    }
  
    if ((this.y - this.size) <= 0) {
      this.velY = -(this.velY);
    }
  
    this.x += this.velX;
    this.y += this.velY;

    
}

Ball.prototype.collisionDetect = function() {
  for (let j = 0; j < balls.length; j++) {
    if (!(this === balls[j])) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
      }
    }
  }
}

// constructor of evil

function EvilCircle(x,y,size) {
  Shape.call(this,x,y,20,20,true);
  this.color = 'white';
  this.size = size;
}

EvilCircle.prototype = Object.create(Shape.prototype);

Object.defineProperty(EvilCircle.prototype, 'constructor', {
  value: EvilCircle,
  enumerable: false,
  writable: true
});

EvilCircle.prototype.draw = function() {
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
}

EvilCircle.prototype.checkBounds = function() {
  if ((this.x + this.size) >= width) {
    this.x = width - this.size;
  }

  if ((this.x - this.size) <= 0) {
    this.x = this.size;
  }

  if ((this.y + this.size) >= height) {
    this.y = height - this.size;
  }

  if ((this.y - this.size) <= 0) {
    this.y = this.size;
  }
  
}

EvilCircle.prototype.setControls = function() {
  let _this = this;
  window.onkeydown = function(e) {
    if (e.key === 'a') {
      _this.x -= _this.velX;
    } else if (e.key === 'd') {
      _this.x += _this.velX;
    } else if (e.key === 'w') {
      _this.y -= _this.velY;
    } else if (e.key === 's') {
      _this.y += _this.velY;
    }
  }
}

EvilCircle.prototype.collisionDetect = function() {
  for (let j = 0; j < balls.length; j++) {
    if (balls[j].exists === true) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].exists = false;
        counter--;
      }
    }
  }
}

const ballNumber = 2000;

// ballをカウントする変数を初期化
let counter = ballNumber;

// ボールを生成

let balls = [];

while (balls.length < ballNumber) {
  let size = random(5,10);
  let ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size,width - size),
    random(0 + size,height - size),
    random(-1,1),
    random(-1,1),
    'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
    size,
    true
  );

  balls.push(ball);
}

// evilを生成
evilSize = 100;
evil = new EvilCircle(
  random(0 + evilSize,width - evilSize),
  random(0 + evilSize,height - evilSize),
  evilSize
);

evil.setControls();

// loop関数

function loop() {
    // 毎フレーム透過率0.25の黒を全てにかけることで，ボールの軌跡がだんだん消えていくようにする
    // これによってボールが尾を引くように見える
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);
  
    for (let i = 0; i < balls.length; i++) {
      if(balls[i].exists === true) {
        balls[i].draw();
        balls[i].update();
        balls[i].collisionDetect();
      }
    }

    // evil
    evil.draw();
    evil.checkBounds();
    evil.collisionDetect();

    // paraのupdate
    para.textContent = `Ball count : ${counter}`; 
    
    // 再帰的に呼び出すことでループさせる
    requestAnimationFrame(loop);
}

loop();
