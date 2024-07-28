let board = document.getElementById("board")
let button = document.getElementById("button")
let scoreBlock = document.getElementById("score")

let snake = [[0, 0]]
let foods = []
let currFood = [0, 0]
const speed = {
    "up": [-1, 0],
    "down": [1, 0],
    "left": [0, -1],
    "right": [0, 1]
}
let direction = "right"
let score = 0
let highScore = 0
let interval;
let currSpeed = 1000

document.getElementById("result").style.width = 150 + 'px'

for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
        let box = document.createElement("div")
        box.id = "box" + i + "+" + j
        box.classList.add("box")
        board.appendChild(box)
    }
}

function main() {
    scoreBlock.innerHTML = `Score = ${score}<br>High Score = ${highScore}`

    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
            foods.push([i, j])
            if (document.getElementById("box" + i + "+" + j).classList.contains("active"))
                document.getElementById("box" + i + "+" + j).classList.remove("active")
            if (document.getElementById("box" + i + "+" + j).classList.contains("food"))
                document.getElementById("box" + i + "+" + j).classList.remove("food")
        }
    }

    const index = foods.findIndex(item => item[0] === 0 && item[1] === 0);
    foods.splice(index, 1);

    document.getElementById("box0+0").classList.add("active")
}


function changeDirection(event) {
    const key = event.key;
    if (key === 'ArrowUp' && direction !== 'down')
        direction = 'up';
    if (key === 'ArrowDown' && direction !== 'up')
        direction = 'down';
    if (key === 'ArrowLeft' && direction !== 'right')
        direction = 'left';
    if (key === 'ArrowRight' && direction !== 'left')
        direction = 'right';
}

document.addEventListener('keydown', changeDirection)

function getFood() {
    for (let i = 0; i < snake.length; i++) {
        let idx = foods.findIndex(item => item[0] === snake[i][0] && item[1] === snake[i][1]);
        if (idx !== -1)
            foods.splice(idx, 1);
    }
    const idx = Math.floor(Math.random() * foods.length)
    currFood = foods[idx]
    foods.splice(idx, 1)
    document.getElementById("box" + currFood[0] + "+" + currFood[1]).classList.add("food")
}


function moveSnake() {
    let newHead = [snake[0][0] + speed[direction][0], snake[0][1] + speed[direction][1]]
    if (!checkBoundary(newHead)) {
        document.getElementById("box" + newHead[0] + "+" + newHead[1]).classList.add("active")
        snake.unshift(newHead)
        if (newHead[0] === currFood[0] && newHead[1] === currFood[1]) {
            score++;
            highScore = Math.max(score, highScore)
            scoreBlock.innerHTML = `Score = ${score}<br>High Score = ${highScore}`
            document.getElementById("box" + currFood[0] + "+" + currFood[1]).classList.remove("food")
            getFood()
            if (snake.length % 5 === 0) {
                clearInterval(interval)
                currSpeed = currSpeed / 1.5
                interval = setInterval(moveSnake, currSpeed)
            }
        }
        else {
            let last = snake.pop()
            document.getElementById("box" + last[0] + "+" + last[1]).classList.remove("active")
        }
    }
    else {
        console.log(score);
        reset()
    }
}

function checkBoundary(head) {
    if ((head[1] === 20 && direction === "right") || (head[1] === -1 && direction === "left") || (head[0] === 20 && direction === "down") || (head[0] === -1 && direction === "up")) {
        console.log("end");
        return true
    }
    for (let i = 1; i < snake.length; i++) {
        if (head[0] === snake[i][0] && head[1] === snake[i][1]) {
            console.log("end");
            return true
        }
    }
    return false
}

function reset() {
    snake = [[0, 0]]
    foods = []
    currFood = [0, 0]
    direction = "right"
    currSpeed = 1000
    clearInterval(interval)
    document.getElementById("comment").innerHTML = `Game Over!<br>Score = ${score}<br>High score = ${highScore}`
    button.textContent = "Restart"
    document.getElementById("result").style.width = 350 + 'px'
    document.getElementById("result").style.display = "block"
    score = 0
}

button.addEventListener("click", () => {
    document.getElementById("result").style.display = "none"
    main()
    interval = setInterval(moveSnake, currSpeed)
    getFood()
})