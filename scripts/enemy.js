
//enemy functions
function Enemy(){
	this.srcX=0;
	this.srcY=500; ///far right
	this.width=73;
	this.height=35;
	this.speed=Math.random()*4; //2;
	this.ax=.006;
	this.drawX=Math.floor(Math.random()*1000)+gameWidth;
	this.drawY=Math.floor(Math.random()*300);
	this.rewardPoints=5;
	//bomb
	this.dropX= Math.floor(Math.random()*800); //x-coordinate of bomb drop point
	this.bomb=new Bomb(this);
	this.fired=false; //for setting up the comparision 
	//sound
	this.sound=new Audio('sounds/airplane.mp3');
	this.sound.volume=0.4;
}

Enemy.prototype.draw = function() {
	this.drawBomb();
	this.speed += this.ax;
	this.drawX -= this.speed; ///moving from right to left
	ctxEnemy.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
	this.checkEscaped();
	
	//only playing sound when airplane is on the canvas
	if(this.drawX <= 1000 && this.drawX >= -100) this.sound.play(); 
	 else	 this.sound.pause(); 

    var fd=Math.floor(this.drawX);
   	if(fd <= this.dropX  && this.fired == false) {// && (fd + 120) > this.dropX ) {}
   		this.bomb.fire(this.drawX,this.drawY + this.height);
   		this.fired=true;
   		this.bomb.setDroppedX(this.drawX);
   	}
	//---

};

//--------
Enemy.prototype.drawBomb=function(){
		if(this.bomb.drawY >= 0) this.bomb.draw();
		if(this.bomb.explosion.hasHit) this.bomb.explosion.draw();
};
//--------

Enemy.prototype.checkEscaped=function(){ //for recycling enemy Tank
	if(this.drawX+this.width <=0)
		this.recycleEnemy();
}

Enemy.prototype.recycleEnemy=function(){
	this.drawX=Math.floor(Math.random()*1000+gameWidth);
	this.drawY=Math.floor(Math.random()*300);
	this.dropX=Math.floor(Math.random()*800);
	this.fired=false;
	this.speed=Math.random()*2;	
}

function clearCtxEnemy(){
	ctxEnemy.clearRect(0,0,gameWidth,gameHeight);
}

//for geting the bounding box for collision detection
Enemy.prototype.getBounds = function() {
	return {
		x: this.drawX,
		y: this.drawY,
		width: this.width,
		height: this.height
	};
};

//end enemy functions




//bomb function
function Bomb(j){
	this.enemy=j;
	this.srcX=500;
	this.srcY=680;
	this.drawX=-40;
	this.drawY=-10
	this.width=40;
	this.height=17;
	this.speed=3;
	this.gravity=0.8;
	this.explosion=new Explosion();
	this.droppedX=0;
	this.bombdropping=new Audio('sounds/bombdrop.mp3')
	this.sound= new Audio('sounds/hit.mp3');
	this.sound.volume =0.3;
}

Bomb.prototype.draw=function(){
	this.drawY += this.speed+this.gravity; 
	ctxTank.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
	this.checkHitGround();
	if(this.drawY>gameHeight) this.recycle();
}

Bomb.prototype.fire=function(startX,startY){ 
	//console.log('fire');
	this.drawX=startX;
	this.drawY=startY;
	
	this.bombdropping.volume=0.1;
	this.bombdropping.play();
}

Bomb.prototype.setDroppedX = function(dX) { //for setting the old value of dropX to prevent from changing when plane goes out of screen and new value is generated
	this.droppedX = dX;
};

Bomb.prototype.checkHitGround=function(){
	if(this.drawY >= 480){
		//console.log('x ' +this.enemy.dropX);
		this.explosion.drawX = this.droppedX - (this.explosion.width/2);
		this.explosion.drawY = 400;
		this.explosion.hasHit=true;
		//check if it hits the Tank using the utils.js function  using the explosion bounds instead of bomb bound
        if(utils.intersects(this.explosion.getBounds(),Tank_main.getBounds())){  this.sound.play(); Tank_main.updateLife();}
		this.recycle();		 
	}
}

Bomb.prototype.getBounds=function(){
	return {
		x: this.drawX,
		y: this.drawY,
		width: this.width,
		height: this.height
	};
}

Bomb.prototype.recycle=function(){
	this.drawX=-40;
	this.drawY = -10;
}
//end bomb function