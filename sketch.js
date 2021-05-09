var dog, dogImg, happyDog, database, foodS, feed, FoodStock, addfood, milkBottle2;
var fedTime, lastFed, foodObj;
var garden, washRoom, bedRoom, livingRoom;
var gameState = 1;
var food;

function preload() {
garden = loadImage("images/Garden.png");
washRoom = loadImage("images/Wash Room.png");
bedRoom = loadImage("images/Bed Room.png");
dogImg = loadImage("images/dogImg.png");
happyDog = loadImage("images/dogImg1.png");
milkBottle2 = loadImage("images/milk.png");
sadDog = loadImage("images/Lazy.png");
livingRoom = loadImage("images/Living Room.png");
}

function setup() {
createCanvas(600, 500);
database = firebase.database();  

foodS = database.ref('Food');
foodS.on("value", readStock);

readState = database.ref('gameState');
readState.on("value", function(data){
gameState = data.val();
});

dog = createSprite(500, 400, 100, 100);
dog.addImage(dogImg);

foodObj = new Food();

milkBottle = createSprite(120, 440, 10, 10);
milkBottle.addImage(milkBottle2);
milkBottle.scale = 0.7;

fedTime = database.ref('FeedTime');
fedTime.on("value", function(data){
lastFed = data.val();
});
}

function draw() { 
background("yellow");

if(foodS == 0) {
   dog.addImage(happyDog);
   milkBottle2.visible = false;
} else {
   dog.addImage(happyDog);
   milkBottle2.visible = true;
}

var button = createButton("FEED THE DOG");
button.position(400, 120);
if(button.mousePressed(function(){
   foodS = foodS -1;
   gameState = 1;
   database.ref('/').update({'gameState': gameState});
   database.ref('/').update({'Food': foodS});
})); 
if(gameState === 1) {
    dog.addImage(happyDog);
    dog.scale = 1;
    dog.y = 250;
}

var addFood = createButton("ADD FOOD");
addFood.position(525, 120);
if(addFood.mousePressed(function(){
   foodS = foodS+1;
   gameState = 2;
   database.ref('/').update({'gameState': gameState});
   database.ref('/').update({'Food': foodS});
}));
if(gameState === 2) {
    dog.addImage(dogImg);
    dog.scale = 0.175;
    milkBottle2.visible = true;
    dog.y = 250;
}

var Bath = createButton("I WANT TO TAKE BATH");
Bath.position(620, 120);
if(Bath.mousePressed(function(){
   gameState = 3;
   database.ref('/').update({'gameState': gameState});
}));
if(gameState === 3) {
   dog.addImage(washRoom);
   dog.scale = 1;
   milkBottle2.visible = false;
}

var Sleep = createButton("I AM SLEEPY");
Sleep.position(840, 85);
if(Sleep.mousePressed(function(){
   gameState = 4;
   database.ref('/').update({'gameState': gameState});
}));
if(gameState === 4) {
   dog.addImage(bedRoom);
   dog.scale = 0.8;
   milkBottle2.visible = false;
}

var Play = createButton("LETS PLAY!!!");
Play.position(725, 85);
if(Play.mousePressed(function(){
   gameState = 5;
   database.ref('/').update({'gameState': gameState});
}));
if(gameState === 5) {
   dog.addImage(livingRoom);
   dog.scale = 0.8;
   milkBottle2.visible = false;
}

var PlayInGarden = createButton("LETS PLAY IN PARK");
PlayInGarden.position(800, 120);
if(PlayInGarden.mousePressed(function(){
   gameState = 6;
   database.ref('/').update({'gameState': gameState});
}));
if(gameState === 6) {
   dog.y = 250;
   dog.addImage(garden);
   dog.scale = 0.7;
   milkBottle2.visible = false;
}

fill("red");
textSize(15);
currentTime = hour();
lastFed = currentTime;
if(lastFed >= 12) {
text("Last Feed : "+ lastFed % 12 + "PM", 100, 50);
} else if(lastFed == 0) {
text("last Feed : 12 AM", 100, 50);
} else {
text("last Feed : "+ lastFed + "AM", 100, 50);
}

foodObj.display();

textSize(20);
fill("blue");
text("MILK BOTTLES REMAINING:"+foodS, 150, 450);

drawSprites();
}

function readStock(data) {
foodS = data.val();
foodObj.updateFoodStock(foodS);
}

function writeStock(foodS) {
database.ref('/').update({
Food: foodS
});
}

function showError() {

}   

function feedDog() {
dog.addImage(happyDog);

foodObj.updateFoodStock(foodObj.getFoodStock()-1);
database.ref('/').update({
Food: foodObj.getFoodStock(),
FeedTime: hour()
})
}

function addFoods(foodS) {
foodS++;
database.ref('/').update({
Food: foodS
})
}

function update(state) {
database.ref('/').update({
gameState: state
});
}