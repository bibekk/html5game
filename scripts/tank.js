//Tank function

 function Tank(){
 	this.srcX=0; //sprite coord
 	this.srcY=900; //sprite coord
 	this.width=58; //width of Tank
 	this.height=34; //height of Tank
 	this.speed=0.3; //2
 	this.drawX=200; //location in background
 	this.drawY=460;

 	this.noseX=this.drawX + 50;
 	this.noseY=this.drawY + 6;
 	this.angle=25;
    this.upNose=false;
  	this.isRightKey=false;
 	this.isLeftKey=false;
 	this.isSpaceBar=false;
 	this.isUpKey=false;

 	this.isShooting=false;
 	this.bullets=[];
 	this.currentBullet=0;
 	for(var i=0;i<25;i++)
 		this.bullets[this.bullets.length]=new Bullet(this);
 	this.score=0;
 	this.life=10;
 	this.ax=0.01;
 	this.sound=new Audio('sounds/TANKMOVE.mp3');
 	this.sound.volume=0.1;


 }

Tank.prototype.checkDirection = function() {
	if(this.isRightKey) {this.speed += this.ax; this.drawX += this.speed;}
	if(this.isLeftKey) {this.speed += this.ax; this.drawX -= this.speed;}
	if(this.isUpKey)  {	 this.srcX=59; this.angle=45; this.upNose=true; } //for nozzle up
	if(this.isDownKey){   this.srcX=0; this.angle=20; this.upNose=false; } //for nozzle down
	if(this.drawX  <= 5) this.drawX=5; 
	if(this.drawX  >= 700) this.drawX=700;
}


Tank.prototype.draw=function(){
	clearCtxTank(); 
	this.checkDirection();
	this.checkShooting();
	this.drawAllBullets();
	ctxTank.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
}

Tank.prototype.drawAllBullets=function(){
	for(var i=0;i<this.bullets.length;i++){
		if(this.bullets[i].drawX >= 0) this.bullets[i].draw();
		if(this.bullets[i].explosion.hasHit) this.bullets[i].explosion.draw();
	}
}

Tank.prototype.checkShooting=function(){
	if(this.isSpaceBar && !this.isShooting){
		this.isShooting=true; 
		if(this.upNose) this.noseY = this.drawY +3; else this.noseY =this.drawY +6;
		this.bullets[this.currentBullet].fire(this.drawX+50,this.noseY,this.angle);
		this.currentBullet++;
		if(this.currentBullet >= this.bullets.length) this.currentBullet=0;
	}else if(!this.isSpaceBar){
		this.isShooting=false;
	}
}

Tank.prototype.updateScore=function(points){
	this.score += points;
   if(this.score == enemies.length*30) {//|| this.score==100 || this.score==150 || this.score==200){
		/*for(var i=0;i < enemies.length; i++){
			enemies[i].speed+=0.5;
			*/
			spawnEnemy(enemies.length+1); 
			
	}
	updateHUD();
}

Tank.prototype.getBounds = function() {
	return {
		x :this.drawX,
		y: this.drawY,
		width: this.width,
		height: this.height
	};
};

Tank.prototype.updateLife = function() {
	this.life -= 1;
	if(this.life==0){
		gameOver();
	}
	updateHUD();
};

function clearCtxTank(){
    ctxTank.clearRect(0,0,canvasTank.width,canvasTank.height); //or gameWidth,gameHeight
}
//end Tank function