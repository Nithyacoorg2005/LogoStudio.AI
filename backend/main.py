from fastapi import FastAPI
from fastapi.responses import FileResponse
from diffusers import StableDiffusionPipeline
import subprocess
import os
from PIL import Image, ImageFilter

app = FastAPI()
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from diffusers import StableDiffusionPipeline
import subprocess
import os
from PIL import Image, ImageFilter

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pipe = StableDiffusionPipeline.from_pretrained(
    "runwayml/stable-diffusion-v1-5"
).to("cpu")

POTRACE_PATH = os.path.join(
    "tools",
    "potrace-1.16.win64",
    "potrace.exe"
)

@app.get("/generate")
def generate(prompt: str):

    full_prompt = f"""
    simple minimalist logo
    black icon
    white background
    flat vector style
    geometric logo
    logo for brand {prompt}
    """

    image = pipe(full_prompt).images[0]

    png_path = "logo.png"
    bmp_path = "logo.bmp"
    svg_path = "logo.svg"

    image.save(png_path)

    img = Image.open(png_path)

    # convert to grayscale
    img = img.convert("L")

    # remove noise
    img = img.filter(ImageFilter.MedianFilter(size=5))

    # threshold to pure black/white
    img = img.point(lambda x: 0 if x < 140 else 255, '1')

    img.save(bmp_path)

    subprocess.run([
        POTRACE_PATH,
        bmp_path,
        "-s",
        "-o",
        svg_path
    ])

    return FileResponse(svg_path, media_type="image/svg+xml")