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
    strokeWidth: Math.floor(Math.random() * 40) + 4
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

	gsap.from(".logo > path", {
		duration: 1,
		opacity: 0,
		scale: 0.6,
		transformOrigin: 'center',
		ease: "sine.out",
		stagger: {
			from: "start",
			amount: 1,
		}
	});

})();