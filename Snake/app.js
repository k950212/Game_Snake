const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
//getContext() method 會回傳一個canvas 的drawing context
//drawing context 可以用來在canvas 中畫圖
const unit = 20; //蛇一格單位
const row = canvas.height / unit; //320/20=16
const column = canvas.width / unit; //320/20=16

let snake = []; //array 中的每個元素，都是一個物件
function createSnake() {
  //物件的工作是，儲存身體的x y 座標
  snake[0] = {
    x: 80,
    y: 0,
  };

  snake[1] = {
    x: 60,
    y: 0,
  };

  snake[2] = {
    x: 40,
    y: 0,
  };

  snake[3] = {
    x: 20,
    y: 0,
  };
}

class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }
  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  pickALocation() {
    //選定一個新位置 不與蛇重疊
    let overlapping = false;
    let new_x;
    let new_y;

    function checkOverlap(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_x == snake[i].x && new_y == snake[i].y) {
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }

    do {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      checkOverlap(new_x, new_y);
    } while (overlapping);

    this.x = new_x;
    this.y = new_y;
  }
}
createSnake(); //初始設定

let myFruit = new Fruit();

window.addEventListener("keydown", changeDirection);
let d = "Right";

function changeDirection(e) {
  if (e.key == "ArrowRight" && d != "Left") {
    //放向是左時無法直接180度向右轉
    d = "Right";
  } else if (e.key == "ArrowLeft" && d != "Right") {
    //放向是右時無法直接180度向左轉
    d = "Left";
  } else if (e.key == "ArrowDown" && d != "Up") {
    d = "Down";
  } else if (e.key == "ArrowUp" && d != "Down") {
    d = "Up";
  }

  //每次按下上下左右鍵之後，在下一幀被畫出之前不接受Keydown事件
  //這樣可以防止連續按鍵導致自殺
  window.removeEventListener("keydown", changeDirection);
}
let highestScore;
loadHighestScore();
let score = 0;

document.getElementById("myScore").innerHTML = "遊戲分數:" + score;
document.getElementById("myScore2").innerHTML = "最高分數:" + highestScore;
function draw() {
  //每次畫圖前 確認蛇有沒有咬到自己
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      alert("遊戲結束");
      return;
    }
  }
  //背景全設定黑色
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  myFruit.drawFruit();

  //畫出蛇
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "lightgreen";
    } else {
      ctx.fillStyle = "lightblue";
    }
    ctx.strokeStyle = "white";

    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    }
    if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    }
    if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    }
    if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }

    //x,y, width, height
    ctx.fillRect(snake[i].x, snake[i].y, 20, 20);
    ctx.strokeRect(snake[i].x, snake[i].y, 20, 20);
  }
  //以目前d變數方向來決定蛇的下一幀要放哪
  let snakeX = snake[0].x; //snake[0]是一個物件，但snake[0].x是一個Number
  let snakeY = snake[0].y;
  if (d == "Left") {
    snakeX -= unit;
  } else if (d == "Up") {
    snakeY -= unit;
  } else if (d == "Right") {
    snakeX += unit;
  } else if (d == "Down") {
    snakeY += unit;
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  //確認蛇是否有吃到果實
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    //重新選定一個新的隨機位置
    myFruit.pickALocation();
    myFruit.drawFruit();
    //畫出新果實
    //更新分數
    score++;
    setHighestScore(score);
    document.getElementById("myScore").innerHTML = "遊戲分數:" + score;
    document.getElementById("myScore2").innerHTML = "最高分數:" + highestScore;
  } else {
    snake.pop();
  }

  snake.unshift(newHead);

  window.addEventListener("keydown", changeDirection);
}

let myGame = setInterval(draw, 100);

function loadHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}
