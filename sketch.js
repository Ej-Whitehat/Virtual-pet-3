var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var gamestate, readState;
var Bedroom, WashRoom, garden;

function preload(){
  sadDog=loadImage("images/Dog.png");
  happyDog=loadImage("images/Happy.png");
  DeadDog=loadImage("images/deadDog.png");
  Bedroom=loadImage("images/Bed Room.png");
  Vaccination=loadImage("images/dogVaccination.png");
  foodStockIMG=loadImage("images/Food Stock.png");
  garden=loadImage("images/Garden.png");
  injection=loadImage("images/Injection.png");
  lazyDog=loadImage("images/Lazy.png");
  LivingRoom=loadImage("images/Living Room.png");
  run=loadImage("images/running.png");
  LeftRun=loadImage("images/runningLeft.png");
  Vaccination2=loadImage("images/Vaccination.jpg");
  WashRoom=loadImage("images/Wash Room.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,500);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  readState = database.ref('gamestate');
  readState.on("value",function(data){
    gamestate=data.val();
  });
}

function draw() {
  background(46,139,87);
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
  }else if(lastFed==0){
    text("Last Feed : 12 AM",350,30);
  }else{
    text("Last Feed : "+ lastFed + " AM", 350,30);
  }

  currentTime=hour;
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime==(lastFed+2)){
    update("sleeping");
    foodObj.bedroom();
  }else if(currentTime==(lastFed+3)){
    update("bathing");
    foodObj.washroom();
  }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gamestate:state
  });
}