var canvasBg = document.getElementById('canvasBg');
var ctxBg = canvasBg.getContext('2d');

var canvasTank=document.getElementById('canvasTank');
var ctxTank=canvasTank.getContext('2d');

var canvasEnemy=document.getElementById('canvasEnemy'); //enemy plane
var ctxEnemy=canvasEnemy.getContext('2d');

var canvasHUD=document.getElementById('canvasHUD'); //canvas Score
var ctxHUD=canvasHUD.getContext('2d');
ctxHUD.fillStyle = "hsla(0,0%,0%,0.5)";
ctxHUD.font = "bold 20px Arial";

var canvasCloud=document.getElementById('canvasCloud');
var ctxCloud=canvasCloud.getContext('2d');
var cloud=new Cloud();

var Tank_main=new Tank(); //creating player Tank
var enemies=[]; //list of enemies

var gameWidth = canvasBg.width;
var gameHeight = canvasBg.height;
var isPlaying=false;

var requestAnimFrame =  window.requestAnimationFrame ||
                        window.webkitRequestAnimationFrame ||
                        window.mozRequestAnimationFrame ||
                        window.oRequestAnimationFrame ||
                        window.msRequestAnimationFrame ||
                        function(callback) {
                            window.setTimeout(callback, 1000 / 60);
                        };

var imgSprite=new Image();
imgSprite.src='images/sprite.png';
imgSprite.addEventListener('load',init,false);     




//main function
function init(){
	spawnEnemy(1);
	drawMenu();
	 
	window.addEventListener('keydown',function (evt){ // onkeydown event handle
        if (!isPlaying && evt.keyCode == 13) { // in case of Enter button
            isPlaying = true;
            playGame();
        }
        if(isPlaying && evt.keyCode	==27){
        	isPlaying=false;
         }
    },false);

   function Rect(x,y,width,height){this.x=x;this.y=y; this.width=width;this.height=height;}
/*
    window.addEventListener('touchstart',function(e){
      e.preventDefault();
      var rect=new Rect(264,215,262,123);
      if(utils.containsPoint(rect,e.pageX,e.pageY) && isPlaying == false)
        {isPlaying=true; playGame(); }
        var rightTouch=new Rect(690,376,87,66);
        if(utils.containsPoint(rightTouch,e.pageX,e.pageY)) Tank_main.isRightKey = true;
        var leftTouch=new Rect(13,376,87,66);
        if(utils.containsPoint(leftTouch,e.pageX,e.pageY)) Tank_main.isLeftKey = true;
        var fireTouch=new Rect(690,291,87,66);
        if(utils.containsPoint(fireTouch,e.pageX,e.pageY)) Tank_main.isSpaceBar = true;

        var nUpTouch=new Rect(13,200,87,66);
        if(utils.containsPoint(nUpTouch,e.pageX,e.pageY)) {  Tank_main.srcX=59; Tank_main.angle=45; Tank_main.upNose=true; } //for nozzle up
        var nDownTouch=new Rect(13,291,87,66);
        if(utils.containsPoint(nDownTouch,e.pageX,e.pageY))  {   Tank_main.srcX=0; Tank_main.angle=20; Tank_main.upNose=false; } //for nozzle up
    },false);

 
    

    window.addEventListener('touchend',function(e){
      e.preventDefault();
      Tank_main.isRightKey = false;
      Tank_main.isLeftKey = false;
      Tank_main.isSpaceBar = false;
      Tank_main.speed=0.3;
    Tank_main.sound.pause();
    },false);
    */
}               


function playGame(){ 
	drawBg();
	if(isPlaying){
		Tank_main.draw(); cloud.draw(); 
		drawAllEnemies();
		requestAnimationFrame(playGame);
		updateHUD();
	}
	document.addEventListener('keydown',checkKeyDown,false);
	document.addEventListener('keyup',checkKeyUp,false); 
	
    
}


function drawBg(){ //draws background from the sprite image
	ctxBg.drawImage(imgSprite,800,0,gameWidth,gameHeight,0,0,gameWidth,gameHeight);
}

function drawMenu(){
	ctxBg.drawImage(imgSprite,800,580,gameWidth,gameHeight,0,0,gameWidth,gameHeight);
	
}

function spawnEnemy(number){
	for (var i=0;i<number;i++)
		enemies[enemies.length]=new Enemy(); //why length??
}

function drawAllEnemies(){
	clearCtxEnemy();
	for(var i=0;i<enemies.length;i++)
		enemies[i].draw();
	}

function clearCtxBg(){
	ctxBg.clearRect(0,0,gameWidth,gameHeight);
}

function updateHUD(){
	ctxHUD.clearRect(0,0,gameWidth,gameHeight);
	ctxHUD.fillText("Score: "+ Tank_main.score,680,30);
	ctxHUD.fillText("Life: "+ Tank_main.life,680,50);
}

function gameOver(){
	clearCtxBg();
    drawMenu(); //isPlaying=false;
}

//end main function





//bullet function
function Bullet(j){
	this.jet=j;
	this.srcX=100;
	this.srcY=500;
	this.drawX=-20;
	this.drawY=0
	this.width=7;
	this.height=7;
	this.speed=5;//10;
	this.gravity=.01;
	this.angle=25;
	this.explosion=new Explosion();
	this.sound= new Audio('sounds/BANG.mp3');
	this.sound.volume =0.06;
}

