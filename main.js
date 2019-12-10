class ParticleClass {
	constructor(){
		this.data_oriented = true
		this.numParticlesPerSec = 20,
		this.previousTime = Date.now()
		this.currentTime = Date.now()
		this.partialParticles = 0
		this.oopData = {
			particleProperties: {},
			environmentProperties: {},
		}
		this.dodData = {
			emitter: [],
			environment: [],
			particles: [],
		}
	}
	generateOopData(){}
	generateDodData(){
		// emitter: 16 bit signed integers
		this.dodData.emitter.push(this.numParticlesPerSec) // birthRate
		this.dodData.emitter.push(0) // velocity x
		this.dodData.emitter.push(0) // velocity y
		this.dodData.emitter.push(0) // velocity z
		this.dodData.emitter.push(50) // x
		this.dodData.emitter.push(50) // y
		this.dodData.emitter.push(0) // z
		this.dodData.emitter.push(100) // width
		this.dodData.emitter.push(100) // height
		this.dodData.emitter.push(0) // depth

		// environment: 16 bit unsigned integers
		this.dodData.environment.push(200) // gravity
		this.dodData.environment.push(0) // friction
		this.dodData.environment.push(0) // turbulence
	}
	generateParticle(x, y, z, r, g, b, a){
		// particle position: 16 bit signed integers
		this.dodData.particles.push(x) // x
		this.dodData.particles.push(y) // y
		this.dodData.particles.push(z) // z

		// particle color: 8 bit unsigned integers
		this.dodData.particles.push(r) // r
		this.dodData.particles.push(g) // g
		this.dodData.particles.push(b) // b

		// particle alpha: 8 bit unsigned integer
		this.dodData.particles.push(a) // alpha
	}
	emitParticles(numParticles){
		for (let i = 0; i < numParticles; i++){
			this.generateParticle(
				this.dodData.emitter[4], // x
				this.dodData.emitter[5], // y
				this.dodData.emitter[6], // z
				255, // r
				255, // g
				255, // b
				255, // a
			)
		}

	}
	renderParticles(){
		for (let i = 0; i < this.dodData.particles.length/7; i += 7){
			const particles = this.dodData.particles
			// recalculate position
			particles[i+1] += (this.dodData.environment[0]/255 * 0.4 * (this.currentTime-this.previousTime))

			ctx.save()
			ctx.fillStyle = `rgba(${particles[i+3]},${particles[i+4]},${particles[i+5]},${particles[i+6]/255})`
			ctx.beginPath()
			ctx.arc(
				particles[i+0] + Math.random()*particles[i+7]*-0.5,
				particles[i+1] + Math.random()*particles[i+8]*-0.5,
				4,
				0,
				Math.PI*2)
			ctx.closePath()
			ctx.fill()
			ctx.restore()
		}
	}
	program(){
		if (this.data_oriented){
			this.generateDodData()
			const animation = ()=>{
				this.previousTime = this.currentTime
				this.currentTime = Date.now()
				const passedTime = this.currentTime - this.previousTime
				const numParticles = passedTime/1000*this.numParticlesPerSec + this.partialParticles
				this.partialParticles = numParticles%1

				this.emitParticles(Math.floor(numParticles))
				this.renderParticles()

				window.requestAnimationFrame(animation)
			}
			animation()

		} else {
		}
	}
}

const Particles = new ParticleClass()
Particles.program()
