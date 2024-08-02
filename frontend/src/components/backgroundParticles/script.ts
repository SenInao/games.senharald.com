type Mouse = {
  x: number
  y: number
  pressedDown: boolean
}

const mouseRadius = 150
const numberOfParticles = 400
const defaultVel = 0.5
var distanceBetweenParticles = Math.max(window.innerWidth, window.innerHeight)/17
var maxParticleSize = 1

export default class Effect {
  mouse: Mouse
  context: CanvasRenderingContext2D
  canvas: HTMLCanvasElement
  width; height: number
  particles: Particle[]

  constructor(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    this.context = context
    this.canvas = canvas
    this.width = canvas.width
    this.height = canvas.height
    this.particles = []

    this.context.strokeStyle = "purple"
    this.context.fillStyle = "orange"

    this.mouse = {
      x: -mouseRadius,
      y: -mouseRadius,
      pressedDown: false
    }

    this.createParticles()
    this.animate = this.animate.bind(this)

    window.addEventListener("mousemove", (evt) => {
      this.mouse.x = evt.x
      this.mouse.y = evt.y
    })

    window.addEventListener("mouseout", () => {
      this.mouse.x = -mouseRadius
      this.mouse.y = -mouseRadius
    })

    window.addEventListener("mousedown", () => {
      this.mouse.pressedDown = true
    })

    window.addEventListener("mouseup", () => {
      this.mouse.pressedDown = false
    })

    window.addEventListener("resize", () => this.resize())
  }

  createGradient() {
    const gradient = this.context.createLinearGradient(0,0, this.width, this.height)
    gradient.addColorStop(0, "purple")
    gradient.addColorStop(0.5, "orange")
    gradient.addColorStop(1, "red")

    return gradient
  }

  createParticles() {
    for (let i = 0; i < numberOfParticles; i++) {
      this.particles.push(new Particle(this))
    }
  }

  
  resize() {
    this.particles.forEach(p => {
      p.reset()
    })
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.context.fillStyle = "orange"
    this.context.strokeStyle = "purple"
    distanceBetweenParticles = Math.max(window.innerWidth, window.innerHeight)/17
  }

  connectParticles() {
    const context = this.context
    const maxDistance = distanceBetweenParticles
    for (let a = 0; a < this.particles.length; a++) {
      for (let b = a; b < this.particles.length; b++) {
        const dx = this.particles[a].x - this.particles[b].x
        const dy = this.particles[a].y - this.particles[b].y
        const distance = Math.hypot(dx, dy)
        if (distance < maxDistance) {
          context.save()
          const opacity = 1 - (distance/maxDistance)
          context.globalAlpha = opacity
          context.beginPath()
          context.moveTo(this.particles[a].x, this.particles[a].y)
          context.lineTo(this.particles[b].x, this.particles[b].y)
          context.stroke()
          context.restore()
        }
      } 
    }
  }

  handleParticles() {
    this.connectParticles()
    this.particles.forEach(particle => {
      particle.draw()
      particle.update()
    })
  }

  animate() {
    this.context.clearRect(0, 0, this.width, this.height)
    this.handleParticles()
    requestAnimationFrame(this.animate)
  }
}

class Particle {
  effect: Effect
  vx; vy; x; y; pushX; pushY; friction; radius: number

  constructor(effect: Effect) {
    this.effect = effect
    this.radius = Math.floor(Math.random() * maxParticleSize + 1)
    this.x = this.radius + Math.random() * (this.effect.width - this.radius*2)
    this.y = this.radius + Math.random() * (this.effect.height - this.radius*2)
    this.vx = Math.random() * defaultVel - defaultVel/2
    this.vy = Math.random() * defaultVel - defaultVel/2
    this.pushX = 0
    this.pushY = 0
    this.friction = 0.7
  }

  update() {
    const dx = this.x - this.effect.mouse.x
    const dy = this.y - this.effect.mouse.y
    const distance = Math.hypot(dx, dy)
    if (this.effect.mouse.pressedDown) {
      var force = - distance / mouseRadius
    } else {
      var force = mouseRadius / distance
    }
    if (distance < mouseRadius) {
      const angle = Math.atan2(dy, dx)
      this.pushX += Math.cos(angle) * force
      this.pushY += Math.sin(angle) * force
    }

    if (this.x < this.radius) {
      this.x = this.radius
      this.vx *= -1
    } else if (this.x > this.effect.width - this.radius){
      this.x = this.effect.width - this.radius
      this.vx *= -1
    }

    if (this.y < this.radius) {
      this.y = this.radius
      this.vy *= -1
    } else if (this.y > this.effect.height - this.radius){
      this.y = this.effect.height - this.radius
      this.vy *= -1
    }

    this.x+= this.vx + (this.pushX*=this.friction)
    this.y+= this.vy + (this.pushY*=this.friction)
  }


  draw() {
    const context = this.effect.context
    context.beginPath()
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    context.fill()
  }

  reset() {
    this.x = (this.x/this.effect.width) * window.innerWidth
    this.y = (this.y/this.effect.height) * window.innerHeight
  }
}
