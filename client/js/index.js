// Variables

var roadImg, carImg, cancelImg;
var items = [];
var ctx,diffx,diffy;
var roadMode = false;
var carMode = false;

var Pos1 = new Object();
var Pos2 = new Object();
Pos1.x = 0;
Pos1.y = 0;
Pos2.x = 0;
Pos2.y = 0;

var tempCar = new Image();

// Setup

$(document).ready(function () {
	console.log("testing");

	ctx = document.getElementById('canvas').getContext('2d');
	var cvs = document.getElementById('canvas');
	cvs.width  = $(window).width();
	cvs.height  = $(window).height()-50;
	canvas.addEventListener("mousedown", mouseDown, false);
	canvas.addEventListener("mousemove", mouseMove, false);
	canvas.addEventListener("mouseup", mouseUp, false);

	canvas.addEventListener("touchstart", touchDown, false);

	// Load items
	roadImg = new Image();
	roadImg.src = "/assets/road.png";
	setPos(roadImg,75,10);

	carImg = new Image();
	carImg.src = "/assets/redcartop.png";
	setPos(carImg,300,15);

	cancelImg = new Image();
	cancelImg.src = "/assets/cancel.png";
	setPos(cancelImg,600,-10);

	items.push(roadImg);
	items.push(carImg);
	items.push(cancelImg);
	
	drawStatics();

	items.forEach(function (item) {
		item.onload = function () {
			ctx.drawImage(item,item.posx,item.posy);
		}
	});

	$('img').click(function(){
	    if ($(this).hasClass('isSelected')) {
	   		$('.isSelected').removeClass('isSelected');
	    } else {
		   $('.isSelected').removeClass('isSelected');
		   $(this).addClass('isSelected');
	    }
	});
});

// Mouse Events

function touchDown(event) {
	event.preventDefault();

	if (Pos1.x == 0 && Pos1.y == 0) {
		$('#info').text("set first");
		Pos1.x = event.targetTouches[0].pageX;
		Pos1.y = event.targetTouches[0].pageY;
	} else {
		Pos2.x = event.targetTouches[0].pageX;
		Pos2.y = event.targetTouches[0].pageY;

		road = new Object();
		road.isRoad = true;
		slope = (Pos2.y-Pos1.y)/(Pos2.x-Pos1.x);
		angle = -Math.atan(slope)/Math.PI*180;
		if (angle > 55) {
			Pos1.x = (Pos2.x+Pos1.x)/2;
			Pos2.x = Pos1.x;
		} else if (angle > 35) {
			ydiff = Pos2.y-Pos1.y;
			Pos2.x = Pos1.x-ydiff;
		} else if (angle > -35) {
			Pos1.y = (Pos2.y+Pos1.y)/2;
			Pos2.y = Pos1.y;
		} else if (angle > -55) {
			ydiff = Pos2.y-Pos1.y;
			Pos2.x = Pos1.x+ydiff;
		} else { 
			Pos1.x = (Pos2.x+Pos1.x)/2;
			Pos2.x = Pos1.x;
		}
		road.pos1 = Pos1;
		road.pos2 = Pos2;
		items.push(road);
		drawItems();
		Pos1.x = 0;
		Pos1.y = 0;
		Pos2.x = 0;
		Pos2.y = 0;
	}
}

function mouseDown(event) {
	Pos1.x = event.x;
	Pos1.y = event.y;

	if (isIn(event,roadImg)) {
		allFalse();
		roadMode = true;
		$(this).css('cursor', 'url(/assets/roadcursor.png), auto');
	}

	if (isIn(event,carImg)) {
		allFalse();
		carMode = true;
		$(this).css('cursor', 'url(/assets/carcursor.png), auto');
	}

	if (isIn(event,cancelImg)) {
		allFalse();
		$(this).css('cursor', 'auto');
	}

	console.log(event.x+", "+event.y);
}

