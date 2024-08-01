import React, { useRef, useEffect } from "react"
import "./style.css"
import ParticleEffect from "./script"

const BackgroundParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      canvasRef.current.width = window.innerWidth
      canvasRef.current.height = window.innerHeight
      if (context) {
        const particleEffect = new ParticleEffect(context, canvasRef.current)
        particleEffect.animate()
      }
    }
  }, [])

  return (
    <div className="BackgroundParticles">
      <canvas ref={canvasRef}></canvas>
    </div>
  )
}

export default BackgroundParticles
