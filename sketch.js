let mic;
let vol = 0;
let dogFrames = {
  short: [],
  mid: [],
  middle: [],
  long: []
};

let dogs = []; // 保存所有出场的狗
let lastBlowTime = 0;
let blowCooldown = 800;

// 预加载狗狗帧图
function preload() {
  loadDogFrames("short");
  loadDogFrames("mid");
  loadDogFrames("middle");
  loadDogFrames("long");
}

function loadDogFrames(type) {
  for (let i = 1; i <= 2; i++) {
    let filename = `${type}-${String(i).padStart(2, '0')}.png`;
    dogFrames[type].push(loadImage(filename));
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  mic = new p5.AudioIn();
  mic.start();
}

function draw() {
  background(255);

  vol = mic.getLevel();

  // 检测是否可以触发一次吹气动画
  if (vol > 0.08 && millis() - lastBlowTime > blowCooldown) {
    lastBlowTime = millis();
    let dogType = chooseDogType();
    dogs.push(new Dog(dogType));
  }

  // 更新并显示所有狗
  for (let i = dogs.length - 1; i >= 0; i--) {
    dogs[i].update();
    dogs[i].display();

    // 如果走出画面，就移除
    if (dogs[i].x > width + 200) {
      dogs.splice(i, 1);
    }
  }
}

// 根据间隔判断狗狗长度类型
function chooseDogType() {
  let interval = millis() - lastBlowTime;

  if (interval < 1000) return "short";
  else if (interval < 2000) return "mid";
  else if (interval < 3000) return "middle";
  else return "long";
}

// 🐕 Dog 类
class Dog {
  constructor(type) {
    this.type = type;
    this.frames = dogFrames[type];
    this.frameIndex = 0;
    this.lastFrameTime = millis();
    this.frameInterval = 150; // 脚动频率
    this.x = -100;
    this.y = height / 2 + random(-100, 100); // 随机一点高度差
    this.speed = random(1.2, 2.5); // 每只狗速度不一样
  }

  update() {
    this.x += this.speed;

    // 脚动切换
    if (millis() - this.lastFrameTime > this.frameInterval) {
      this.frameIndex = (this.frameIndex + 1) % this.frames.length;
      this.lastFrameTime = millis();
    }
  }

  display() {
    let img = this.frames[this.frameIndex];
    if (img) {
      let scaleFactor = min(1, width / 1920); // 适配大屏幕
      image(img, this.x, this.y, img.width * scaleFactor, img.height * scaleFactor);
    }
  }
}
