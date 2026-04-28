const WIDTH = 960;
const HEIGHT = 720;

let bg_y = 0;
let pl_x = Math.floor(WIDTH / 2);
let pl_y = HEIGHT - 40;
let cl_x = 0;
let cl_y = 0;
let fire = false;
const SIZE = 80;

let enemy = [];
for (let i = 0; i < 9; i++) {
    enemy.push([0,0,0,0,0,0,0,0,0,0,0,0]);
}

let bonusEnemy = {
    active: false,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    timer: 0
};

let superBonusEnemy = {
    active: false,
    x: 0,
    y: 0,
    vx: 0,
    timer: 0
};

const bonusInvader = new Image();
bonusInvader.src = "image/bonus.png";

const superBonusInvader = new Image();
superBonusInvader.src = "image/super_bonus.png";

let scene = "タイトル";
let timer = 0;
let score = 0;

const cvs = document.getElementById("cvs");
const ctx = cvs.getContext("2d");

const bg = new Image();
bg.src = "image/bg.png";

const fighter = new Image();
fighter.src = "image/fighter.png";

const invader = new Image();
invader.src = "image/invader.png";

let laser = null;
let effects = [];

function move(e) {
    if (scene == "ゲーム") {
        const rect = cvs.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        pl_x = Math.floor(pl_x * 0.9 + mx * 0.1);
    }
}

function click(e) {
    const rect = cvs.getBoundingClientRect();
    cl_x = e.clientX - rect.left;
    cl_y = e.clientY - rect.top;
    fire = true;
}

function effect(cx, cy) {
    effects.push({
        x: cx,
        y: cy,
        count: 20
    });
}

function text(x, y, txt, siz, col) {
    ctx.font = siz + "px Times New Roman";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "black";
    ctx.fillText(txt, x + 1, y + 1);

    ctx.fillStyle = col;
    ctx.fillText(txt, x, y);
}

function drawImageCenter(img, x, y) {
    ctx.drawImage(img, x - img.width / 2, y - img.height / 2);
}

