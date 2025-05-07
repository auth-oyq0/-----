// By Roni Kaufman
// https://ronikaufman.github.io

// Made for Genuary 2025
// Day 10: You can only use TAU in your code, no other number allowed.

let ZERO, ONE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE, TEN, HUNDRED;

let circles = [];
let backGrph, frontGrph, rMin;
let backCol = "#fffbe6";

function setup() {
	let digits = [...new Set(str(TAU).split("").filter((el) => (el != ".")))].sort().map((el) => int(el));
	[ZERO, ONE, TWO, THREE, FIVE, SIX, SEVEN, EIGHT, NINE] = [...digits];
	FOUR = TWO+TWO;
	TEN = FIVE+FIVE;
	HUNDRED = TEN*TEN;
	
	const canvas = createCanvas(windowWidth, windowHeight * 0.6);
	canvas.parent('hero');
	
	let palette = ["#b3dce0", "#62b6de", "#2b67af"];
	for (let i = 0; i < 25; i++) {
		circles.push({
			x: random(width),
			y: random(height),
			col: palette[i%palette.length]
		});
	}

	backGrph = createGraphics(width, height);
	backGrph.background(backCol);
	backGrph.noStroke();
	frontGrph = createGraphics(width, height);
	frontGrph.noStroke();
	
	rMin = ONE;
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight * 0.6);
}

function draw() {
	displacement();
	if (mouseX > ZERO && mouseX < width && mouseY > ZERO && mouseY < height) {
		circles[ZERO].x = mouseX;
		circles[ZERO].y = mouseY;
	}
	circlePacking();

	backGrph.background(backCol + TEN);
	frontGrph.clear();

	for (let c of circles) {
		if (c.r > rMin) {
			backGrph.fill(c.col);
			backGrph.circle(c.x, c.y, TWO * c.r - rMin);
			frontGrph.fill(FIVE, TWO*HUNDRED + TWO*TEN + FIVE);
			frontGrph.circle(c.x, c.y, TWO * c.r - rMin);
		}
	}

	image(backGrph, ZERO, ZERO);
	image(frontGrph, ZERO, ZERO);
}

function displacement() {
	let density = SEVEN*TEN + FIVE;
	let id = ZERO;
	for (let c of circles) {
		let theta = noise(c.x/density, c.y/density, id++) * FOUR * TAU;
		let r = ONE/TWO + noise(id, frameCount/HUNDRED)/TWO;
		c.x += r * cos(theta);
		c.y += r * sin(theta);

		if (c.x < rMin || c.x > width - rMin || c.y < rMin || c.y > height - rMin) {
			c.x = random(width);
			c.y = random(height);
		}
	}
}

function circlePacking() {
	for (let c of circles) {
		c.r = rMin;
		c.growing = true;
	}

	let step = ONE/TWO;
	let oneGrew = true;
	while (oneGrew) {
		oneGrew = false;
		for (let c of circles) {
			if (c.growing) {
				c.r += step;
				if (fitsInCompo(c)) {
					oneGrew = true;
				} else {
					c.r -= step;
					c.growing = false;
				}
			}
		}
	}
}

function distToCircleSquared(x, y, c) {
	return (sq(c.x - x) + sq(c.y - y));
}

function fitsInCompo({x: x, y: y, r: r}) {
	if (x - r < ZERO || x + r > width || y - r < ZERO || y + r > height) return false;
	for (let c of circles) {
		if ((c.x != x || c.y != y) && distToCircleSquared(x, y, c) < sq(c.r + r)) return false;
	}
	return true;
}