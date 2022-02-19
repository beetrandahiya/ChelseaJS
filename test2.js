elem = document.getElementById("container");
setCanvas(elem);

w = WIDTH;
h = HEIGHT;


t=0;

//make angular gradient





function draw() {

  // clearCanvas();

  new arc(w/2,h/2,100,100,-3*PI/4-PI/2,PI/4,'open', "blue",0,'red',50);

   t+=0.01;

 //  requestAnimationFrame(draw);
}


///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

draw();