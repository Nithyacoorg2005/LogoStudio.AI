import random
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

ELITE_ICONS = [

# Shield / Security
{"p": '<path d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z"/>'},

# Circle Core
{"p": '<circle cx="12" cy="12" r="10"/>'},

# Diamond
{"p": '<path d="M12 2l10 10-10 10-10-10z"/>'},

# Hexagon
{"p": '<path d="M12 2l8 5v10l-8 5-8-5V7z"/>'},

# Bolt
{"p": '<path d="M13 2L3 14h7l-1 8 10-12h-7z"/>'},

# Layers
{"p": '<path d="M12 2l10 5-10 5-10-5 10-5zM2 12l10 5 10-5"/>'},

# Node
{"p": '<circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>'},

# Rocket
{"p": '<path d="M12 2c3 3 4 7 4 10l-4 4-4-4c0-3 1-7 4-10z"/>'},

# Star
{"p": '<path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/>'},

# Leaf
{"p": '<path d="M12 2C18 8 18 16 12 22 6 16 6 8 12 2z"/>'},

# Cube
{"p": '<path d="M12 2l8 4v10l-8 4-8-4V6z"/>'},

# Ring
{"p": '<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>'},

# Triangle
{"p": '<path d="M12 2l10 18H2z"/>'},

# Sun
{"p": '<circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>'},

# Orbit
{"p": '<circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="9" ry="4" fill="none" stroke="currentColor"/>'},

# Arrow
{"p": '<path d="M4 12h10M10 6l6 6-6 6"/>'},

# Wave
{"p": '<path d="M2 12c4-6 8 6 12 0s8 6 12 0"/>'},

# Cross
{"p": '<path d="M12 2v20M2 12h20"/>'},

# Flower
{"p": '<circle cx="12" cy="6" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="12" r="3"/><circle cx="12" cy="18" r="3"/>'},

# Infinity
{"p": '<path d="M4 12c3-6 9 6 12 0s9 6 12 0"/>'},

# Plus
{"p": '<path d="M12 4v16M4 12h16"/>'},

# Square
{"p": '<rect x="4" y="4" width="16" height="16"/>'},

# Target
{"p": '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/>'},

# Gear
{"p": '<circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>'},

# Pin
{"p": '<path d="M12 2a6 6 0 016 6c0 4-6 12-6 12S6 12 6 8a6 6 0 016-6z"/>'},

# Chat
{"p": '<path d="M4 4h16v10H8l-4 4z"/>'},

# Book
{"p": '<path d="M4 4h14v16H4z"/>'},

# Cloud
{"p": '<path d="M6 16h10a4 4 0 000-8 5 5 0 00-9-1"/>'},

# Camera
{"p": '<rect x="4" y="6" width="16" height="12"/><circle cx="12" cy="12" r="3"/>'},

# Heart
{"p": '<path d="M12 21s-6-4.5-9-9a5 5 0 019-5 5 5 0 019 5c-3 4.5-9 9-9 9z"/>'}

]

# 5 Bulletproof Archetypes
ARCHETYPES = [
"negative-circle",
"pill-enclosed",
"brutalist-box",
"divided-center",
"modern-minimal",
"top-icon",
"side-icon",
"badge",
"stacked"
]

@app.get("/generate")
def generate(prompt: str):
    brand = prompt.strip().upper()
    variations = []
    # Professional Palette
    colors = [
"#0F172A",
"#1E3A8A",
"#7C3AED",
"#9333EA",
"#065F46",
"#059669",
"#991B1B",
"#DC2626",
"#F59E0B",
"#EA580C",
"#2563EB",
"#16A34A"
]
    
    # SYSTEMATIC GENERATION: 7 Icons * 5 Styles = 35
    for i, icon in enumerate(ELITE_ICONS):
        for j, style in enumerate(ARCHETYPES):
            idx = (i * len(ARCHETYPES)) + j
            variations.append({
                "id": idx,
                "brand": brand,
                "icon": icon["p"],
                "style": style,
                "color": colors[idx % len(colors)],
                "weight": "900"
            })
    return variations