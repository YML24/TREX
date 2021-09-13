//Variables de estados
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var gameOverImg, restartImg;

//variables de sonidos
var jumpSound,checkPointSound,dieSound;

//Varibles de objetos
var trex, trex_running, trex_collided;
var ground, ivisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

//Variable del marcador
var score;

function preload(){
   
    //Imágenes del Trex
    trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  //Imagen del suelo
  groundImage = loadImage("ground2.png");
  
  //Imagen de nubes  
  cloudImage = loadImage ("cloud.png"); 
  
  //Imagen de los 6 obstáculos
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  //Imagenes de GAME OVER y RESTART
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  //Cargar los sonidos del juego
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");

}

function setup(){
  createCanvas(600,200);
  
  //TREX
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  //SUELO
  ground = createSprite(200,160,20,50);
  ground.addImage("ground", groundImage);
  
  //FIN DEL JUEGO
  gameOver = createSprite(300,80)
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  
  //REINICIO
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  
  //SUELO INVISIBLE
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //Crea grupos de obstáculos y nubes
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  //Agregar radio de colisión
  trex.setCollider("circle",0,0,40);
  trex.debug = false;
  
  score = 0;  //Marcador
  
}

function draw(){
  background("white");  //Limpia y colorea pantalla
  
   //Agrega el marcador
  fill("blue"); //Cambia el color del marcador
  text("Score: " + score, 500, 20); //Marcador
  
  //Estado del juego: PLAY
  if(gameState === PLAY){
    
    //Estados del Juego
    gameOver.visible = false;
    restart.visible = false;
    
    //Mueve el suelo
    ground.velocityX = -(4 + 3* score/200);  
    
    //Puntuación regresa a 0 al reiniciar juego
    score = score + Math.round(getFrameRate()/60); 
    
    if(score>0 && score%200 === 0){
      checkPointSound.play();
    }
    
    if(ground.x < 0){
    ground.x = ground.width/2;
      
    }
     
    if(keyDown("space") && trex.y >= 150){
      trex.velocityY = -13;
      jumpSound.play();
    }
    
    //Agrega gravedad
    trex.velocityY = trex.velocityY + 0.8;
    
    if(obstaclesGroup.isTouching(trex)){
      //trex.velocityY = -12;
      //jumpSound.play();
      gameState = END;
      dieSound.play();
    }
    
  }
  //Estado del juego: FIN
  else if(gameState === END){
    gameOver.visible = true;
    restart.visible = true;
    
    ground.velocityX = 0;
    trex.velocityY=0;
    
    //Trex cambia al chocar con un obstáculo
    trex.changeAnimation("collided",trex_collided);  
    //Ciclo de vida de los objetos para que no sean destruidos nunca
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
  }  
   
    //Aparece las nubes
  spawnClouds();
  
  //Aparecen los obstáculos
  spawnObstacles();
  
  //Evita que el trex se caiga
  trex.collide(invisibleGround);
  
  if(mousePressedOver(restart)){
    console.log("Reiniciar el juego");
    reset();
  }
    
  drawSprites();
  
}


function reset(){
  
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  //Cambiar animación del Trex
  trex.changeAnimation("running", trex_running);
  
  //Destruir nubes y obstáculos
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  //Marcador en 0 al reiniciar el juego
  score = 0;

}

function spawnObstacles(){
  if(frameCount % 60 === 0){
    obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -(6 + score/200);

    //Generar obstáculos al azar
    rand = Math.round(random(1,6));
    switch(rand){
      case 1: obstacle.addImage(obstacle1);
        break;
      case 2: obstacle.addImage(obstacle2);
        break;
      case 3: obstacle.addImage(obstacle3);
        break;
      case 4: obstacle.addImage(obstacle4);
        break;
      case 5: obstacle.addImage(obstacle5);
        break;
      case 6: obstacle.addImage(obstacle6);
        break;
        default: break;
        
    }
    
    //asigna escala y ciclo de vida al obstáculo
    obstacle.scale = 0.5;
    obstacle.lifetime = 180;
    
    //añade cada obstáculo al grupo
    obstaclesGroup.add(obstacle);
    
    //console.log("obstacle", rand);  //la consola ve que caso se está manifestando
  }
}

function spawnClouds(){
  
  //Código para aparecer las nubes
  if(frameCount % 60 === 0){
    cloud = createSprite(600,150,40,10);
    cloud.addImage(cloudImage);
    cloud.y = Math.round(random(10,60));
    cloud.scale = 0.6;
    cloud.velocityX = -3;
    
    //asigna un ciclo de vida a la variable
    cloud.lifetime = 220;
    
    //ajusta la profundidad
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //añade cada nuble al grupo
    cloudsGroup.add(cloud);
  }
}