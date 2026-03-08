"use client"
import { useState, useRef } from "react"

const FONT_OPTIONS = [
  { name: "Outfit (Premium)", value: "Outfit, sans-serif" },
  { name: "Modern Sans", value: "'Inter', sans-serif" },
  { name: "Elegant Serif", value: "'Playfair Display', serif" },
  { name: "High-Tech", value: "'JetBrains Mono', monospace" }
];

export default function LogoStudio() {
  const [prompt, setPrompt] = useState("")
  const [logos, setLogos] = useState<any[]>([])
  const [edit, setEdit] = useState<any>(null)
  const [isDragging, setIsDragging] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)

  const generate = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/generate?prompt=${prompt}`)
      const data = await res.json()
      
      // CRITICAL: Initialize ALL 35 variations with defaults to prevent NaN errors
      const eliteData = data.map((l: any) => ({
        ...l,
        zoom: 2.0, xPos: 0, yPos: 0, fontSize: 36, letterSpacing: 10,
        fontFamily: "Outfit, sans-serif", bg: "#ffffff"
      }))

      setLogos(eliteData)
      setEdit(eliteData[0])
    } catch (e) {
      console.error("Connection failed. Ensure backend is running.", e)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !edit) return;
    setEdit((prev: any) => ({
      ...prev,
      xPos: prev.xPos + e.movementX,
      yPos: prev.yPos + e.movementY
    }));
  };

  const LogoRenderer = ({ config, size = 1, isEditor = false }: any) => {
    if (!config) return null;
    const { brand, icon, style, color, letterSpacing, zoom, yPos, xPos, fontSize, fontFamily, bg } = config;
    
    return (
      <svg 
        ref={isEditor ? svgRef : null} 
        width={400 * size} height={200 * size} viewBox="0 0 400 200" 
        xmlns="http://www.w3.org/2000/svg"
        onMouseDown={() => isEditor && setIsDragging(true)}
        onMouseUp={() => isEditor && setIsDragging(false)}
        onMouseMove={isEditor ? handleMouseMove : undefined}
        style={{ cursor: isEditor ? 'move' : 'pointer', background: bg, borderRadius: isEditor ? '0' : '12px' }}
      >
        <rect width="400" height="200" fill={bg} />
        <g transform="translate(200, 100)" textAnchor="middle">
          {style === "negative-circle" && <circle cx="0" cy="-35" r="45" fill={color} />}
          {style === "pill-enclosed" && <rect x="-150" y="-60" width="300" height="120" rx="60" fill={color} opacity="0.08" />}
          {style === "brutalist-box" && <rect x="-160" y="-70" width="320" height="140" fill="none" stroke={color} strokeWidth="2" />}
          {style === "divided-center" && (
            <><line x1="-120" y1="20" x2="-30" y2="20" stroke={color} strokeWidth="2" /><line x1="120" y1="20" x2="30" y2="20" stroke={color} strokeWidth="2" /></>
          )}
          
          <g transform={`translate(${-12 + Number(xPos)}, ${-47 + (style === 'negative-circle' ? -35 : -70) + Number(yPos)}) scale(${Number(zoom)})`} 
             fill={style === "negative-circle" ? "white" : color} dangerouslySetInnerHTML={{ __html: icon }} />
          
          <text y="55" fill={color} fontSize={Number(fontSize)} fontWeight="900" 
            style={{ letterSpacing: `${Number(letterSpacing)}px`, fontFamily }}>
            {brand}
          </text>
        </g>
      </svg>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@900&family=JetBrains+Mono:wght@800&display=swap');` }} />

      {/* HEADER */}
      <nav className="glass" style={{ margin: '20px', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '20px', zIndex: 100 }}>
        <div style={{ fontSize: '22px', fontWeight: '900', letterSpacing: '-1px' }}>
          LOGO<span style={{ color: 'var(--primary)' }}>STUDIO</span>.PRO
        </div>
        <div style={{ display: 'flex', gap: '30px' }}>
          <a href="#" className="nav-link">Showcase</a>
          <button style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '10px 25px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Go Pro</button>
        </div>
      </nav>

      <main style={{ flex: 1, padding: '0 40px' }}>
        <section style={{ textAlign: 'center', margin: '40px 0' }}>
          <h2 style={{ fontSize: '42px', fontWeight: '900', marginBottom: '20px' }}>Design with <span style={{ color: 'var(--primary)' }}>Generative Intelligence</span>.</h2>
          <div className="glass" style={{ maxWidth: '700px', margin: '0 auto', padding: '10px', display: 'flex', gap: '10px' }}>
            <input 
              style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', padding: '15px', fontSize: '18px', outline: 'none' }}
              placeholder="Enter brand name..."
              onChange={e => setPrompt(e.target.value)}
            />
            <button onClick={generate} style={{ background: 'var(--primary)', border: 'none', color: '#fff', padding: '0 30px', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' }}>Generate 35 Designs</button>
          </div>
        </section>

        {edit && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px', marginBottom: '60px' }}>
            <div className="glass" style={{ padding: '40px', textAlign: 'center' }}>
              <p style={{ fontSize: '12px', color: 'var(--primary)', marginBottom: '15px', letterSpacing: '2px' }}>DRAG ICON TO POSITION</p>
              <div style={{ background: '#fff', borderRadius: '15px', display: 'inline-block', padding: '10px', boxShadow: '0 40px 80px rgba(0,0,0,0.4)' }}>
                <LogoRenderer config={edit} isEditor={true} />
              </div>
              <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', textAlign: 'left' }}>
                <div>
                  <label style={{ fontSize: '10px', color: '#666' }}>FONT FAMILY</label>
                  <select value={edit.fontFamily} onChange={e => setEdit({...edit, fontFamily: e.target.value})} style={{ width: '100%', padding: '10px', background: '#111', color: '#fff', borderRadius: '8px', border: '1px solid #333' }}>
                    {FONT_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '10px', color: '#666' }}>BRAND COLOR</label>
                  <input type="color" value={edit.color} onChange={e => setEdit({...edit, color: e.target.value})} style={{ width: '100%', height: '42px', background: 'none', border: 'none' }} />
                </div>
              </div>
              <button 
                onClick={() => {
                    const svgData = new XMLSerializer().serializeToString(svgRef.current!);
                    const blob = new Blob([svgData], { type: "image/svg+xml" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a"); a.href = url; a.download=`${edit.brand}.svg`; a.click();
                }}
                style={{ width: '100%', marginTop: '30px', padding: '15px', background: '#fff', color: '#000', borderRadius: '12px', fontWeight: '900', border: 'none', cursor: 'pointer' }}
              >DOWNLOAD VECTOR SVG</button>
            </div>

            <aside className="glass" style={{ padding: '20px', maxHeight: '700px', overflowY: 'auto' }}>
              <h4 style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px' }}>Archetype Gallery</h4>
              <div style={{ display: 'grid', gap: '15px' }}>
                {logos.map((l, i) => (
                  <div key={i} onClick={() => { setEdit(l); window.scrollTo({top: 250, behavior: 'smooth'}); }} style={{ cursor: 'pointer', borderRadius: '12px', overflow: 'hidden', border: edit?.id === l.id ? '2px solid var(--primary)' : '1px solid #222' }}>
                    <LogoRenderer config={l} size={0.8} />
                  </div>
                ))}
              </div>
            </aside>
          </div>
        )}
      </main>

      <footer className="glass" style={{ margin: '20px', padding: '40px', borderRadius: '32px 32px 0 0', textAlign: 'center' }}>
        <div style={{ fontSize: '14px', color: '#666' }}>
          © 2026 LogoStudio.Pro — Created by Nithya
        </div>
      </footer>
    </div>
  )
}