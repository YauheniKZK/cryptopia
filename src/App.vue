<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getImageUrl } from '@/utils/images'
import WebApp from '@twa-dev/sdk'

const versionApp = import.meta.env.PACKAGE_VERSION

const moveUp = ref(false)
const typeMove = ref('up')
const speed = ref(0);
const acceleration = ref(0.1);
const maxSpeed = ref(10);
const angle = ref(0)
const rotationAngle = ref(25 * Math.PI / 180);
const rotationSpeed = ref(0.2)

const interval = ref<any>()

//board
const board = ref();
const boardWidth = ref(window.innerWidth);
const boardHeight = ref(WebApp.viewportStableHeight - ((WebApp.viewportStableHeight / 100) * 26));
const context = ref();

//bird
const birdWidth = ref(36); //width/height ratio = 408/228 = 17/12
const birdHeight = ref(26);
const birdX = ref(boardWidth.value/8);
const birdY = ref(boardHeight.value/2);
const birdImg = ref();

const bird = ref({
  x : birdX.value,
  y : birdY.value,
  width : birdWidth.value,
  height : birdHeight.value
})

//pipes
const pipeArray = ref<any>([]);
const pipeWidth = ref(64); //width/height ratio = 384/3072 = 1/8
const pipeHeight = ref(512);
const pipeX = ref(boardWidth.value);
const pipeY = ref(0);

const topPipeImg = ref();
const bottomPipeImg = ref();

//physics
const velocityX = ref(-2); //pipes moving left speed
const velocityY = ref(0); //bird jump speed
const gravity = ref(0);

const gameOver = ref(false);
const score = ref(0);


function update() {
    requestAnimationFrame(update);
    if (gameOver.value) {
        return;
    }
    if (board.value) {
        context.value.clearRect(0, 0, board.value?.width, board.value?.height);
    }

    // bird
    velocityY.value += gravity.value;
    bird.value.y = Math.max(bird.value.y, 0); // apply gravity to current bird.y, limit the bird.y to top of the canvas

    // Сохраняем состояние контекста перед поворотом
    context.value.save();
    context.value.translate(bird.value.x + bird.value.width / 2, bird.value.y + bird.value.height / 2); // Перемещаем центр вращения к центру изображения
    context.value.rotate(angle.value); // Поворачиваем контекст
    context.value.drawImage(birdImg.value, -bird.value.width / 2, -bird.value.height / 2, bird.value.width, bird.value.height); // Рисуем изображение с учетом поворота
    context.value.restore(); // Восстанавливаем состояние контекста

    if (bird.value.y > board.value?.height) {
        gameOver.value = true;
    }

    // pipes
    for (let i = 0; i < pipeArray.value.length; i++) {
        let pipe = pipeArray.value[i];
        pipe.x += velocityX.value;
        context.value.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.value.x > pipe.x + pipe.width) {
            score.value += 0.5; // 0.5 because there are 2 pipes! so 0.5*2 = 1, 1 for each set of pipes
            pipe.passed = true;
        }

        if (detectCollision(bird.value, pipe)) {
            gameOver.value = true;
        }
    }

    // clear pipes
    while (pipeArray.value.length > 0 && pipeArray.value[0].x < -pipeWidth.value) {
        pipeArray.value.shift(); // removes first element from the array
    }

    // score
    context.value.fillStyle = "white";
    context.value.font = "45px sans-serif";
    context.value.fillText(score.value, 5, 45);

    if (gameOver.value) {
        context.value.fillText("GAME OVER", 5, 90);
    }
}

function placePipes() {
    if (gameOver.value) {
        return;
    }

    //(0-1) * pipeHeight/2.
    // 0 -> -128 (pipeHeight/4)
    // 1 -> -128 - 256 (pipeHeight/4 - pipeHeight/2) = -3/4 pipeHeight
    let randomPipeY = pipeY.value - pipeHeight.value/4 - Math.random()*(pipeHeight.value/2);
    let openingSpace = board.value?.height/14;

    let topPipe = {
        img : topPipeImg.value,
        x : pipeX.value,
        y : randomPipeY,
        width : pipeWidth.value,
        height : pipeHeight.value,
        passed : false
    }
    pipeArray.value.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg.value,
        x : pipeX.value,
        y : randomPipeY + pipeHeight.value + openingSpace,
        width : pipeWidth.value,
        height : pipeHeight.value,
        passed : false
    }
    pipeArray.value.push(bottomPipe);
}

