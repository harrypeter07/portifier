"use client"

import React, { useEffect, useRef } from "react"

type AnalyticsGridProps = {
  className?: string
  color?: string
  squareSize?: number
  gap?: number
  maxOpacity?: number
  flickerChance?: number
}

export default function AnalyticsGrid({
  className = "",
  color = "#60A5FA",
  squareSize = 4,
  gap = 6,
  maxOpacity = 0.4,
  flickerChance = 0.12,
}: AnalyticsGridProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const gridRef = useRef<Float32Array | null>(null)
  const dimsRef = useRef({ cols: 0, rows: 0, dpr: 1 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctxRef.current = ctx

    const resize = () => {
      const parent = canvas.parentElement
      const w = (parent?.clientWidth || window.innerWidth)
      const h = (parent?.clientHeight || window.innerHeight)
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`

      const cols = Math.floor(w / (squareSize + gap))
      const rows = Math.floor(h / (squareSize + gap))
      dimsRef.current = { cols, rows, dpr }
      gridRef.current = new Float32Array(cols * rows)
      for (let i = 0; i < gridRef.current.length; i++) {
        gridRef.current[i] = Math.random() * maxOpacity
      }
      // eslint-disable-next-line no-console
      console.log("🎯 [AnalyticsGrid] resize", { w, h, cols, rows, dpr })
    }

    const draw = () => {
      const ctx = ctxRef.current
      const grid = gridRef.current
      if (!ctx || !grid) return
      const { cols, rows, dpr } = dimsRef.current
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const opacity = grid[i * rows + j]
          ctx.fillStyle = hexToRgba(color, opacity)
          ctx.fillRect(
            Math.floor(i * (squareSize + gap) * dpr),
            Math.floor(j * (squareSize + gap) * dpr),
            Math.floor(squareSize * dpr),
            Math.floor(squareSize * dpr)
          )
          if (Math.random() < flickerChance) {
            grid[i * rows + j] = Math.random() * maxOpacity
          }
        }
      }
      rafRef.current = requestAnimationFrame(draw)
    }

    const hexToRgba = (hex: string, alpha: number) => {
      if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        let c = hex.substring(1).split('')
        if (c.length === 3) {
          c = [c[0], c[0], c[1], c[1], c[2], c[2]]
        }
        const n = Number("0x" + c.join(''))
        const r = (n >> 16) & 255
        const g = (n >> 8) & 255
        const b = n & 255
        return `rgba(${r}, ${g}, ${b}, ${alpha})`
      }
      return `rgba(96, 165, 250, ${alpha})`
    }

    const onVis = () => {
      if (document.hidden) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      } else if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(draw)
      }
    }

    resize()
    rafRef.current = requestAnimationFrame(draw)
    window.addEventListener("resize", resize)
    document.addEventListener("visibilitychange", onVis)
    // eslint-disable-next-line no-console
    console.log("🎯 [AnalyticsGrid] mounted")

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", resize)
      document.removeEventListener("visibilitychange", onVis)
      // eslint-disable-next-line no-console
      console.log("🎯 [AnalyticsGrid] unmounted")
    }
  }, [color, squareSize, gap, maxOpacity, flickerChance])

  return (
    <div className={`absolute inset-0 -z-10 ${className || ""}`}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}


