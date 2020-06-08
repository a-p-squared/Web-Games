var canvas = document.getElementById("canvas");

canvas.width = canvas.scrollWidth;
canvas.height = canvas.scrollHeight;

var ctx = canvas.getContext("2d");

var gameStart = false;
var gameOver = false;

function UI(position) {
    this.score = 0;
    this.position = position;

    this.drawBorder = function () {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 - 480 * position, 580);
        ctx.lineTo(canvas.width / 2 - 530 * position, 630);
        ctx.lineTo(canvas.width / 2 - 480 * position, 680);
        ctx.lineTo(canvas.width / 2 - 430 * position, 630);
        ctx.lineTo(canvas.width / 2 - 480 * position, 580);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.stroke();
    }
    this.drawScore = function () {
        this.drawBorder();
        ctx.font = "30px Impact";
        ctx.fillText(this.score, canvas.width / 2 + (- 480 * position) - ctx.measureText(this.score).width / 2, 640);

    }
}

function Player(position) {
    this.position = position;
    this.centreX;
    this.centreY = 50;
    this.color;
    this.strokeColor;
    this.radius = 40;
    this.isWinner = false;
    if (this.position == 1) {
        this.color = "black";
        this.strokeColor = "white";
        this.centreX = 280;
    }
    else {
        this.color = "white";
        this.strokeColor = "black";
        this.centreX = 805;
    }

    this.drawPlayer = function () {
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.strokeColor;
        ctx.beginPath();
        ctx.arc(this.centreX, this.centreY, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    this.movePlayer = function () {
        this.centreY -= 1;
    }
}

function Go() {
    this.text = "GO!";
    ctx.font = "60px";
    this.postionX = canvas.width / 2 - ctx.measureText(this.text).width;
    this.positionY = 50;
    this.rectX = 0;
    this.rectY = 0;

    this.draw = function () {
        ctx.strokeRect(this.rectX, this.rectY, 1080, 100);
        ctx.fillStyle = "black";
        ctx.fillText(this.text, this.postionX, this.positionY);
    }

    this.update = function () {
        if (this.rectY >= -150) {
            this.draw();
            this.positionY -= 1;
            this.rectY -= 1;
            gameStart = true;
        }
        else if (this.rectY <= 300) {
            player1.movePlayer();
            player2.movePlayer();
        }
    }
}

function Tiles(Yoffset) {
    this.tiles = [
        { isBlack: 0, positionX: 35, positionY: 100 + 235 * Yoffset },
        { isBlack: 0, positionX: 210, positionY: 100 + 235 * Yoffset },
        { isBlack: 0, positionX: 385, positionY: 100 + 235 * Yoffset },
        { isBlack: 1, positionX: 555, positionY: 100 + 235 * Yoffset },
        { isBlack: 1, positionX: 730, positionY: 100 + 235 * Yoffset },
        { isBlack: 1, positionX: 905, positionY: 100 + 235 * Yoffset },
    ];

    this.initTiles = function () {
        this.noBlack = 0;
        this.noWhite = 0;

        for (var i = 0; i < 6; i++) {
            if (i == 2 && this.noBlack == 2) {
                this.tiles[i].isBlack = 0;
            }
            else if (i == 5 && this.noWhite == 2) {
                this.tiles[i].isBlack = 1;
            }
            else {
                this.tiles[i].isBlack = Math.floor(Math.random(0, 1) * 2);
                if (i < 2 && this.tiles[i].isBlack == 1) {
                    this.noBlack += 1;
                }
                if (i > 2 && this.tiles[i].isBlack == 0) {
                    this.noWhite += 1;
                }
            }
        }
    }

    this.drawTiles = function () {
        for (var i = 0; i < 6; i++) {
            if (this.tiles[i].isBlack == 0) {
                ctx.fillStyle = "white";
            }
            else {
                ctx.fillStyle = "black";
            }
            ctx.fillRect(this.tiles[i].positionX, this.tiles[i].positionY, 140, 200);
            ctx.strokeRect(this.tiles[i].positionX, this.tiles[i].positionY, 140, 200);
        }
    }

    this.updateTiles = function (playerOne, playerTwo) {
        for (var i = 0; i < 6; i++) {
            this.tiles[i].positionY -= 1;
            this.drawTiles();
            if(this.tiles[i].positionY < playerOne.centreY && this.tiles[i].positionY + 200 > playerOne.centreY && this.tiles[i].positionX < playerOne.centreX && this.tiles[i].positionX + 140 > playerOne.centreX && this.tiles[i].isBlack == 1)
            {
                gameOver = true;
                playerTwo.isWinner = true;
            }
            if(this.tiles[i].positionY < playerTwo.centreY && this.tiles[i].positionY + 200 > playerTwo.centreY && this.tiles[i].positionX < playerTwo.centreX && this.tiles[i].positionX + 140 > playerTwo.centreX && this.tiles[i].isBlack == 0)
            {
                gameOver = true;
                playerOne.isWinner = true;
            }
        }

        if (this.tiles[0].positionY <= -200) {
            this.tiles = [
                { isBlack: 0, positionX: 35, positionY: 235 * 3 + 35 },
                { isBlack: 0, positionX: 210, positionY: 235 * 3 + 35 },
                { isBlack: 0, positionX: 385, positionY: 235 * 3 + 35 },
                { isBlack: 1, positionX: 555, positionY: 235 * 3 + 35 },
                { isBlack: 1, positionX: 730, positionY: 235 * 3 + 35 },
                { isBlack: 1, positionX: 905, positionY: 235 * 3 + 35 },
            ];

            this.initTiles();
        }
    }
}

var ui1 = new UI(1);
var ui2 = new UI(-1);

var go = new Go();

var player1 = new Player(1);
var player2 = new Player(2);

var isPlaying = false;

var tiles1 = new Tiles(0); tiles1.initTiles();
var tiles2 = new Tiles(1); tiles2.initTiles();
var tiles3 = new Tiles(2); tiles3.initTiles();
var tiles4 = new Tiles(3); tiles4.initTiles();

function gameOverScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText("Game Over", canvas.width / 2 - ctx.measureText("Game Over").width / 2, 200);
    if(player1.isWinner == true)
    {
        ctx.fillText("Player One Wins", canvas.width / 2 - ctx.measureText("Player One Wins").width / 2, 300);
        ctx.fillText("Player One Score : " + ui1.score, canvas.width / 2 - 100, 500);
        
    }
    else
    {
        ctx.fillText("Player Two Wins", canvas.width / 2 - ctx.measureText("Player Two Wins").width / 2, 300);
        ctx.fillText("Player Two Score : " + ui2.score, canvas.width / 2 - 100, 500);
    }
}

function Animate() {
    if(gameOver == false)
    {
        requestAnimationFrame(Animate);
    }
    else
    {
        requestAnimationFrame(gameOverScreen);
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isPlaying) {
        go.update();
    }
    else {
        go.draw();
    }

    if (isPlaying) {
        tiles1.updateTiles(player1, player2);
        tiles2.updateTiles(player1, player2);
        tiles3.updateTiles(player1, player2);
        tiles4.updateTiles(player1, player2);
    }
    else {
        tiles1.drawTiles();
        tiles2.drawTiles();
        tiles3.drawTiles();
        tiles4.drawTiles();
    }
    player1.drawPlayer();
    player2.drawPlayer();

    ui1.drawScore();
    ui2.drawScore();

    //loseCondition(tiles1, tiles2, tiles3, tiles4, player1, player2);


}

var isDownKey = false;
var isUpKey = false;
var isWkey = false;
var isSKey = false;

window.addEventListener("keydown", KeyboardInput, false);
function KeyboardInput(event) {
    if (event.keyCode == 32)//space
    {
        isPlaying = true;
    }

    if (event.keyCode == 65)//A
    {
        if (player1.centreX - 175 > 0) {
            player1.centreX -= 175;
            if (isDownKey) {
                player1.centreY += 235;
            }
            if (isUpKey) {
                player1.centreY -= 235;
            }
        }
    }
    if (event.keyCode == 37)//left
    {
        if (player2.centreX - 175 > 0) {
            player2.centreX -= 175;
            if (isDownKey) {
                player2.centreY += 235;
            }
            if (isUpKey) {
                player2.centreY -= 235;
            }
        }
    }

    if (event.keyCode == 68)//D
    {
        if (player1.centreX + 175 > 0) {
            player1.centreX += 175;
            if (isDownKey) {
                player1.centreY += 235;
            }
            if (isUpKey) {
                player1.centreY -= 235;
            }
        }
    }
    if (event.keyCode == 39)//right
    {
        if (player2.centreX + 175 < 1080) {
            player2.centreX += 175;
            if (isDownKey) {
                player2.centreY += 235;
            }
            if (isUpKey) {
                player2.centreY -= 235;
            }
        }
    }
    if (gameStart == true) {
        if (event.keyCode == 83)//S
        {
            if (player1.centreY + 235 < 720) {
                player1.centreY += 235;
                if (isDownKey) {
                    player1.centreY += 235;
                }
                if (isUpKey) {
                    player1.centreY -= 235;
                }
                ui1.score += 1;
            }
        }

        if (event.keyCode == 40)//down
        {
            if (player2.centreY + 235 < 720) {
                player2.centreY += 235;
                if (isDownKey) {
                    player2.centreY += 235;
                }
                if (isUpKey) {
                    player2.centreY -= 235;
                }
                ui2.score += 1;
            }
        }
        if (event.keyCode == 87)//W
        {
            if (player1.centreY - 235 > 0) {
                player1.centreY -= 235;
                if (isDownKey) {
                    player1.centreY -= 235;
                }
                if (isUpKey) {
                    player1.centreY += 235;
                }
            }
        }
        if (event.keyCode == 38)//up
        {
            if (player2.centreY - 235 > 0) {
                player2.centreY -= 235;
                if (isDownKey) {
                    player2.centreY -= 235;
                }
                if (isUpKey) {
                    player2.centreY += 235;
                }
            }
        }
        if (event.keyCode == 16)//Shift
        {
            if (player1.centreY + 235 < 720) {
                isDownKey = true;
            }
        }
        if (event.keyCode == 17)//ctrl
        {
            if (player2.centreY + 235 < 720) {
                isDownKey = true;
            }
        }
    }

}

window.addEventListener("keyup", function (event) {
    if (event.keyCode == 16)//Shift
    {
        isDownKey = false;
    }
    if (event.keyCode == 17)//ctrl
    {
        isDownKey = false;
    }

});


Animate();