function moveBird() {
    if (typeMove.value === 'up' && moveUp.value) {
        //jump
        // velocityY.value = -1;
        speed.value = Math.min((speed.value + acceleration.value), maxSpeed.value)
        angle.value += Number(Math.min(angle.value + rotationSpeed.value, rotationAngle.value) * -1)
        // angle.value = -rotationAngle.value
        //reset game
        bird.value.y -= speed.value
        if (gameOver.value) {
            bird.value.y = birdY.value;
            pipeArray.value = [];
            score.value = 0;
            gameOver.value = false;
        }
    } else {
        // speed.value = Math.max(speed.value - acceleration.value, 0)
        velocityY.value = 0;
    }
    if (typeMove.value === 'down' && moveUp.value) {
        speed.value = Math.min((speed.value + acceleration.value), maxSpeed.value)
        // angle.value = rotationAngle.value
        angle.value = Math.min(angle.value + rotationSpeed.value, rotationAngle.value)
        //jump
        // velocityY.value = 1;
        bird.value.y += speed.value
        //reset game
        if (gameOver.value) {
            bird.value.y = birdY.value;
            pipeArray.value = [];
            score.value = 0;
            gameOver.value = false;
        }
    } else {
        // speed.value = Math.max(speed.value - acceleration.value, 0)
        velocityY.value = 0;
    }
}

function moveBirdActionStart(e: any, type: string) {
    console.log('11111111')
    if (type == "up") {
        moveUp.value = true
        typeMove.value = 'up'
        interval.value = setInterval(moveBird, 16)
    }
    if (type == "down") {
        moveUp.value = true
        typeMove.value = 'down'
        interval.value = setInterval(moveBird, 16)
    }
    // moveBird()
    
}

function moveBirdActionEnd(e: any, type: string) {
  clearInterval(interval.value)
    speed.value = 0
    angle.value = 0
    if (type == "up") {
        moveUp.value = false
        typeMove.value = 'up'
    }
    if (type == "down") {
        moveUp.value = false
        typeMove.value = 'up'
    }
    moveBird()
}

function detectCollision(a: any, b: any) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

onMounted(() => {
  if (board.value) {
    console.log('window.innerWidth', window.innerWidth)
    console.log('window.innerHeight', window.innerHeight)
    console.log('WebApp.viewportStableHeight', WebApp.viewportStableHeight)
    // board = document.getElementById("board");
    board.value.height = WebApp.viewportStableHeight - ((WebApp.viewportStableHeight / 100) * 26);
    board.value.width = window.innerWidth;
    context.value = board.value.getContext("2d"); //used for drawing on the board

    //draw flappy bird
    // context.fillStyle = "green";
    // context.fillRect(bird.x, bird.y, bird.width, bird.height);

    //load images
    birdImg.value = new Image();
    birdImg.value.src = getImageUrl('images/bottle.png');
    birdImg.value.onload = function() {
        context.value.drawImage(birdImg.value, bird.value.x, bird.value.y, bird.value.width, bird.value.height);
    }

    topPipeImg.value = new Image();
    topPipeImg.value.src = getImageUrl('images/toppipe.png');

    bottomPipeImg.value = new Image();
    bottomPipeImg.value.src = getImageUrl('images/bottompipe.png');

    requestAnimationFrame(update);
    setInterval(placePipes, 2000); //every 1.5 seconds
    // document.addEventListener("keydown", moveBirdActionStart);
    // document.addEventListener("keyup", moveBirdActionEnd);
  }

})

// const moveUpAc = () => {

// }

// const moveDownAc = () => {
  
// }
</script>

<template>
  <div class="flex flex-col h-full relative main-container">
    <div class="flex absolute top-[32px] right-[32px] text-[#fff]">
      {{ 'Ver:' + versionApp }}
    </div>
    <div class="container-canvas">
        <canvas ref="board"></canvas>
    </div>
    <div class="flex flex-col h-[26%] z-[111] w-full bg-[#a52a2a]">
      <div class="bg-[#ffffff5b] w-full h-1/2 action-block" @touchstart="e => moveBirdActionStart(e, 'up')" @touchend="e => moveBirdActionEnd(e, 'up')">

      </div>
      <div class="bg-[#fff3] w-full h-1/2" @touchstart="e => moveBirdActionStart(e, 'down')" @touchend="e => moveBirdActionEnd(e, 'down')">

      </div>
    </div>
  </div>
</template>

<style scoped>
.item-block {
  transition: all .2s ease-in-out;
  transform-origin: top;
}

.action-block {
  user-select: none; /* Запрещаем выделение */
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
}
</style>
