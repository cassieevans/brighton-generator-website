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

const breeds = ["🐼"]

class Horse {

	constructor (x, y) {

		const size = Math.random() * 5
		const rotation = Math.random() * 2

		const element = document.createElement("div")
		element.classList = "falling-horse"
		element.innerText = breeds[Math.floor(Math.random() * 6)]

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
		// I'm using try catch, because sometimes this seems to fire after the 
		// domNode has already been removed
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
			
			// horses that have slowed down sufficiently are retired.
			if (this.v.y > -0.3) {
				horsen.delete(this)
				// I'm using try catch, because sometimes this seems to fire after the 
				// domNode has already been removed
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