Bullet.prototype.draw=function(){

	if(this.speed == 5) this.sound.play();
	this.speed -= this.gravity;
       
	if(this.speed >0)
		this.drawX += this.speed;
	else this.drawX -= this.speed;
   
	this.drawY -= this.speed * Math.tan(this.angle * Math.PI/180);


   	ctxTank.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
	this.checkHitEnemy();
	
	if(this.drawX>gameWidth) this.recycle(); 
}

Bullet.prototype.fire=function(startX,startY,angleB){ //nose of Tank coord
	this.drawX=startX;
	this.drawY=startY;
	this.angle=angleB;
}

Bullet.prototype.checkHitEnemy=function(){
	for(var i=0;i < enemies.length; i++){
	/*	if(this.drawX >= enemies[i].drawX &&
		   this.drawX <= enemies[i].drawX + enemies[i].width &&
		   this.drawY >= enemies[i].drawY &&
		   this.drawY <= enemies[i].drawY + enemies[i].height)
   */
   if(utils.intersects(this.getBounds(),enemies[i].getBounds()))
		   {
			this.explosion.drawX=enemies[i].drawX - (this.explosion.width/2);
			this.explosion.drawY = enemies[i].drawY;
			this.explosion.hasHit=true;
			this.recycle();
			//enemies[i].sound.pause(); 
			enemies[i].recycleEnemy();
			this.jet.updateScore(enemies[i].rewardPoints);
		}
	}
}

/*Bullet.prototype.checkHitBomb = function() {
	for(var i=0;i<enemies.length;i++){
		if(utils.intersects(enemies[i].bomb.getBounds(),this.getBounds()))
			console.log('hitt');
	}
};
*/
Bullet.prototype.getBounds = function() {
	return {
		x: this.drawX,
		y: this.drawY,
		width: this.width,
		height: this.height
	};
};

Bullet.prototype.recycle=function(){
	this.drawX=-20;
	this.speed=5;
}
//end bullet function


//Explosion function

function Explosion(){
	this.srcX=500;
	this.srcY=500;
	this.drawX=0;
	this.drawY=0;
	this.width=200;
	this.height=160;
	this.hasHit=false;
	this.currentFrame=0;
	this.totalFrames=10;
	this.sound=new Audio('sounds/explo.mp3');
	this.sound.volume= 0.3;
}

Explosion.prototype.draw = function() {
	if(this.currentFrame <= this.totalFrames){
		this.sound.play();
		ctxTank.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
		this.currentFrame++;
	}else{
		this.hasHit=false;
		this.currentFrame=0;
	}
};

Explosion.prototype.getBounds= function() {
	return{
		x: this.drawX,
		y: this.drawY,
		width: this.width,
		height: this.height
	};
};

//end explosion function






//key event functions

function checkKeyDown(e){
	var keyID=e.keyCode || e.which;

	if(keyID === 39 || keyID === 68){ //for right arrow or D key
		Tank_main.isRightKey=true;
		Tank_main.sound.play();
		e.preventDefault();
	}
	
	if(keyID === 37 || keyID === 65){ //for left arrow or A key
		Tank_main.isLeftKey=true;
		Tank_main.sound.play();
		e.preventDefault();
	}
	if(keyID ===  32){ //for spacebar
		Tank_main.isSpaceBar=true;		
		e.preventDefault();
	}


	if (keyID === 38 || keyID === 87) { //up arrow or W key
        Tank_main.isUpKey = true;
        e.preventDefault();
    }
    
   if (keyID === 40 || keyID === 83) { //down arrow or S key
        Tank_main.isDownKey = true;
        e.preventDefault();
    }
}


function checkKeyUp(e){
	var keyID=e.keyCode || e.which;

	if(keyID === 39 || keyID === 68){ //for right arrow or D key
		Tank_main.isRightKey=false;
		Tank_main.speed=0.3; 
		Tank_main.sound.pause();
		e.preventDefault();
	}

	if(keyID === 37 || keyID === 65){ //for left arrow or A key
		Tank_main.isLeftKey=false; 
		Tank_main.speed=0.3;
		Tank_main.sound.pause();
		e.preventDefault();
	}
	if(keyID ===  32){ //for spacebar
		Tank_main.isSpaceBar=false;
		e.preventDefault();
	}

	if (keyID === 38 || keyID === 87) { //up arrow or W key
        Tank_main.isUpKey = false;
        e.preventDefault();
    }
    
   if (keyID === 40 || keyID === 83) { //down arrow or S key
        Tank_main.isDownKey = false;
        e.preventDefault();
    }
}

//end key event functions


function Cloud(){
	this.srcX =0;
	this.srcY = 750;
	this.width = 780;
	this.height = 150;
	this.drawX = Math.random()* 800;
	this.drawY =Math.random()* 25;
	this.speed =0.05;
}

Cloud.prototype.draw = function() {
	ctxCloud.clearRect(0,0,gameWidth,gameHeight);
	this.drawX += this.speed;
	ctxCloud.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);

	if(this.drawX  > gameWidth){
		this.drawX = -(this.width +Math.random()*100);
	    this.drawY =Math.random()* 25;
	}

};