function allFalse() {
	roadMode = false;
	carMode = false;
}

function mouseMove (event) {
	// todo?
}

function mouseUp (event) {
	if (roadMode && event.y > 150) {
		Pos2.x = event.x;
		Pos2.y = event.y;

		road = new Object();
		road.isRoad = true;
		slope = (Pos2.y-Pos1.y)/(Pos2.x-Pos1.x);
		angle = -Math.atan(slope)/Math.PI*180;
		if (angle > 55) {
			Pos1.x = (Pos2.x+Pos1.x)/2;
			Pos2.x = Pos1.x;
		} else if (angle > 35) {
			ydiff = Pos2.y-Pos1.y;
			Pos2.x = Pos1.x-ydiff;
		} else if (angle > -35) {
			Pos1.y = (Pos2.y+Pos1.y)/2;
			Pos2.y = Pos1.y;
		} else if (angle > -55) {
			ydiff = Pos2.y-Pos1.y;
			Pos2.x = Pos1.x+ydiff;
		} else { 
			Pos1.x = (Pos2.x+Pos1.x)/2;
			Pos2.x = Pos1.x;
		}
		road.pos1 = Pos1;
		road.pos2 = Pos2;
		items.push(road);
		drawItems();
	}

	if (carMode && event.y > 150) {
		console.log(tempCar);
		tempCar.src = "/assets/redcartop.png";
		// ctx.drawImage(tempCar,event.x,event.y);
		tempCar.onload = function() { ctx.drawImage(tempCar, event.x, event.y-35); }
	}

	console.log(Pos1);
	console.log(Pos2);
	console.log(items);
}

// Helper Methods

function isIn (event,element) {
	return event.x < element.posx+element.width && event.x > element.posx && event.y < element.posy+element.height && event.y > element.posy;
}

function setPos (element,x,y) {
	element.posx = x;
	element.posy = y;
}

function drawStatics() {
	ctx.strokeRect(0,0,$(window).width(),150);
	ctx.strokeRect(0,150,$(window).width(),$(window).height()-50);
}

function drawItems() {
	items.forEach(function (item) {
		if (item.isRoad) {
			slope = (item.pos2.y-Pos1.y)/(item.pos2.x-Pos1.x);
			angle = -Math.atan(slope);
			ctx.moveTo(item.pos1.x-Math.cos(angle)*30, item.pos1.y+Math.sin(angle)*30);
			ctx.lineTo(item.pos2.x+Math.cos(angle)*30, item.pos2.y-Math.sin(angle)*30);
			ctx.lineWidth=130;
			ctx.stroke();
			ctx.moveTo(item.pos1.x, item.pos1.y);
			ctx.lineTo(item.pos2.x, item.pos2.y);
			ctx.strokeStyle = '#FFFF00'
			ctx.lineWidth=10;
			ctx.stroke();
			ctx.strokeStyle = '#000000';
		} else {
			ctx.drawImage(item,item.posx,item.posy);
		}
	});
}

Array.prototype.remove = function (from, to) { // Remove element code snippet by John Resig, creator of jQuery
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

// Data

function sendData () {
	$.post('/data', { data: items.length }, function (data) {
		console.log(data);
	});
}

// function startDragging (event,item) {
// 	draggedItem = item;
// 	items.remove(items.indexOf(item));
// 	items.push(item);
// 	diffx = event.x - draggedItem.posx;
// 	diffy = event.y - draggedItem.posy;
// }

// function drag (event,selected) {
// 	setPos(selected,event.x-diffx,event.y-diffy);
// 	ctx.clearRect(0, 0, canvas.width, canvas.height);
// 	drawStatics();
// 	drawItems();
// }

// function startDragging (event,item) {
// 	draggedItem = item;
// 	items.remove(items.indexOf(item));
// 	items.push(item);
// 	diffx = event.x - draggedItem.posx;
// 	diffy = event.y - draggedItem.posy;
// }