function main() {
    timer += 1;
    bg_y = (bg_y + 2) % HEIGHT;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    drawImageCenter(bg, WIDTH / 2, bg_y - HEIGHT / 2);
    drawImageCenter(bg, WIDTH / 2, bg_y + HEIGHT / 2);

    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 12; x++) {
            if (enemy[y][x] == 1) {
                let X = x * SIZE + SIZE / 2;
                let Y = y * SIZE + SIZE / 2;
                drawImageCenter(invader, X, Y);
            }
        }
    }

  


    drawImageCenter(fighter, pl_x, pl_y);

    text(WIDTH * 0.5, 30, "SCORE " + score, 30, "white");

    if (scene == "タイトル") {
        text(WIDTH * 0.5, HEIGHT * 0.3, "GALAXY DEFENDER", 60, "cyan");

        if (timer % 30 < 15) {
            text(WIDTH * 0.5, HEIGHT * 0.6, "Clock to start!", 30, "lime");
        }

        if (fire == true) {
            for (let y = 0; y < 8; y++) {
                for (let x = 0; x < 12; x++) {
                    enemy[y][x] = 0;
                }
            }

            scene = "ゲーム";
            timer = 0;
            score = 0;
            fire = false;
        }
    }

    if (scene == "ゲーム") {
        
        if (bonusEnemy.active == false) {
    if (Math.random() < 0.002) {
        bonusEnemy.active = true;
        bonusEnemy.x = Math.random() * WIDTH;
        bonusEnemy.y = Math.random() * (HEIGHT * 0.5);
        bonusEnemy.vx = Math.random() * 6 - 3;
        bonusEnemy.vy = Math.random() * 4 - 2;
        bonusEnemy.timer = 300;
    }
}

if (bonusEnemy.active == true) {
    bonusEnemy.x += bonusEnemy.vx;
    bonusEnemy.y += bonusEnemy.vy;

    if (bonusEnemy.x < 40 || bonusEnemy.x > WIDTH - 40) {
        bonusEnemy.vx *= -1;
    }

    if (bonusEnemy.y < 40 || bonusEnemy.y > HEIGHT * 0.6) {
        bonusEnemy.vy *= -1;
    }

    bonusEnemy.timer--;
    if (bonusEnemy.timer <= 0) {
        bonusEnemy.active = false;
    }
    
}
  if (bonusEnemy.active == true) {
    drawImageCenter(bonusInvader, bonusEnemy.x, bonusEnemy.y);
}
 
   
if (superBonusEnemy.active == false) {
    if (Math.random() < 0.0007) {
        superBonusEnemy.active = true;
        superBonusEnemy.y = Math.random() * (HEIGHT * 0.6) + 40;
        superBonusEnemy.timer = 180;

        if (Math.random() < 0.5) {
          
            superBonusEnemy.x = -40;
            superBonusEnemy.vx = 12;
        } else {
          
            superBonusEnemy.x = WIDTH + 40;
            superBonusEnemy.vx = -12;
        }
    }
}


if (superBonusEnemy.active == true) {
    superBonusEnemy.x += superBonusEnemy.vx;
    superBonusEnemy.timer--;

    if (
        superBonusEnemy.x < -80 ||
        superBonusEnemy.x > WIDTH + 80 ||
        superBonusEnemy.timer <= 0
    ) {
        superBonusEnemy.active = false;
    }
}


if (superBonusEnemy.active == true) {
    ctx.drawImage(
        superBonusInvader,
        superBonusEnemy.x - 30,
        superBonusEnemy.y - 30,
        60,
        60
    );
}

        let speed = 100 - Math.floor(score / 500);
        if (speed < 20) speed = 20;
        if (timer % speed == 0) {
            for (let y = 8; y > 0; y--) {
                for (let x = 0; x < 12; x++) {
                    enemy[y][x] = enemy[y - 1][x];
                }
            }

            for (let x = 0; x < 12; x++) {
                let choices = [0,0,0,1];
                enemy[0][x] = choices[Math.floor(Math.random() * choices.length)];
            }

            for (let x = 0; x < 12; x++) {
                if (enemy[8][x] == 1) {
                    scene = "ゲームオーバー";
                    timer = 0;
                }
            }
        }

        if (fire == true) {
            laser = {
                x1: pl_x,
                y1: pl_y,
                x2: cl_x,
                y2: cl_y,
                count: 5
            };

            fire = false;

            let ax = Math.floor(cl_x / SIZE);
            let ay = Math.floor(cl_y / SIZE);

            if (0 <= ax && ax <= 11 && 0 <= ay && ay <= 8) {
                if (enemy[ay][ax] == 1) {
                    effect(ax * SIZE, ay * SIZE);
                    enemy[ay][ax] = 0;
                    score += 100;
                }
            }

            if (bonusEnemy.active == true) {
    let dx = cl_x - bonusEnemy.x;
    let dy = cl_y - bonusEnemy.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 40) {
        effect(bonusEnemy.x - SIZE / 2, bonusEnemy.y - SIZE / 2);
        bonusEnemy.active = false;
        score += 500;
    }
}

if (superBonusEnemy.active == true) {
    let dx = cl_x - superBonusEnemy.x;
    let dy = cl_y - superBonusEnemy.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 30) {
        effect(superBonusEnemy.x - 30, superBonusEnemy.y - 30);
        superBonusEnemy.active = false;
        score += 1000;
    }
}
        }
    }

    if (laser != null) {
        ctx.strokeStyle = "cyan";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(laser.x1, laser.y1);
        ctx.lineTo(laser.x2, laser.y2);
        ctx.stroke();

        laser.count--;
        if (laser.count <= 0) {
            laser = null;
        }
    }

    for (let i = effects.length - 1; i >= 0; i--) {
        let ef = effects[i];

        if (ef.count % 2 == 0) {
            ctx.fillStyle = "red";
        } else {
            ctx.fillStyle = "yellow";
        }

        ctx.beginPath();
        ctx.ellipse(
            ef.x + SIZE / 2,
            ef.y + SIZE / 2,
            SIZE / 2,
            SIZE / 2,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();

        ef.count--;

        if (ef.count <= 0) {
            effects.splice(i, 1);
        }
    }

    if (scene == "ゲームオーバー") {
        text(WIDTH * 0.5, HEIGHT * 0.4, "GAME OVER", 60, "red");

        if (timer >= 30 * 5) {
            scene = "タイトル";
            fire = false;
        }
    }

    requestAnimationFrame(main);
}

cvs.addEventListener("mousemove", move);
cvs.addEventListener("click", click);

let loaded = 0;
function checkLoad() {
    loaded++;
    if (loaded == 5) {
        main();
    }
}
bonusInvader.onload = checkLoad;
superBonusInvader.onload = checkLoad;
bg.onload = checkLoad;
fighter.onload = checkLoad;
invader.onload = checkLoad;
