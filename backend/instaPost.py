from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.prompts import PromptTemplate
from instagrapi import Client
from dotenv import load_dotenv
from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import os
import requests
import tempfile
import base64
from urllib.parse import urlparse, unquote

# Load env variables
load_dotenv()

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

def get_client(username=None, password=None):
    """Get Instagram client with proper authentication."""
    username = username or os.getenv("INSTAGRAM_USERNAME") or os.getenv("INSTA_USER")
    password = password or os.getenv("INSTAGRAM_PASSWORD") or os.getenv("INSTA_PASS")

    if not username or not password:
        raise ValueError("Instagram credentials not found. Set INSTAGRAM_USERNAME and INSTAGRAM_PASSWORD in .env file")

    cl = Client()
    try:
        cl.login(username, password)
        return cl
    except Exception as e:
        raise Exception(f"Failed to login to Instagram: {str(e)}")

# ========== Image Captioning Model ==========
try:
    processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
    blip_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
    BLIP_AVAILABLE = True
except Exception as e:
    print(f"⚠ BLIP model not available: {e}")
    BLIP_AVAILABLE = False

def describe_image(img_path: str) -> str:
    """Generate a description of an image using BLIP."""
    if not BLIP_AVAILABLE:
        return "A beautiful handcrafted artwork"
    
    try:
        image = Image.open(img_path).convert("RGB")
        inputs = processor(image, return_tensors="pt")
        out = blip_model.generate(**inputs)
        description = processor.decode(out[0], skip_special_tokens=True)
        return description
    except Exception as e:
        print(f"Error describing image: {e}")
        return "A beautiful handcrafted artwork"

# ========== Hugging Face LLM (Qwen for captions) ==========
# try:
#     llm = HuggingFaceEndpoint(
#         repo_id="Qwen/Qwen3-Coder-480B-A35B-Instruct",
#         task="text-generation"
#     )
#     model = ChatHuggingFace(llm=llm)
#     LLM_AVAILABLE = True
# except Exception as e:
#     print(f"⚠ LLM model not available: {e}")
#     LLM_AVAILABLE = False

caption_prompt = PromptTemplate(
    template="""
        You are a professional Instagram content creator.
        Write a catchy caption with emojis and at least 5 trending hashtags.
        Picture description: {picture}
    """,
    input_variables=["picture"]
)

def generate_captions(img_desc: str) -> str:
    """Generate an Instagram caption based on image description."""
    if not LLM_AVAILABLE:
        return f"✨ Beautiful handcrafted artwork! 🎨\n\n{img_desc}\n\n#handmade #artisan #craft #traditional #beautiful #art #culture #heritage #handcrafted #unique"
    
    try:
        prompt = caption_prompt.format(picture=img_desc)
        response = ask_gemini(prompt)
        return response
    except Exception as e:
        print(f"Error generating caption: {e}")
        return f"✨ Beautiful handcrafted artwork! 🎨\n\n{img_desc}\n\n#handmade #artisan #craft #traditional #beautiful #art #culture #heritage #handcrafted #unique"

def download_image_from_url(image_url: str) -> str:
    """Download image from URL and return temporary file path."""
    try:
        # Handle base64 data URLs
        if image_url.startswith('data:'):
            header, encoded = image_url.split(',', 1)
            image_data = base64.b64decode(encoded)
            
            # Create temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
                temp_file.write(image_data)
                return temp_file.name
        
        # Handle regular URLs
        else:
            # Clean up the URL
            parsed_url = urlparse(image_url)
            clean_url = f"{parsed_url.scheme}://{parsed_url.netloc}{unquote(parsed_url.path)}"
            
            response = requests.get(clean_url, stream=True, timeout=30)
            response.raise_for_status()
            
            # Create temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
                for chunk in response.iter_content(chunk_size=8192):
                    temp_file.write(chunk)
                return temp_file.name
                
    except Exception as e:
        raise Exception(f"Failed to download image: {str(e)}")

def post_to_instagram_from_url(image_url: str, username=None, password=None) -> dict:
    """Download an image from a URL, process it, and post to Instagram."""
    temp_file_path = None
    try:
        print(f"📸 Processing Instagram post for URL: {image_url[:100]}...")
        
        # Step 1: Download the image
        temp_file_path = download_image_from_url(image_url)
        print(f"✅ Image downloaded to: {temp_file_path}")
        
        # Step 2: Generate description and caption
        img_desc = describe_image(temp_file_path)
        print(f"📝 Image description: {img_desc}")
        
        caption = generate_captions(img_desc)
        print(f"✍️ Generated caption: {caption[:100]}...")
        
        # Step 3: Get Instagram client and post
        cl = get_client(username, password)
        result = cl.photo_upload(temp_file_path, caption)
        print(f"🚀 Posted to Instagram successfully!")
        
        return {
            "description": img_desc,
            "caption": caption,
            "status": "posted",
            "message": "Photo posted successfully to Instagram!",
            "post_id": str(result.pk) if hasattr(result, 'pk') else None
        }

    except Exception as e:
        error_msg = str(e)
        print(f"❌ Instagram posting failed: {error_msg}")
        
        return {
            "description": "",
            "caption": "",
            "status": "failed",
            "message": f"Failed to post to Instagram: {error_msg}",
            "error": error_msg
        }
    finally:
        # Step 4: Clean up the temporary file
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
                print(f"🧹 Cleaned up temporary file: {temp_file_path}")
            except:
                pass

