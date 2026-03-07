"use client"

import { useState, useEffect, useRef } from "react"
import * as fabric from "fabric"

export default function Home() {

  const [prompt, setPrompt] = useState("")
  const canvasRef = useRef<fabric.Canvas | null>(null)

  useEffect(() => {

    if (!canvasRef.current) {
      canvasRef.current = new fabric.Canvas("canvas")
    }

  }, [])

 const generateLogo = async () => {

  const url =
    `http://localhost:8000/generate?prompt=${encodeURIComponent(prompt)}`

  const res = await fetch(url)

  const svgText = await res.text()

  const canvas = canvasRef.current

  if (!canvas) return

  fabric.loadSVGFromString(svgText, (objects: any, options: any) => {

    const obj = fabric.util.groupSVGElements(objects, options)

    canvas.clear()
    canvas.add(obj)
    canvas.centerObject(obj)
    canvas.renderAll()

  })

}

  return (
    <div style={{padding:"40px"}}>

      <h1>AI Logo Generator</h1>

      <input
        value={prompt}
        onChange={(e)=>setPrompt(e.target.value)}
        placeholder="Describe your logo"
        style={{padding:"10px",width:"300px"}}
      />

      <button
        onClick={generateLogo}
        style={{marginLeft:"10px",padding:"10px"}}
      >
        Generate
      </button>

      <div style={{marginTop:"40px"}}>

        <canvas
          id="canvas"
          width="600"
          height="600"
          style={{border:"1px solid gray"}}
        />

      </div>

    </div>
  )
}