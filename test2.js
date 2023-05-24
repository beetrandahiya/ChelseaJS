
elem = document.getElementById("container");
setCanvas(elem);

w = WIDTH;
h = HEIGHT;


//define the implicit function
function f(x, y) {
    return (x-w/2)**3 + (y-200)*(y-200)+  - 10000;
}



ii = 1;



function draw() {
   clearCanvas();

t0=performance.now();
 
//draw the implicit function
var points = marchingSquares(f, 0, 0, w, 0, h, h/2);

//take the first point and sort the points such that the next point is the closest to the previous point
var points2 = [];
var p = points[0];
points2.push(p);
points.splice(0,1);
while (points.length > 0) {
    var min = 1000000
    var index = 0;
    for (var i = 0; i < points.length; i++) {
        var d = dist(p[0], p[1], points[i][0], points[i][1]);
        if (d < min) {
            min = d;
            index = i;
        }
    }
    p = points[index];
    points2.push(p);
    points.splice(index,1);
}




//draw the points
new polygon(points2, "red", 0.1, "red",1,false);

// requestAnimationFrame(draw);


t1=performance.now();

console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

draw();
      
         


////////////////////////
// Marching Squares
////////////////////////
function marchingSquares(zFunc, c, xMin, xMax, yMin, yMax, resolution){
var xStep = (xMax - xMin) / resolution;
		var yStep = (yMax - yMin) / resolution;
		var points = [];
		for (var x = xMin; x < xMax; x += xStep)
		{
			for (var y = yMin; y < yMax; y += yStep)
			{
				var z1 = zFunc(x,y);				// bottom left corner
				var z2 = zFunc(x+xStep, y);			// bottom right corner
				var z4 = zFunc(x+xStep, y+yStep);	// top right corner
				var z8 = zFunc(x, y+yStep);			// top left corner
				var n = 0;
				if (z1 > c) n += 1;
				if (z2 > c) n += 2;
				if (z4 > c) n += 4;
				if (z8 > c) n += 8;
				
				// calculate linear interpolation values along the given sides.
				//  to simplify, could assume each is 0.5*xStep or 0.5*yStep accordingly.
				var bottomInterp 	= (c - z1) / (z2 - z1) * xStep;
				var topInterp 		= (c - z8) / (z4 - z8) * xStep;
				var leftInterp 		= (c - z1) / (z8 - z1) * yStep;
				var rightInterp 	= (c - z2) / (z4 - z2) * yStep;
				
				// for a visual diagram of cases: https://en.wikipedia.org/wiki/Marching_squares
				if (n == 1 || n == 14) // lower left corner
					points.push( [x, y+leftInterp, c], [x+bottomInterp, y, c] );
					
				else if (n == 2 || n == 13) // lower right corner
					points.push( [x+bottomInterp, y, c], [x+xStep, y+rightInterp, c] );
					
				else if (n == 4 || n == 11) // upper right corner
					points.push( [x+topInterp, y+yStep, c], [x+xStep, y+rightInterp, c] );
					
				else if (n == 8 || n == 7) // upper left corner
					points.push( [x, y+leftInterp, c], [x+topInterp, y+yStep, c] );
					
				else if (n == 3 || n == 12) // horizontal
					points.push( [x, y+leftInterp, c], [x+xStep, y+rightInterp, c] );
					
				else if (n == 6 || n == 9) // vertical
					points.push( [x+bottomInterp, y, c], [x+topInterp, y+yStep, c] );
					
				else if (n == 5) // should do subcase // lower left & upper right
					points.push( [x, y+leftInterp, c], [x+bottomInterp, y, c], [x+topInterp, y+yStep, c], [x+xStep, y+rightInterp, c] );
					
				else if (n == 10) // should do subcase // lower right & upper left
					points.push( [x+bottomInterp, y, c], [x+xStep, y+rightInterp, c], [x, y+yStep/2, c], [x, y+leftInterp, c], [x+topInterp, y+yStep, c] );
					
				else if (n == 0 || n == 15) // no line segments appear in this grid square.
					points.push();
				
			}
		}
		return points;
	
  }