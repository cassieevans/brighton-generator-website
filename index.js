const styles = document.createElement("style")
styles.innerText = `
.falling-horse {
	position: absolute;
	top: 0;
	left: 0;
	pointer-events: none;
}
`
document.head.appendChild(styles)

// we can keep horsen in this set
const horsen = new Set()

const G = 0.05
const terminalV = 10

class Horse {

	constructor (x, y) {

		const size = Math.random() * 5
		const rotation = Math.random() * 2


		const element = document.createElement("div")
		element.classList = "falling-horse"
		element.innerText = "🐎"

		this.size = size
		this.rotation = rotation
		this.x = x
		this.y = y

		this.domNode = element

		this.v = {
			x: (Math.random() * 10) - 5, 
			y: (Math.random() * 5) - 2.5,
			rot: (Math.random() * 0.2) - 0.1
		}

		this.deltaV = {
			x (prevX) { return prevX * 0.9 },
			y (prevY) {
				// if we've hit terminal velocity, stop accelerating
				if (prevY >= terminalV) return terminalV
				if (prevY <= -terminalV) return -terminalV
				// grow the velocity in the Y direction by the force of gravity
				return prevY + G // make gravity bigger for bigger horses. this will make a parallax effect
			}
		}

		this.setPosition()
		document.body.appendChild(element)
	}

	setPosition () {
		try {
			this.domNode.style=`transform: translate(${this.x}px, ${this.y}px) rotate(${this.rotation}rad); font-size: ${this.size}em;`
		} catch (_e) {

		}
	}

	move () {

		if (!horsen.has(this)) return // we've already been removed
		

		// if this horse has fallen off the bottom of the screen, remove it from the DOM
		// and delete it from the set of all horses
		// otherwise, set it's new position
		if (this.y > document.body.getBoundingClientRect().height - 150) {
			this.v.y = -0.8 * this.v.y
			this.v.rot = (Math.random() * 0.2) - 0.1
			// this.v.x = (Math.random() * 10) - 5
			if (this.v.y > -0.3) {
				horsen.delete(this)
				try {
					document.body.removeChild(this.domNode)
				} catch (_e) {

				}
			}
		}

		// move the horse according to current velocity
		this.x = this.x + this.v.x
		this.y = this.y + this.v.y
		this.rotation = this.rotation + this.v.rot

		// accelerate the horse
		this.v.x = this.deltaV.x(this.v.x)
		this.v.y = this.deltaV.y(this.v.y)
		this.setPosition()
		
	}
}

let animationRunning = false

const handler = function (e) {
	const horse = new Horse(e.pageX - 5, e.pageY - 5)
	horsen.add(horse)
	if (!animationRunning) runAnimation()
}

document.body.addEventListener("mousedown", handler)


function frame () {

	for (const horse of horsen) {
		horse.move()
	}

	if (horsen.size == 0) {
		animationRunning = false
	}

	if (animationRunning) {
		window.requestAnimationFrame(frame)
	}

}

function runAnimation () {
	animationRunning = true
	frame()
}

(() => { 
	let path = document.createElementNS('http://www.w3.org/2000/svg', "path");
	let SVG = document.querySelector(".logo");
	let size = 500;
	let start = 0;

	let options = {
		numberOfShapes: Math.floor(Math.random() * 15) + 7,
    spreadOfShapes: Math.floor(Math.random() * 30) + 1,
    hue: Math.floor(Math.random() * 360) + 1,
    hueSpread: Math.floor(Math.random() * 30) + 5,
    strokeWidth: Math.floor(Math.random() * 50) + 10
	};

	let p0 = { x: start, y: size };
	let p1 = { x: start, y: size / 2 };
	let p2 = { x: start, y: start };
	let p3 = { x: size / 2, y: start };
	let p4 = { x: size, y: start };
	let p5 = { x: size, y: size / 2 };
	let p6 = { x: size, y: size };
	let p7 = { x: size / 2, y: size };
	let p8 = { x: start, y: size };


	function smallerShape(number) {
		p0.x += number;
		p0.y -= number;
		p1.x += number;
		p2.x += number;
		p2.y += number;
		p3.y += number;
		p4.x -= number;
		p4.y += number;
		p5.x -= number;
		p6.x -= number;
		p6.y -= number;
		p7.y -= number;
		p8.x += number;
		p8.y -= number;

		let newpath = document.createElementNS('http://www.w3.org/2000/svg', "path");
		SVG.appendChild(newpath);

		newpath.setAttribute("d", ["M", p0.x, p0.y, "L", p1.x, p1.y, "Q", p2.x, p2.y, p3.x, p3.y, "L", p4.x, p4.y, "L", p5.x, p5.y, "Q", p6.x, p6.y, p7.x, p7.y, "L", p8.x, p8.y].join(" "));


		let color = `hsla(${options.hue + p0.x / 10 * options.hueSpread},49%,55%)`

		newpath.setAttribute("stroke", color);
		newpath.setAttribute("stroke-width", options.strokeWidth);
	}

	function clearSVG() {
		while (SVG.lastChild) {
			SVG.removeChild(SVG.lastChild);
		}
	}

	function resetPoints() {
		p0 = { x: start, y: size };
		p1 = { x: start, y: size / 2 };
		p2 = { x: start, y: start };
		p3 = { x: size / 2, y: start };
		p4 = { x: size, y: start };
		p5 = { x: size, y: size / 2 };
		p6 = { x: size, y: size };
		p7 = { x: size / 2, y: size };
		p8 = { x: start, y: size };
	}

	function makeShapes() {
		resetPoints()
		clearSVG();
		for (i = 0; i < options.numberOfShapes; i++) {
			smallerShape(options.spreadOfShapes);
		}

	}

	makeShapes();

	let firstPath = SVG.querySelector('path:first-of-type');
	let secondPath = SVG.querySelector('path:last-of-type');

	let primaryColor = firstPath.getAttribute("stroke");
	let secondaryColor = secondPath.getAttribute("stroke");

	document.documentElement.style.setProperty('--primary-color', primaryColor);
	document.documentElement.style.setProperty('--secondary-color', secondaryColor);

})();