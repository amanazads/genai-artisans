import os, json, uuid, pathlib
from typing import Optional
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from vertexai.generative_models import GenerativeModel
from dotenv import load_dotenv
from vertexai import init
from google import genai
from langchain_core.prompts import PromptTemplate
import re
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint

load_dotenv()

PROJECT_ID = os.getenv("PROJECT_ID")
REGION = os.getenv("REGION", "us-central1")

print("DEBUG: Initializing Vertex AI with", PROJECT_ID, REGION)  # sanity check

init(project=PROJECT_ID, location=REGION)

try:
    from google.cloud import vision, aiplatform
    GCP_AVAILABLE = True
except Exception as e:
    GCP_AVAILABLE = False

OUTPUT_DIR = pathlib.Path("uploads") / "outputs"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

client_gemini = genai.Client(api_key = os.getenv("GENAI_API_KEY"))

def ask_gemini(prompt: str):
    try:
        response = client_gemini.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        return response.candidates[0].content.parts[0].text
    except Exception as e:
        print("Gemini API error: ", e)
        return ""

# llm = HuggingFaceEndpoint(
#     repo_id="Qwen/Qwen3-Coder-480B-A35B-Instruct",
#     task="text-generation"
# )
# model = ChatHuggingFace(llm=llm)

def safe_json_loads(text: str):
    text = text.strip()
    text = re.sub(r"^```(json)?", "", text)
    text = re.sub(r"```$", "", text)
    return json.loads(text)