def post_to_instagram(image_path: str, product_data: dict) -> dict:
    """Generate caption and post image to Instagram (for local file paths)."""
    try:
        print(f"📸 Processing Instagram post for local file: {image_path}")
        
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image file not found: {image_path}")
        
        img_desc = describe_image(image_path)
        caption = generate_captions(img_desc)
        
        cl = get_client()
        result = cl.photo_upload(image_path, caption)
        
        return {
            "description": img_desc,
            "caption": caption,
            "status": "posted",
            "message": "Photo posted successfully to Instagram!",
            "post_id": str(result.pk) if hasattr(result, 'pk') else None
        }
    except Exception as e:
        error_msg = str(e)
        print(f"❌ Instagram posting failed: {error_msg}")
        return {
            "description": "",
            "caption": "",
            "status": "failed",
            "message": f"Failed to post to Instagram: {error_msg}",
            "error": error_msg
        }

    cl = Client()
    cl.login(username=username.strip(), password=password.strip())
    return cl

# ========== Image Captioning Model ==========
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
blip_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

def describe_image(img_path: str) -> str:
    """Generate a description of an image using BLIP."""
    image = Image.open(img_path).convert("RGB")
    inputs = processor(image, return_tensors="pt")
    out = blip_model.generate(**inputs)
    description = processor.decode(out[0], skip_special_tokens=True)
    return description


# ========== Hugging Face LLM (Qwen for captions) ==========
# llm = HuggingFaceEndpoint(
#     repo_id="Qwen/Qwen3-Coder-480B-A35B-Instruct",   # lighter & faster than 480B
#     task="text-generation"
# )
# model = ChatHuggingFace(llm=llm)

caption_prompt = PromptTemplate(
    template="""
        You are a professional Instagram content creator.
        Write a catchy caption with emojis and at least 5 trending hashtags.
        Picture description: {picture}
    """,
    input_variables=["picture"]
)

def generate_captions(img_desc: str) -> str:
    """Generate an Instagram caption based on image description."""
    prompt = caption_prompt.format(picture=img_desc)
    response = ask_gemini(prompt)
    return response

def post_to_instagram_from_url(image_url: str) -> dict:
    """Download an image from a URL, process it, and post to Instagram."""
    try:
        # Step 1: Download the image from the URL
        cl = get_client()
        response = requests.get(image_url, stream=True)
        response.raise_for_status() # Raise an HTTPError for bad responses (4xx or 5xx)

        # Step 2: Save the image to a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            for chunk in response.iter_content(chunk_size=8192):
                temp_file.write(chunk)
            temp_file_path = temp_file.name

        # Step 3: Use the local file path to generate caption and post
        img_desc = describe_image(temp_file_path)
        caption = generate_captions(img_desc)
        cl.photo_upload(temp_file_path, caption)

        return {"description": img_desc, "caption": caption, "status": "posted", "message": "Photo posted successfully!"}

    except Exception as e:
        print(f"Error during Instagram post: {e}")
        return {"description": "", "caption": "", "status": "failed", "message": "Failed to post to Instagram."}
    finally:
        # Step 4: Clean up the temporary file
        if 'temp_file_path' in locals() and os.path.exists(temp_file_path):
            os.remove(temp_file_path)

def post_to_instagram(image_path: str, product_data: dict) -> dict:
    """Generate caption and post image to Instagram (for local file paths)."""
    try:
        cl = get_client()
        img_desc = describe_image(image_path)
        caption = generate_captions(img_desc)
        cl.photo_upload(image_path, caption)
        return {"description": img_desc, "caption": caption, "status": "posted", "message": "Photo posted successfully!"}
    except Exception as e:
        print(f"Error during Instagram post: {e}")
        return {"description": "", "caption": "", "status": "failed", "message": "Failed to post to Instagram."}

# # ========== Main Flow ==========
# if __name__ == "__main__":
#     image_path = "dog.jpeg"   # replace with uploaded photo path
    
#     print("📸 Describing image...")
#     img_desc = describe_image(image_path)
#     print("Image description:", img_desc)

#     print("✍️ Generating caption...")
#     caption = generate_captions(img_desc)
#     print("Generated caption:\n", caption)

#     print("🚀 Uploading to Instagram...")
#     cl.photo_upload(image_path, caption)
#     print("✅ Photo posted successfully!")
