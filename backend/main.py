from fastapi import FastAPI, UploadFile, Form, HTTPException, Request, Response
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import shutil, pathlib
# Make AI imports optional
try:
    from image import process_artisan_image
    AI_AVAILABLE = True
except Exception as e:
    print(f"⚠ AI features not available: {e}")
    AI_AVAILABLE = False

try:
    from instaPost import post_to_instagram, post_to_instagram_from_url
    INSTAGRAM_AVAILABLE = True
except Exception as e:
    print(f"⚠ Instagram features not available: {e}")
    INSTAGRAM_AVAILABLE = False 

from pymongo import MongoClient
from pydantic import BaseModel, EmailStr, validator
from typing import List, Dict, Optional
import uuid
from datetime import datetime
import os
from dotenv import load_dotenv
import hashlib
import secrets
import re

# Load environment variables
load_dotenv()

# Utility functions for password handling and validation
def hash_password(password: str) -> str:
    """Hash password using SHA256 with salt"""
    salt = secrets.token_hex(16)
    password_hash = hashlib.sha256((password + salt).encode()).hexdigest()
    return f"{salt}:{password_hash}"

def verify_password(password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    try:
        salt, stored_hash = hashed_password.split(':')
        password_hash = hashlib.sha256((password + salt).encode()).hexdigest()
        return password_hash == stored_hash
    except:
        return False

def validate_phone(phone: str) -> bool:
    """Validate Indian phone number format"""
    pattern = r'^(\+91|91)?[6-9]\d{9}$'
    return re.match(pattern, phone) is not None

def validate_username(username: str) -> bool:
    """Validate username format"""
    pattern = r'^[a-zA-Z0-9_]{3,20}$'
    return re.match(pattern, username) is not None

app = FastAPI(title="KalaKriti AI Backend", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://127.0.0.1:5173",
        "http://localhost:5174", 
        "http://127.0.0.1:5174"
    ],  # React dev server on both possible ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware to handle base64 and long URL validation
@app.middleware("http")
async def validate_url_and_handle_base64(request: Request, call_next):
    url_path = str(request.url.path)
    query_params = str(request.url.query) if request.url.query else ""
    
    # Check for base64 data in URL path or query parameters
    if ("data:image" in url_path or "data:image" in query_params or 
        len(url_path) > 200 or len(query_params) > 1000):
        
        return JSONResponse(
            status_code=400,
            content={
                "error": "Base64 image data detected in URL",
                "message": "Base64 data cannot be used in URLs due to length limitations",
                "suggestion": "Use the /upload-base64-image endpoint for base64 data or upload files directly",
                "endpoints": {
                    "base64_upload": "/upload-base64-image",
                    "file_upload": "/upload",
                    "instagram_posting": "/instagram/post-from-url"
                }
            }
        )
    
    response = await call_next(request)
    return response
@app.middleware("http")
async def validate_url_length(request: Request, call_next):
    # Windows has a path length limit of ~260 characters for file system operations
    MAX_PATH_LENGTH = 250  # Leave some buffer
    
    # Only check path length for static file requests (not full URL with query params)
    if request.url.path.startswith("/uploads"):
        # Extract just the file path part (without query parameters)
        file_path = request.url.path
        
        # Check if this looks like a base64 image URL (common issue)
        if "data:image" in str(request.url) or len(file_path) > MAX_PATH_LENGTH:
            return JSONResponse(
                status_code=400,
                content={
                    "error": "Invalid image URL format",
                    "message": "Base64 image data should not be passed in URLs. Use the upload endpoint instead.",
                    "suggestion": "Upload the image as a file or use the /upload-base64-image endpoint.",
                    "path_length": len(file_path) if len(file_path) <= 1000 else "too long to display"
                }
            )
    
    response = await call_next(request)
    return response

# MongoDB connection (optional for testing)
try:
    MONGO_CLIENT = MongoClient("mongodb://localhost:27017/")
    db = MONGO_CLIENT["kalakriti"]
    artisan_collection = db["artisan_info"]
    products_collection = db["products"]
    users_collection = db["users"]
    artisan_profiles_collection = db["artisan_profiles"]
    orders_collection = db["orders"]
    cart_collection = db["cart"]
    print("✓ MongoDB connected successfully")
except Exception as e:
    print(f"⚠ MongoDB not available: {e}")
    artisan_collection = None
    products_collection = None
    users_collection = None
    artisan_profiles_collection = None
    orders_collection = None
    cart_collection = None

UPLOAD_DIR = pathlib.Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Create outputs directory for generated images
OUTPUTS_DIR = UPLOAD_DIR / "outputs"
OUTPUTS_DIR.mkdir(exist_ok=True)

# Custom static files handler with error handling for Windows path length
class SafeStaticFiles(StaticFiles):
    async def get_response(self, path: str, scope):
        try:
            # Check if the full path would be too long for Windows
            full_path = os.path.join(self.directory, path)
            if len(full_path) > 250:  # Windows path limit buffer
                from fastapi.responses import JSONResponse
                return JSONResponse(
                    status_code=400,
                    content={
                        "error": "Path too long",
                        "message": "The requested file path is too long for Windows file system.",
                        "suggestion": "Use the /upload-base64-image endpoint for large image data."
                    }
                )
            return await super().get_response(path, scope)
        except Exception as e:
            if "path too long" in str(e).lower():
                from fastapi.responses import JSONResponse
                return JSONResponse(
                    status_code=400,
                    content={
                        "error": "Windows path length exceeded",
                        "message": str(e),
                        "suggestion": "Use the /upload-base64-image endpoint instead."
                    }
                )
            raise

# Mount static files to serve uploaded images with custom handler
app.mount("/uploads", SafeStaticFiles(directory="uploads"), name="uploads")

class Info(BaseModel):
    name: str
    state: str
    city: str
    artisan_id: str
    product_info: Optional[List[Dict]] = []
    experience: int
    craft_description: Optional[str] = ""
    story: Optional[str] = ""
    profile_image: Optional[str] = ""
    phone: Optional[str] = ""
    email: Optional[str] = ""

class Product(BaseModel):
    id: Optional[str] = None
    title: str
    description: str
    price: float
    category: str
    tags: List[str]
    artisan_id: str
    stock: Optional[int] = 0
    status: Optional[str] = "active"  # active, inactive, draft
    images: Optional[List[str]] = []
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

# User Profile Schema
class UserProfile(BaseModel):
    user_id: Optional[str] = None
    email: EmailStr
    username: str
    full_name: str
    phone: Optional[str] = None
    date_of_birth: Optional[str] = None
    profile_image: Optional[str] = None
    bio: Optional[str] = None
    preferences: Optional[Dict] = {}
    address: Optional[Dict] = {}
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    is_active: Optional[bool] = True
    last_login: Optional[str] = None
    
    @validator('user_id', pre=True, always=True)
    def set_user_id(cls, v):
        return v or str(uuid.uuid4())
    
    @validator('created_at', pre=True, always=True)
    def set_created_at(cls, v):
        return v or datetime.now().isoformat()

# Artisan Profile Schema
class ArtisanProfile(BaseModel):
    artisan_id: Optional[str] = None
    email: EmailStr
    username: str
    full_name: str
    phone: Optional[str] = None
    profile_image: Optional[str] = None
    bio: Optional[str] = None
    craft_specialization: List[str] = []
    experience_years: Optional[int] = 0
    workshop_location: Optional[Dict] = {}
    story: Optional[str] = None
    achievements: Optional[List[str]] = []
    certifications: Optional[List[str]] = []
    social_media: Optional[Dict] = {}
    rating: Optional[float] = 0.0
    total_reviews: Optional[int] = 0
    total_products: Optional[int] = 0
    total_sales: Optional[int] = 0
    verification_status: Optional[str] = "pending"  # pending, verified, rejected
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    is_active: Optional[bool] = True
    last_login: Optional[str] = None
    
    @validator('artisan_id', pre=True, always=True)
    def set_artisan_id(cls, v):
        return v or str(uuid.uuid4())
    
    @validator('created_at', pre=True, always=True)
    def set_created_at(cls, v):
        return v or datetime.now().isoformat()

# User Registration and Authentication
class UserRegistration(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    password: str
    user_type: str  # "user" or "artisan"
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserAuth(BaseModel):
    email: EmailStr
    password: str

@app.post("/process-and-post")
async def process_and_post(file: UploadFile, name: str = Form(...), location: str = Form(...)):
    try:
        file_path = UPLOAD_DIR / file.filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        artisan_info = {"name": name, "location": location}

        if AI_AVAILABLE:
            # Use AI processing
            refined_result = process_artisan_image(str(file_path), artisan_info)
            
            if INSTAGRAM_AVAILABLE:
                posted_result = post_to_instagram(refined_result["poster"], refined_result["listing"])
            else:
                posted_result = {"status": "simulated", "message": "Instagram posting simulated"}

            return JSONResponse({
                "refined_listing": refined_result["listing"],
                "insta_post": posted_result,
                "poster_path": refined_result["poster"]
            })
        else:
            # Fallback without AI
            mock_listing = {
                "title": f"Beautiful Handcrafted Item by {name}",
                "long_description": f"A stunning handcrafted piece created by {name} from {location}. This traditional artwork showcases the rich cultural heritage and skilled craftsmanship passed down through generations.",
                "suggested_price": 2500,
                "tags": ["handmade", "traditional", "cultural", "artisan"],
            }

            return JSONResponse({
                "refined_listing": mock_listing,
                "insta_post": {"status": "simulated", "message": "Instagram posting simulated"},
                "poster_path": str(file_path),
                "message": "File processed successfully (AI features in development)"
            })
    
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

# Base64 image handling
class Base64ImageRequest(BaseModel):
    image_data: str
    filename: Optional[str] = None

@app.post("/upload-base64-image")
async def upload_base64_image(request: Base64ImageRequest):
    """Handle base64 image upload and save to file system."""
    try:
        import base64
        from io import BytesIO
        
        # Extract base64 data (remove data:image/png;base64, prefix if present)
        if request.image_data.startswith('data:'):
            header, encoded = request.image_data.split(',', 1)
        else:
            encoded = request.image_data
        
        # Decode base64
        image_data = base64.b64decode(encoded)
        
        # Generate filename
        filename = request.filename or f"uploaded_{uuid.uuid4().hex[:12]}.png"
        if not filename.endswith(('.png', '.jpg', '.jpeg')):
            filename += '.png'
        
        # Save to uploads directory
        file_path = UPLOAD_DIR / filename
        with open(file_path, 'wb') as f:
            f.write(image_data)
        
        return JSONResponse({
            "message": "Image uploaded successfully",
            "filename": filename,
            "path": f"/uploads/{filename}",
            "url": f"http://127.0.0.1:8001/uploads/{filename}"
        })
        
    except Exception as e:
        return JSONResponse(
            {"error": f"Failed to process base64 image: {str(e)}"}, 
            status_code=400
        )

@app.get("/image-from-data")
async def get_image_from_data(data: str):
    """Convert base64 data URL to image response (temporary workaround)."""
    try:
        import base64
        from fastapi.responses import Response
        
        if not data.startswith('data:image'):
            raise ValueError("Invalid data URL format")
        
        # Extract mime type and base64 data
        header, encoded = data.split(',', 1)
        mime_type = header.split(';')[0].split(':')[1]
        
        # Decode base64
        image_data = base64.b64decode(encoded)
        
        return Response(content=image_data, media_type=mime_type)
        
    except Exception as e:
        return JSONResponse(
            {"error": f"Failed to process data URL: {str(e)}"}, 
            status_code=400
        )

# Fix for missing product images - create fallback endpoint
@app.get("/uploads/outputs/{filename}")
async def get_showcase_image(filename: str):
    """Serve showcase images or provide fallback."""
    try:
        # Try to serve the actual file first
        file_path = UPLOAD_DIR / "outputs" / filename
        if file_path.exists():
            from fastapi.responses import FileResponse
            return FileResponse(file_path)
        
        # If file doesn't exist, return a fallback placeholder
        # Create a simple placeholder image
        from PIL import Image, ImageDraw, ImageFont
        import io
        
        # Create placeholder image
        img = Image.new('RGB', (400, 400), color='#f0f0f0')
        draw = ImageDraw.Draw(img)
        
        # Add text
        try:
            # Try to use a default font
            font = ImageFont.load_default()
        except:
            font = None
        
        text = "Image\nNot Found"
        draw.text((200, 200), text, fill='#666666', font=font, anchor='mm')
        
        # Convert to bytes
        img_io = io.BytesIO()
        img.save(img_io, 'PNG')
        img_io.seek(0)
        
        from fastapi.responses import Response
        return Response(content=img_io.read(), media_type="image/png")
        
    except Exception as e:
        return JSONResponse(
            {"error": f"Failed to serve image: {str(e)}"}, 
            status_code=404
        )

# Pydantic model for Instagram posting request
class InstagramPostRequest(BaseModel):
    image_url: str
    username: Optional[str] = None
    password: Optional[str] = None

@app.post("/instagram/post-from-url")
async def post_to_instagram_endpoint(request: InstagramPostRequest):
    """Post an image to Instagram using a URL."""
    try:
        if not INSTAGRAM_AVAILABLE:
            return JSONResponse(
                {
                    "error": "Instagram posting is not available", 
                    "status": "failed",
                    "message": "Instagram service is not configured properly"
                }, 
                status_code=503
            )

        # Validate URL is not a problematic base64 data URL
        if request.image_url.startswith('data:') and len(request.image_url) > 1000:
            return JSONResponse(
                {
                    "error": "Base64 data URL too long for direct posting",
                    "status": "failed",
                    "message": "Please use the /upload-base64-image endpoint for large base64 images",
                    "suggestion": "Upload the image first, then use the returned URL for Instagram posting"
                }, 
                status_code=400
            )

        # Post to Instagram
        result = post_to_instagram_from_url(
            request.image_url, 
            request.username, 
            request.password
        )
        
        # Return appropriate status code based on result
        if result.get("status") == "failed":
            return JSONResponse(result, status_code=400)
        else:
            return JSONResponse(result)

    except Exception as e:
        return JSONResponse(
            {
                "error": str(e), 
                "status": "failed", 
                "message": "Internal server error during Instagram posting"
            }, 
            status_code=500
        )

@app.post("/artisan-info")
def save_artisan_info(info: Info) -> dict:
    try:
        if artisan_collection is not None:
            # Use upsert to update existing artisan or create new one
            result = artisan_collection.update_one(
                {"artisan_id": info.artisan_id},
                {"$set": info.dict()},
                upsert=True
            )
            if result.upserted_id:
                return {"message": "Artisan profile created successfully", "artisan_id": info.artisan_id}
            else:
                return {"message": "Artisan profile updated successfully", "artisan_id": info.artisan_id}
        else:
            # Mock save for testing without MongoDB
            print(f"Mock save: {info.dict()}")
            return {"message": "Artisan info saved successfully (mock)", "artisan_id": info.artisan_id}
    except Exception as e:
        return {"error": str(e)}

@app.get("/artisan-info/{artisan_id}")
def get_artisan_info(artisan_id: str) -> dict:
    try:
        if artisan_collection is not None:
            artisan = artisan_collection.find_one({"artisan_id": artisan_id}, {"_id": 0})
            if artisan:
                return artisan
            return {"error": "Artisan not found"}
        else:
            # Mock data for testing
            return {
                "name": "Rajesh Kumar",
                "state": "Punjab", 
                "city": "Hoshiarpur",
                "artisan_id": artisan_id,
                "experience": 20,
                "product_info": []
            }
    except Exception as e:
        return {"error": str(e)}

@app.get("/")
def read_root():
    return {"message": "KalaKriti AI Backend is running!", "status": "healthy"}

@app.get("/health")
def health_check():
    return {
        "status": "healthy", 
        "message": "Backend is running",
        "mongodb": "connected" if artisan_collection is not None else "not available",
        "ai_features": "available" if AI_AVAILABLE else "not available",
        "instagram": "available" if INSTAGRAM_AVAILABLE else "not available",
        "version": "1.0.0"
    }

# Product CRUD endpoints
@app.post("/products")
def create_product(product: Product):
    try:
        product_dict = product.dict()
        product_dict["id"] = str(uuid.uuid4())
        product_dict["created_at"] = datetime.now().isoformat()
        product_dict["updated_at"] = datetime.now().isoformat()
        
        products_collection.insert_one(product_dict)
        return {"message": "Product created successfully", "product_id": product_dict["id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/products")
def get_products(artisan_id: Optional[str] = None, skip: int = 0, limit: int = 100):
    try:
        query = {}
        if artisan_id:
            query["artisan_id"] = artisan_id
            
        products = list(products_collection.find(query, {"_id": 0}).skip(skip).limit(limit))
        return {"products": products}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/products/{product_id}")
def get_product(product_id: str):
    try:
        product = products_collection.find_one({"id": product_id}, {"_id": 0})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/products/{product_id}")
def update_product(product_id: str, product: Product):
    try:
        product_dict = product.dict()
        product_dict["updated_at"] = datetime.now().isoformat()
        
        result = products_collection.update_one(
            {"id": product_id}, 
            {"$set": product_dict}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Product not found")
            
        return {"message": "Product updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/products/{product_id}")
def delete_product(product_id: str):
    try:
        result = products_collection.delete_one({"id": product_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Product not found")
            
        return {"message": "Product deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint to handle base64 image data without URL length issues
@app.post("/upload-base64-image")
async def upload_base64_image(request: Request):
    """
    Handle base64 image uploads to avoid URL length issues.
    Accepts JSON with base64 image data and saves it as a file.
    """
    try:
        data = await request.json()
        base64_data = data.get("image_data")
        filename = data.get("filename", f"image_{uuid.uuid4().hex[:8]}.png")
        
        if not base64_data:
            raise HTTPException(status_code=400, detail="No image data provided")
        
        # Remove data URL prefix if present
        if base64_data.startswith("data:image"):
            base64_data = base64_data.split(",")[1]
        
        import base64
        # Decode base64 data
        image_data = base64.b64decode(base64_data)
        
        # Save to uploads directory
        file_path = UPLOAD_DIR / filename
        with open(file_path, "wb") as f:
            f.write(image_data)
        
        # Return the file URL
        return {
            "message": "Image uploaded successfully",
            "filename": filename,
            "url": f"/uploads/{filename}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

# Endpoint to serve images from base64 data URLs (temporary solution)
@app.get("/image-from-data")
async def serve_image_from_data(data: str = None):
    """
    Temporary endpoint to handle base64 image data passed as query parameter.
    This is a workaround for the URL length issue.
    """
    if not data:
        raise HTTPException(status_code=400, detail="No image data provided")
    
    try:
        # Remove data URL prefix if present
        if data.startswith("data:image"):
            mime_type = data.split(";")[0].split(":")[1]
            base64_data = data.split(",")[1]
        else:
            mime_type = "image/png"
            base64_data = data
        
        import base64
        from fastapi.responses import Response
        
        # Decode base64 data
        image_data = base64.b64decode(base64_data)
        
        return Response(content=image_data, media_type=mime_type)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image data: {str(e)}")

# ============= USER-SIDE API ENDPOINTS =============

# Additional models for orders and addresses
class UserAddress(BaseModel):
    name: str
    phone: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    pincode: str
    is_default: Optional[bool] = False

class CartItem(BaseModel):
    product_id: str
    quantity: int
    price: float

class Order(BaseModel):
    user_id: str
    items: List[CartItem]
    address: UserAddress
    payment_method: str
    total_amount: float
    status: Optional[str] = "pending"

# Initialize user collections
try:
    users_collection = db["users"]
    orders_collection = db["orders"]
    cart_collection = db["cart"]
    print("✓ User collections initialized")
except:
    users_collection = None
    orders_collection = None
    cart_collection = None

# User-side product endpoints
@app.get("/api/user/products/featured")
async def get_featured_products():
    """Get featured products for homepage"""
    try:
        if products_collection is not None:
            # Get featured products (first 10 active products)
            featured = list(products_collection.find(
                {"status": "active"}, 
                {"_id": 0}
            ).limit(10))
            
            return {"success": True, "data": featured}
        else:
            # Mock data for testing
            mock_products = [
                {
                    "id": f"prod_{i}",
                    "title": f"Handcrafted Item {i}",
                    "price": 2500 + (i * 100),
                    "images": [f"/uploads/sample_{i}.jpg"],
                    "artisan_name": f"Artisan {i}",
                    "craft_type": "Traditional"
                } for i in range(1, 11)
            ]
            return {"success": True, "data": mock_products}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/user/products/new-arrivals")
async def get_new_arrivals():
    """Get newly added products"""
    try:
        if products_collection is not None:
            new_arrivals = list(products_collection.find(
                {"status": "active"}, 
                {"_id": 0}
            ).sort("created_at", -1).limit(10))
            
            return {"success": True, "data": new_arrivals}
        else:
            # Mock data
            mock_products = [
                {
                    "id": f"new_{i}",
                    "title": f"New Arrival {i}",
                    "price": 1500 + (i * 150),
                    "images": [f"/uploads/new_{i}.jpg"],
                    "artisan_name": f"New Artisan {i}",
                    "craft_type": "Modern Traditional"
                } for i in range(1, 11)
            ]
            return {"success": True, "data": mock_products}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/user/products/bestsellers")
async def get_bestsellers():
    """Get bestselling products"""
    try:
        if products_collection is not None:
            # For now, just return first 10 products as bestsellers
            bestsellers = list(products_collection.find(
                {"status": "active"}, 
                {"_id": 0}
            ).limit(10))
            
            return {"success": True, "data": bestsellers}
        else:
            # Mock data
            mock_products = [
                {
                    "id": f"best_{i}",
                    "title": f"Bestseller {i}",
                    "price": 3000 + (i * 200),
                    "images": [f"/uploads/best_{i}.jpg"],
                    "artisan_name": f"Popular Artisan {i}",
                    "craft_type": "Premium Craft",
                    "rating": 4.5 + (i * 0.1) % 0.5
                } for i in range(1, 11)
            ]
            return {"success": True, "data": mock_products}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/user/products/all")
async def get_all_products(page: int = 1, limit: int = 20):
    """Get all products with pagination"""
    try:
        skip = (page - 1) * limit
        
        if products_collection is not None:
            products = list(products_collection.find(
                {"status": "active"}, 
                {"_id": 0}
            ).skip(skip).limit(limit))
            
            total = products_collection.count_documents({"status": "active"})
            has_more = skip + len(products) < total
            
            return {
                "success": True, 
                "data": products,
                "hasMore": has_more,
                "total": total
            }
        else:
            # Mock paginated data
            total_items = 100
            mock_products = [
                {
                    "id": f"prod_{skip + i}",
                    "title": f"Product {skip + i}",
                    "price": 2000 + ((skip + i) * 50),
                    "images": [f"/uploads/prod_{skip + i}.jpg"],
                    "artisan_name": f"Artisan {(skip + i) % 20}",
                    "craft_type": ["Traditional", "Modern", "Fusion"][(skip + i) % 3]
                } for i in range(1, min(limit + 1, total_items - skip + 1))
            ]
            
            has_more = skip + len(mock_products) < total_items
            
            return {
                "success": True, 
                "data": mock_products,
                "hasMore": has_more,
                "total": total_items
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/user/products/{product_id}")
async def get_user_product(product_id: str):
    """Get single product details for user"""
    try:
        if products_collection is not None:
            product = products_collection.find_one({"id": product_id}, {"_id": 0})
            if not product:
                return {"success": False, "message": "Product not found"}
            
            return {"success": True, "data": product}
        else:
            # Mock product data
            mock_product = {
                "id": product_id,
                "title": f"Handcrafted Product {product_id}",
                "description": "Beautiful traditional handcrafted item",
                "aiDescription": "This exquisite piece showcases the mastery of traditional craftsmanship, featuring intricate patterns and vibrant colors that reflect the rich cultural heritage of the region.",
                "price": 2750,
                "images": [f"/uploads/{product_id}_1.jpg", f"/uploads/{product_id}_2.jpg"],
                "artisanId": "artisan_123",
                "craftType": "Traditional Embroidery",
                "material": "Cotton and Silk",
                "dimensions": "12 x 8 inches",
                "origin": "Punjab, India",
                "stock": 5,
                "rating": 4.8,
                "reviews": 23
            }
            return {"success": True, "data": mock_product}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Search endpoints
@app.get("/api/user/search")
async def search_products(q: str, page: int = 1, limit: int = 20):
    """Text search for products"""
    try:
        skip = (page - 1) * limit
        
        if products_collection is not None:
            # Basic text search in title and description
            search_filter = {
                "$or": [
                    {"title": {"$regex": q, "$options": "i"}},
                    {"description": {"$regex": q, "$options": "i"}},
                    {"tags": {"$in": [q]}}
                ],
                "status": "active"
            }
            
            products = list(products_collection.find(
                search_filter, 
                {"_id": 0}
            ).skip(skip).limit(limit))
            
            total = products_collection.count_documents(search_filter)
            has_more = skip + len(products) < total
            
            return {
                "success": True, 
                "data": products,
                "hasMore": has_more,
                "total": total,
                "query": q
            }
        else:
            # Mock search results
            mock_results = [
                {
                    "id": f"search_{i}",
                    "title": f"Search Result {i} for '{q}'",
                    "price": 2000 + (i * 100),
                    "images": [f"/uploads/search_{i}.jpg"],
                    "artisan_name": f"Search Artisan {i}",
                    "craft_type": "Search Related Craft"
                } for i in range(1, min(limit + 1, 16))
            ]
            
            return {
                "success": True, 
                "data": mock_results,
                "hasMore": len(mock_results) == limit,
                "total": 15,
                "query": q
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/user/search/visual")
async def visual_search(file: UploadFile):
    """AI-powered visual search"""
    try:
        # Save uploaded image
        file_path = UPLOAD_DIR / f"search_{uuid.uuid4().hex[:8]}_{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Mock AI processing for visual search
        extracted_tags = ["traditional", "handwoven", "geometric pattern", "blue pottery", "cotton fabric"]
        
        # Simulate finding similar products
        if products_collection is not None:
            # Find products with similar tags
            similar_products = list(products_collection.find(
                {"tags": {"$in": extracted_tags}, "status": "active"}, 
                {"_id": 0}
            ).limit(20))
        else:
            # Mock similar products
            similar_products = [
                {
                    "id": f"visual_{i}",
                    "title": f"Similar Product {i}",
                    "price": 2200 + (i * 150),
                    "images": [f"/uploads/visual_{i}.jpg"],
                    "artisan_name": f"Visual Artisan {i}",
                    "craft_type": "AI Matched Craft",
                    "similarity_score": 0.95 - (i * 0.05)
                } for i in range(1, 21)
            ]
        
        # Clean up uploaded file
        try:
            os.unlink(file_path)
        except:
            pass
        
        return {
            "success": True, 
            "data": similar_products,
            "extractedTags": extracted_tags,
            "total": len(similar_products),
            "hasMore": False
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Artisan endpoints
@app.get("/api/user/artisans/{artisan_id}")
async def get_user_artisan(artisan_id: str):
    """Get artisan details for user"""
    try:
        if artisan_collection is not None:
            artisan = artisan_collection.find_one({"artisan_id": artisan_id}, {"_id": 0})
            if not artisan:
                return {"success": False, "message": "Artisan not found"}
            
            return {"success": True, "data": artisan}
        else:
            # Mock artisan data
            mock_artisan = {
                "_id": artisan_id,
                "name": "Raj Kumar Sharma",
                "location": "Hoshiarpur, Punjab",
                "craft_description": "Traditional Phulkari embroidery specialist with 25 years of experience",
                "story": "Born into a family of traditional craftspeople, Raj Kumar has been preserving the ancient art of Phulkari embroidery. His work represents the vibrant culture and heritage of Punjab.",
                "experience": 25,
                "profile_image": f"/uploads/artisan_{artisan_id}.jpg",
                "rating": 4.9,
                "total_products": 45
            }
            return {"success": True, "data": mock_artisan}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/user/products/{product_id}/related")
async def get_related_products(product_id: str):
    """Get products related to the given product"""
    try:
        if products_collection is not None:
            # Get the original product to find similar ones
            original = products_collection.find_one({"id": product_id}, {"_id": 0})
            if not original:
                return {"success": False, "message": "Product not found"}
            
            # Find related products (same artisan or similar tags)
            related = list(products_collection.find(
                {
                    "$or": [
                        {"artisan_id": original.get("artisan_id")},
                        {"tags": {"$in": original.get("tags", [])}}
                    ],
                    "id": {"$ne": product_id},
                    "status": "active"
                }, 
                {"_id": 0}
            ).limit(8))
            
            return {"success": True, "data": related}
        else:
            # Mock related products
            mock_related = [
                {
                    "id": f"related_{i}",
                    "title": f"Related Product {i}",
                    "price": 2000 + (i * 100),
                    "images": [f"/uploads/related_{i}.jpg"],
                    "artisan_name": "Same Artisan",
                    "craft_type": "Similar Craft"
                } for i in range(1, 9)
            ]
            return {"success": True, "data": mock_related}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Mock user authentication (in production, use proper JWT/OAuth)
@app.post("/api/user/auth/login")
async def user_login(credentials: UserLogin):
    """User login endpoint with database authentication"""
    try:
        user = None
        user_type = "user"
        
        # Check in users collection first
        if users_collection is not None:
            user = users_collection.find_one({"email": credentials.email}, {"_id": 0})
        
        # If not found, check in artisan profiles
        if not user and artisan_profiles_collection is not None:
            user = artisan_profiles_collection.find_one({"email": credentials.email}, {"_id": 0})
            user_type = "artisan"
        
        # Verify password if user found
        if user and "password" in user:
            if verify_password(credentials.password, user["password"]):
                # Update last login
                login_time = datetime.now().isoformat()
                if user_type == "user" and users_collection is not None:
                    users_collection.update_one(
                        {"email": credentials.email},
                        {"$set": {"last_login": login_time}}
                    )
                elif user_type == "artisan" and artisan_profiles_collection is not None:
                    artisan_profiles_collection.update_one(
                        {"email": credentials.email},
                        {"$set": {"last_login": login_time}}
                    )
                
                # Remove password from response
                user.pop("password", None)
                
                return {
                    "success": True,
                    "data": {
                        "user_id": user.get("user_id") or user.get("artisan_id"),
                        "name": user.get("full_name"),
                        "email": user.get("email"),
                        "username": user.get("username"),
                        "user_type": user_type,
                        "profile": user,
                        "token": f"jwt_token_{user.get('user_id', user.get('artisan_id', ''))[:8]}"
                    },
                    "message": "Login successful"
                }
            else:
                raise HTTPException(status_code=401, detail="Invalid password")
        else:
            # Fallback to mock authentication for testing
            if credentials.email == "user@example.com" and credentials.password == "password":
                return {
                    "success": True,
                    "data": {
                        "user_id": "user_123",
                        "name": "John Doe",
                        "email": credentials.email,
                        "username": "johndoe",
                        "user_type": "user",
                        "token": "mock_jwt_token"
                    },
                    "message": "Login successful (mock)"
                }
            else:
                raise HTTPException(status_code=401, detail="User not found or invalid credentials")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/user/auth/register")
async def user_register(user_data: UserRegistration):
    """User registration endpoint with profile creation"""
    try:
        # Validate input data
        if not validate_username(user_data.username):
            raise HTTPException(status_code=400, detail="Username must be 3-20 characters, alphanumeric and underscore only")
        
        if user_data.phone and not validate_phone(user_data.phone):
            raise HTTPException(status_code=400, detail="Invalid phone number format")
        
        if len(user_data.password) < 6:
            raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
        
        # Check if user already exists
        if users_collection is not None:
            existing_user = users_collection.find_one({"email": user_data.email})
            if existing_user:
                raise HTTPException(status_code=400, detail="User already exists")
            
            existing_username = users_collection.find_one({"username": user_data.username})
            if existing_username:
                raise HTTPException(status_code=400, detail="Username already taken")
        
        # Hash password
        hashed_password = hash_password(user_data.password)
        
        # Create user ID
        user_id = str(uuid.uuid4())
        
        # Create profile based on user type
        if user_data.user_type == "artisan":
            # Create artisan profile
            artisan_profile = ArtisanProfile(
                artisan_id=user_id,
                email=user_data.email,
                username=user_data.username,
                full_name=user_data.full_name,
                phone=user_data.phone
            )
            
            profile_dict = artisan_profile.dict()
            profile_dict["password"] = hashed_password
            
            if artisan_profiles_collection is not None:
                artisan_profiles_collection.insert_one(profile_dict)
        else:
            # Create regular user profile
            user_profile = UserProfile(
                user_id=user_id,
                email=user_data.email,
                username=user_data.username,
                full_name=user_data.full_name,
                phone=user_data.phone
            )
            
            profile_dict = user_profile.dict()
            profile_dict["password"] = hashed_password
            
            if users_collection is not None:
                users_collection.insert_one(profile_dict)
        
        return {
            "success": True,
            "data": {
                "user_id": user_id,
                "name": user_data.full_name,
                "email": user_data.email,
                "username": user_data.username,
                "user_type": user_data.user_type,
                "token": f"mock_jwt_token_{user_id[:8]}"
            },
            "message": f"{user_data.user_type.title()} registered successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Profile Management Endpoints

@app.get("/api/user/profile/{user_id}")
async def get_user_profile(user_id: str):
    """Get user profile by ID"""
    try:
        if users_collection is not None:
            profile = users_collection.find_one({"user_id": user_id}, {"_id": 0})
            if profile:
                return {"success": True, "data": profile}
        
        # Return mock data if no database
        return {
            "success": True,
            "data": {
                "user_id": user_id,
                "email": "user@example.com",
                "username": "sampleuser",
                "full_name": "Sample User",
                "profile_image": None,
                "phone": "+91-9876543210",
                "bio": "Art enthusiast and collector",
                "preferences": {"categories": ["paintings", "sculptures"]},
                "created_at": datetime.now().isoformat()
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/user/profile/{user_id}")
async def update_user_profile(user_id: str, profile_data: UserProfile):
    """Update user profile"""
    try:
        profile_data.updated_at = datetime.now().isoformat()
        
        if users_collection is not None:
            result = users_collection.update_one(
                {"user_id": user_id},
                {"$set": profile_data.dict(exclude_unset=True)}
            )
            if result.matched_count == 0:
                raise HTTPException(status_code=404, detail="User not found")
        
        return {
            "success": True,
            "data": profile_data.dict(),
            "message": "Profile updated successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/artisan/profile/{artisan_id}")
async def get_artisan_profile(artisan_id: str):
    """Get artisan profile by ID"""
    try:
        if artisan_profiles_collection is not None:
            profile = artisan_profiles_collection.find_one({"artisan_id": artisan_id}, {"_id": 0})
            if profile:
                return {"success": True, "data": profile}
        
        # Return mock data if no database
        return {
            "success": True,
            "data": {
                "artisan_id": artisan_id,
                "email": "artisan@example.com",
                "username": "masterartisan",
                "full_name": "Master Artisan",
                "profile_image": None,
                "phone": "+91-9876543210",
                "bio": "Traditional craft master with 20+ years experience",
                "craft_specialization": ["pottery", "ceramics"],
                "experience_years": 20,
                "workshop_location": {"city": "Jaipur", "state": "Rajasthan"},
                "story": "Born into a family of potters, I have been crafting beautiful ceramics for over two decades.",
                "rating": 4.8,
                "total_reviews": 156,
                "total_products": 45,
                "verification_status": "verified",
                "created_at": datetime.now().isoformat()
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/artisan/profile/{artisan_id}")
async def update_artisan_profile(artisan_id: str, profile_data: ArtisanProfile):
    """Update artisan profile"""
    try:
        profile_data.updated_at = datetime.now().isoformat()
        
        if artisan_profiles_collection is not None:
            result = artisan_profiles_collection.update_one(
                {"artisan_id": artisan_id},
                {"$set": profile_data.dict(exclude_unset=True)}
            )
            if result.matched_count == 0:
                raise HTTPException(status_code=404, detail="Artisan not found")
        
        return {
            "success": True,
            "data": profile_data.dict(),
            "message": "Artisan profile updated successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/artisans")
async def get_all_artisans(skip: int = 0, limit: int = 20, verified_only: bool = True):
    """Get list of all artisans with pagination"""
    try:
        query = {}
        if verified_only:
            query["verification_status"] = "verified"
        
        if artisan_profiles_collection is not None:
            artisans = list(artisan_profiles_collection.find(query, {"_id": 0}).skip(skip).limit(limit))
            total = artisan_profiles_collection.count_documents(query)
        else:
            # Mock data
            artisans = [
                {
                    "artisan_id": f"art_{i:03d}",
                    "username": f"artisan{i}",
                    "full_name": f"Artisan {i}",
                    "profile_image": f"/api/placeholder/100/100?text=A{i}",
                    "craft_specialization": ["pottery", "ceramics"],
                    "experience_years": 10 + i,
                    "rating": 4.0 + (i % 10) / 10,
                    "total_reviews": 50 + i * 10,
                    "verification_status": "verified",
                    "workshop_location": {"city": "Mumbai", "state": "Maharashtra"}
                }
                for i in range(skip, min(skip + limit, 50))
            ]
            total = 50
        
        return {
            "success": True,
            "data": {
                "artisans": artisans,
                "pagination": {
                    "total": total,
                    "skip": skip,
                    "limit": limit,
                    "has_more": skip + limit < total
                }
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Order and cart endpoints
@app.post("/api/user/orders")
async def create_user_order(order_data: Order):
    """Create a new order"""
    try:
        order_dict = order_data.dict()
        order_dict["order_id"] = f"ORD_{uuid.uuid4().hex[:8].upper()}"
        order_dict["created_at"] = datetime.now().isoformat()
        order_dict["updated_at"] = datetime.now().isoformat()
        
        if orders_collection is not None:
            orders_collection.insert_one(order_dict)
        
        return {
            "success": True,
            "data": {
                "orderId": order_dict["order_id"],
                "status": "confirmed",
                "total": order_data.total_amount,
                "estimated_delivery": "5-7 business days"
            },
            "message": "Order placed successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)