# --------------- Vision Pass -----------------
def vision_inspect(image_path: str):
    if GCP_AVAILABLE:
        try:
            client = vision.ImageAnnotatorClient()
            with open(image_path, "rb") as f:
                content = f.read()
                image = vision.Image(content=content)
                labels = client.label_detection(image=image).label_annotations
                label_texts = [l.description for l in labels[:8]]

                props = client.image_properties(image=image).image_properties_annotation
                colors = []
                if props.dominant_colors.colors:
                    for c in props.dominant_colors.colors[:3]:
                        r, g, b = int(c.color.red), int(c.color.green), int(c.color.blue)
                        colors.append(f"rbg({r}, {g}, {b})")

                return {"labels": label_texts, "colors": colors, "confidence": 0.9}
        except Exception as e:
            print("Vision API error: ", e)
    
    im = Image.open(image_path).convert("RGB")
    pixels = list(im.getdata())
    avg = tuple(sum(c[i] for c in pixels)//len(pixels) for i in range(3))
    return {"labels": [pathlib.Path(image_path).stem], "color": [f"rgb{avg}"], "confidence": 0.5}

# --------------- LLM call -----------------
def call_genai_for_listing(seed_info: dict, artisan_info: dict):
    labels = seed_info.get("labels", [])[:5]
    colors = seed_info.get("colors", [])[:3]
    craft_hint = labels[0] if labels else "handmade craft"

    prompt = PromptTemplate(
        template='''
        You are culturally-sensitive product copywriter for Indian handicrafts.
        Input:
        - craft_hint: {craft_hint}
        - detected_labels: {labels}
        - detected_colors: {colors}
        - artisan_name: {name}
        - artisan_location: {location}

        Output strictly in JSON with keys:
        {{
          "title": "<short title (40-70 chars)>",
          "short_description": "<one-sentence marketing line>",
          "long_description": "<120-160 word artisan story + care instructions>",
          "tags": ["tag1","tag2","tag3","tag4","tag5","tag6"],
          "suggested_price": <integer INR>,
          "price_explanation": "<short explanation of price>"
        }}
        RETURN ONLY VALID JSON
        DONOT INCLUDE EXPLANATIONS, NOTES OR EXTRA TEXT
    ''',
    input_variables=["craft_hint", "labels", "colors", "name", "location"]
    )
    
    try:
        filled_prompt = prompt.format(
            craft_hint=craft_hint,
            labels=", ".join(labels),
            colors=", ".join(colors),
            name=artisan_info.get("name", "Artisan"),
            location=artisan_info.get("location", "India")
        )
        response = ask_gemini(filled_prompt)
        parsed = safe_json_loads(response)
        return parsed

    except Exception as e:
        print("Gemini call failed, using fallback:", e)

        # ----------------
        # Fallback template
        # ----------------
        title = f"Handmade {craft_hint.title()} by {artisan_info.get('name')}"
        short_desc = f"{title} — crafted in {artisan_info.get('location')}."
        long_desc = f"{artisan_info.get('name')} from {artisan_info.get('location')} makes this {craft_hint}. Each piece is unique."
        suggested_price = 500 + len(labels) * 100
        tags = [craft_hint, "handmade", "artisan", "made-in-india", "craft", "heritage"]

        return {
            "title": title,
            "short_description": short_desc,
            "long_description": long_desc,
            "tags": tags[:6],
            "suggested_price": suggested_price,
            "price_explanation": f"Estimated retail INR {suggested_price}"
        }

# ------------ Poster Creation --------------
def create_watermarked_image(image_path: str, artisan_name: str, artisan_photo_path: Optional[str]):
    im = Image.open(image_path).convert("RGBA")

    maxw = 800
    if im.width > maxw:
        h = int(maxw * im.height / im.width)
        im = im.resize((maxw, h), Image.LANCZOS)
    im = im.filter(ImageFilter.SHARPEN)

    bg_w, bg_h = im.width + 200, im.height + 200
    gradient = Image.new("RGBA", (bg_w, bg_h), (255, 255, 255, 255))
    draw = ImageDraw.Draw(gradient)
    for y in range(bg_h):
        r = int(245 - (y/bg_h) * 40)
        g = int(230 - (y/bg_h) * 30)
        b = int(210 - (y/bg_h) * 20)
        draw.line([(0, y), (bg_w, y)], fill=(r, g, b, 255))
    
    canvas = gradient.copy()
    px = (bg_w - im.width) // 2
    py = (bg_h - im.height) // 2
    canvas.paste(im, (px, py), im)

    try:
        if artisan_photo_path and pathlib.Path(artisan_photo_path).exists():
            p = Image.open(artisan_photo_path).convert("RGBA")
            size = 120
            p = p.resize((size, size), Image.LANCZOS)
            mask = Image.new("L", (size, size), 0)
            ImageDraw.Draw(mask).ellipse((0, 0, size, size), fill=255)
            pos = (30, bg_h - size - 30)
            canvas.paste(p, pos, mask)
    except Exception as e:
        print("Artisan photo error:", e)

    try:
        font_big = ImageFont.truetype("arial.ttf", 36)
        font_small = ImageFont.truetype("arial.ttf", 20)
    except Exception as e:
        font_big = ImageFont.load_default()
        font_small = ImageFont.load_default()

    draw = ImageDraw.Draw(canvas)

    if artisan_name:
        name_text = f"Crafted by {artisan_name}"
        nbbox = draw.textbbox((0,0), name_text, font=font_big)
        nw, nh = nbbox[2]-nbbox[0], nbbox[3]-nbbox[1]
        nx, ny = 180, bg_h - nh - 40
        draw.text((nx+2, ny+2), name_text, font=font_big, fill=(0,0,0,180))
        draw.text((nx, ny), name_text, font=font_big, fill=(255,255,255,240))

    wm_text = "Crafted with ♥ | Local Marketplace"
    wbbox = draw.textbbox((0,0), wm_text, font=font_small)
    ww, wh = wbbox[2]-wbbox[0], wbbox[3]-wbbox[1]
    wx, wy = bg_w - ww - 30, bg_h - wh - 30
    draw.text((wx+2, wy+2), wm_text, font=font_small, fill=(0,0,0,180))
    draw.text((wx, wy), wm_text, font=font_small, fill=(255,255,255,200))

    filename = f"showcase_{uuid.uuid4().hex}.png"
    out_path = OUTPUT_DIR / filename
    canvas.convert("RGB").save(out_path, format="PNG")
    # Return just the relative path from uploads directory for proper URL construction
    return f"outputs/{filename}"


#--------------- Full Pipeline ----------------
def process_artisan_image(image_path: str, artisan_info: dict, artisan_photo_path: Optional[str] = None):
    seed = vision_inspect(image_path)
    listing = call_genai_for_listing(seed, artisan_info)
    poster = create_watermarked_image(image_path, artisan_info["name"], artisan_photo_path)

    return {
        "artisan": artisan_info,
        "seed": seed,
        "listing": listing,
        "poster": poster
    }

# artisan = {"name": "Sita Devi", "location": "Varanasi"}
# img = "dog.jpeg"   # replace with your test craft image
# result = process_artisan_image(img, artisan)
# print(json.dumps(result, indent=2))
# print("Poster saved at:", result["poster"])

