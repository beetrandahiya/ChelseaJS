elem = document.getElementById("container");
setCanvas(elem);

w = WIDTH;
h = HEIGHT;

var t = 1;
//define the implicit function
function f(x, y) {
	x = x - w / 2;
	y = y - h / 2 - 50;
	return (x / 100) ** 2 + ((-y / 100) - sqrt(abs(x / 100))) ** 2 + -t;
}



ii = 1;

var ll = 2000;

function draw() {
	clearCanvas();

	t0 = performance.now();
	//make a radial gradient

	new Gradient("radial", [
		["0%", "#f049"],
		["100%", "#f040"]
	], "pad", "grad")

	//draw the implicit function
	var points = marchingSquares(f, 0, 0, w, 0, h, h / 2);
	/*
	//remove the points that are too close to each other
	var pointsfar = [];
	for (var i = 0; i < points.length; i++) {
		var p = points[i];
		var far = true;
		for (var j = 0; j < pointsfar.length; j++) {
			var q = pointsfar[j];
			if (dist(p[0], p[1], q[0], q[1]) < 1) {
				far = false;
				break;
			}
		}
		if (far) pointsfar.push(p);
	}
	points = pointsfar;
	*/
	/*
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


	*/
	//draw the points
	//new polygon(points2.splice(0,ll), "red", 0, "red",2,false);
	//draw a grid
	for (var i = 0; i < w; i += w / 10) {
		new line(i, 0, i, h, "#0005", 1);
	}
	for (var i = 0; i < h; i += h / 10) {
		new line(0, i, w, i, "#0005", 1);
	}
	new circle(w / 2, h / 2, 300, "url(#grad)", 1, "#0000", 1);


	t1 = performance.now();
	console.log("Call to calculate took " + (t1 - t0) + " milliseconds.")
	t0 = performance.now();
	for (var i = 0; i < points.length; i++) {
		var p1 = points[i][0];
		var p2 = points[i][1];
		new line(p1[0], p1[1], p2[0], p2[1], "black", 1.5);
	}
	//requestAnimationFrame(draw);



	//make a blurry circle

	ll += 1;
	t1 = performance.now();

	console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
	t0 = performance.now();
	quadtree(f, 0,0,0,w,h,0);
	t1 = performance.now();
	console.log("Call to quadtree took " + (t1 - t0) + " milliseconds.")
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

draw();




////////////////////////
// Marching Squares
////////////////////////
function marchingSquares(zFunc, c, xMin, xMax, yMin, yMax, resolution) {
	var xStep = (xMax - xMin) / resolution;
	var yStep = (yMax - yMin) / resolution;
	var points = [];
	for (var x = xMin; x < xMax; x += xStep) {
		for (var y = yMin; y < yMax; y += yStep) {
			var z1 = zFunc(x, y); // bottom left corner
			var z2 = zFunc(x + xStep, y); // bottom right corner
			var z4 = zFunc(x + xStep, y + yStep); // top right corner
			var z8 = zFunc(x, y + yStep); // top left corner
			var n = 0;
			if (z1 > c) n += 1;
			if (z2 > c) n += 2;
			if (z4 > c) n += 4;
			if (z8 > c) n += 8;

			// calculate linear interpolation values along the given sides.
			//  to simplify, could assume each is 0.5*xStep or 0.5*yStep accordingly.
			var bottomInterp = (c - z1) / (z2 - z1) * xStep;
			var topInterp = (c - z8) / (z4 - z8) * xStep;
			var leftInterp = (c - z1) / (z8 - z1) * yStep;
			var rightInterp = (c - z2) / (z4 - z2) * yStep;

			// for a visual diagram of cases: https://en.wikipedia.org/wiki/Marching_squares
			if (n == 1 || n == 14) // lower left corner
				points.push([
					[x, y + leftInterp, c],
					[x + bottomInterp, y, c]
				]);

			else if (n == 2 || n == 13) // lower right corner
				points.push([
					[x + bottomInterp, y, c],
					[x + xStep, y + rightInterp, c]
				]);

			else if (n == 4 || n == 11) // upper right corner
				points.push([
					[x + topInterp, y + yStep, c],
					[x + xStep, y + rightInterp, c]
				]);

			else if (n == 8 || n == 7) // upper left corner
				points.push([
					[x, y + leftInterp, c],
					[x + topInterp, y + yStep, c]
				]);

			else if (n == 3 || n == 12) // horizontal
				points.push([
					[x, y + leftInterp, c],
					[x + xStep, y + rightInterp, c]
				]);

			else if (n == 6 || n == 9) // vertical
				points.push([
					[x + bottomInterp, y, c],
					[x + topInterp, y + yStep, c]
				]);

			else if (n == 5) // should do subcase // lower left & upper right
				points.push([
					[x, y + leftInterp, c],
					[x + bottomInterp, y, c],
					[x + topInterp, y + yStep, c],
					[x + xStep, y + rightInterp, c]
				]);

			else if (n == 10) // should do subcase // lower right & upper left
				points.push([
					[x + bottomInterp, y, c],
					[x + xStep, y + rightInterp, c],
					[x, y + yStep / 2, c],
					[x, y + leftInterp, c],
					[x + topInterp, y + yStep, c]
				]);

			else if (n == 0 || n == 15) // no line segments appear in this grid square.
				points.push();

		}
	}
	return points;

}

////////////////////////
// Quadtree to calculate only the points that are needed
////////////////////////


function quadtree(zFunc, c, x, y, dx, dy, depth) {
	var SEARCH_DEPTH = 1;
var PLOT_DEPTH = 8;
	//console.log("quadtree");
	//console.log(depth);
	if (depth < SEARCH_DEPTH) {
		dx = dx / 2;
		dy = dy / 2;
		quadtree(zFunc, c, x, y, dx, dy, depth + 1);
		quadtree(zFunc, c, x + dx, y, dx, dy, depth + 1);
		quadtree(zFunc, c, x, y + dy, dx, dy, depth + 1);
		quadtree(zFunc, c, x + dx, y + dy, dx, dy, depth + 1);
		//console.log("searching 1");
	} else {
		if (hasSegment(zFunc, c, x, y, dx, dy)) {
			if (depth >= PLOT_DEPTH) {
			//	console.log("plotting");
				a=addSegment(zFunc, c, x, y, dx, dy);
			//	console.log(a);
			} else {
				dx = dx / 2;
				dy = dy / 2;
			//	console.log("searching 2");
				quadtree(zFunc, c, x, y, dx, dy, depth + 1);
				quadtree(zFunc, c, x + dx, y, dx, dy, depth + 1);
				quadtree(zFunc, c, x, y + dy, dx, dy, depth + 1);
				quadtree(zFunc, c, x + dx, y + dy, dx, dy, depth + 1);
			}
		}
		else{
			//console.log("no segment");
		}
	}
}

function hasSegment(zFunc, c, x, y, dx, dy) {
	var z1 = zFunc(x, y); // bottom left corner
	var z2 = zFunc(x + dx, y); // bottom right corner
	var z4 = zFunc(x + dx, y + dy); // top right corner
	var z8 = zFunc(x, y + dy); // top left corner
	var n = 0;
	if (z1 > c) n += 1;
	if (z2 > c) n += 2;
	if (z4 > c) n += 4;
	if (z8 > c) n += 8;
	//console.log(n != 0 && n != 15);
	return n != 0 && n != 15;
}

function addSegment(zFunc, c, x, y, dx, dy) {
	var xStep = dx;
	var yStep = dy;
	var points = [];
	var z1 = zFunc(x, y); // bottom left corner
	var z2 = zFunc(x + xStep, y); // bottom right corner
	var z4 = zFunc(x + xStep, y + yStep); // top right corner
	var z8 = zFunc(x, y + yStep); // top left corner
	var n = 0;
	if (z1 > c) n += 1;
	if (z2 > c) n += 2;
	if (z4 > c) n += 4;
	if (z8 > c) n += 8;

	// calculate linear interpolation values along the given sides.
	//  to simplify, could assume each is 0.5*xStep or 0.5*yStep accordingly.
	var bottomInterp = (c - z1) / (z2 - z1) * xStep;
	var topInterp = (c - z8) / (z4 - z8) * xStep;
	var leftInterp = (c - z1) / (z8 - z1) * yStep;
	var rightInterp = (c - z2) / (z4 - z2) * yStep;

	// for a visual diagram of cases: https://en.wikipedia.org/wiki/Marching_squares
	if (n == 1 || n == 14) // lower left corner
		points.push([
			[x, y + leftInterp, c],
			[x + bottomInterp, y, c]
		]);

	else if (n == 2 || n == 13) // lower right corner
		points.push([
			[x + bottomInterp, y, c],
			[x + xStep, y + rightInterp, c]
		]);

	else if (n == 4 || n == 11) // upper right corner
		points.push([
			[x + topInterp, y + yStep, c],
			[x + xStep, y + rightInterp, c]
		]);

	else if (n == 8 || n == 7) // upper left corner
		points.push([
			[x, y + leftInterp, c],
			[x + topInterp, y + yStep, c]
		]);

	else if (n == 3 || n == 12) // horizontal
		points.push([
			[x, y + leftInterp, c],
			[x + xStep, y + rightInterp, c]
		]);

	else if (n == 6 || n == 9) // vertical
		points.push([
			[x + bottomInterp, y, c],
			[x + topInterp, y + yStep, c]
		]);

	else if (n == 5) // should do subcase // lower left & upper right
		points.push([
			[x, y + leftInterp, c],
			[x + bottomInterp, y, c],
			[x + topInterp, y + yStep, c],
			[x + xStep, y + rightInterp, c]
		]);

	else if (n == 10) // should do subcase // lower right & upper left
		points.push([
			[x + bottomInterp, y, c],
			[x + xStep, y + rightInterp, c],
			[x, y + yStep / 2, c],
			[x, y + leftInterp, c],
			[x + topInterp, y + yStep, c]
		]);

	else if (n == 0 || n == 15) // no line segments appear in this grid square.
		points.push();



	//draw the line segments
	for (var i = 0; i < points.length; i++) {
		var p1=points[i][0];
		var p2=points[i][1];
		new line(p1[0], p1[1], p2[0], p2[1],"#000",2);
	}
	return points;
}