var canvas = document.querySelector("canvas");

canvas.width = canvas.scrollWidth;
canvas.height = canvas.scrollHeight;

var ctx = canvas.getContext("2d");

var isFiring = false;

function UI () {
    this.score = 0;
    this.lives = 3;

    this.draw = function () {
        ctx.font = "30px Times New Roman";
        ctx.fillText("Score : " + this.score, 10, 30);
        ctx.fillStyle = "white";
        ctx.fillText("Lives : " + this.lives, canvas.width - ctx.measureText("Lives : " + this.lives).width - 10, 30);
        ctx.fillStyle = "black";
    }
}
var ui = new UI;

function Background () {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width / 2, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(canvas.width / 2, 0, canvas.width / 2, canvas.height);
}

function Player () {
    this.positionX = 40;
    this.positionY = canvas.height / 2;
    this.radius = 20;

    this.draw = function () {
        ctx.beginPath();
        ctx.arc(this.positionX, this.positionY, this.radius, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.positionX + 30, this.positionY - 20);
        ctx.lineTo(this.positionX + 30, this.positionY + 20);
        ctx.lineTo(this.positionX + 50, this.positionY);
        ctx.lineTo(this.positionX + 30, this.positionY - 20);
        ctx.closePath();
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.fillStyle = "black";
    }
}
var player = new Player;

function Target () {
    this.positionX = canvas.width - 100;
    this.positionY = canvas.height / 2 - 40;
    this.direction = 1;
    this.speed = 2;

    this.update = function () {
        if(this.positionY <= 0)
        {
            this.direction = 1;
        }
        if(this.positionY >= canvas.height - 80)
        {
            this.direction = -1;
        }

        this.positionY += this.direction * this.speed;
    }

    this.draw = function () {
        ctx.fillStyle = "cyan";
        ctx.fillRect(this.positionX, this.positionY, 80, 80);
        ctx.fillStyle = "black";
        this.update();
    }
}
var target = new Target;

function Obstacle (positionX, positionY) {
    this.positionX = positionX;
    this.positionY = positionY;
    if(this.positionX < canvas.width / 2)
    {
        this.direction = -1
    }
    else
    {
        this.direction = 1;
    }
    this.speed = 0;

    this.update = function () {
        if(this.positionY <= 0)
        {
            this.direction = 1;
        }
        if(this.positionY >= canvas.height - 100)
        {
            this.direction = -1;
        }

        this.positionY += this.direction * this.speed;
    }

    this.draw = function () {
        if(this.positionX < canvas.width / 2)
        {
            ctx.fillStyle = "black";
        }
        else
        {
            ctx.fillStyle = "white";
        }
        ctx.fillRect(this.positionX, this.positionY, 10, 100);
        ctx.fillStyle = "black";
        this.update();
    }
}
var obstacles1 = new Obstacle(canvas.width / 2 - 100, canvas.height / 2 - 200);
var obstacles2 = new Obstacle(canvas.width / 2 + 100, canvas.height / 2 + 200);

function Fire () {
    this.positionX;
    this.positionY;
    this.radius = 10;
    this.speed = 10;
    this.direction = 1;

    this.update = function () {
        this.positionX += this.speed * this.direction;

        if(this.positionX >= canvas.width)
        {
            this.direction = -1;
            ui.lives -= 1;
        }
        if(this.positionX >= target.positionX && this.positionX <= target.positionX + 80 && this.positionY >= target.positionY && this.positionY <= target.positionY + 80)
        {
            isFiring = false;
            ui.score += 1;
            obstacles1.speed += 1;
            obstacles2.speed += 1;
            target.speed += 1;
            this.direction = 1;
        }
        if(this.positionX == player.positionX && this.positionY > player.positionY - player.radius && this.positionY < player.positionY + player.radius)
        {
            ui.lives -= 1;
            this.positionX = player.positionX + 40;
            this.positionY = player.positionY;
            this.direction = 1;
            isFiring = false;
        }
        if(this.positionX <= 0)
        {
            this.positionX = player.positionX + 40;
            this.positionY = player.positionY;
            this.direction = 1;
            isFiring = false;
        }
        if(this.positionX > obstacles1.positionX && this.positionX < obstacles1.positionX + 10 && this.positionY > obstacles1.positionY && this.positionY < obstacles1.positionY + 100)
        {
            this.direction = -1;
        }
        if(this.positionX > obstacles2.positionX && this.positionX < obstacles2.positionX + 10 && this.positionY > obstacles2.positionY && this.positionY < obstacles2.positionY + 100)
        {
            this.direction = -1;
        }
    }

    this.draw = function () {
        ctx.fillStyle= "red";
        ctx.beginPath();
        ctx.arc(this.positionX, this.positionY, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = "black";
        this.update();
    }
}
fire = new Fire;

function gamePlay () {
    requestAnimationFrame(gamePlay);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    Background();
    player.draw();
    target.draw();
    obstacles1.draw();
    obstacles2.draw();
    ui.draw();
    if(isFiring) {
        fire.draw();
    }
    if(ui.lives == 0)
    {
        gameOver();
    }
}

function gameOver () {
    requestAnimationFrame(gameOver);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "50px Times New Roman";
    ctx.fillText("GAME OVER", canvas.width / 2 - ctx.measureText("GAME OVER").width / 2, canvas.height / 2 - 50);
    ctx.fillText("Score", canvas.width / 2 - ctx.measureText("Score").width / 2, canvas.height / 2);
    ctx.fillText(ui.score, canvas.width / 2 - ctx.measureText(ui.score).width / 2, canvas.height / 2 + 50);
}

gamePlay();

window.addEventListener("keydown", function () {
    if (event.keyCode == 38) //Up
    {
        player.positionY -= 10;
    }

    if (event.keyCode == 40) //Down
    {
        player.positionY += 10;
    }

    if (event.keyCode == 32 && !isFiring) //Space
    {
        isFiring = true;
        fire.positionX = player.positionX + 40;
        fire.positionY = player.positionY;
    }
}, false);