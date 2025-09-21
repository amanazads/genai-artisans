from fastapi import FastAPI, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import shutil, pathlib
from pymongo import MongoClient
from pydantic import BaseModel, EmailStr
from typing import List, Dict, Optional
import uuid
from datetime import datetime
import os
from dotenv import load_dotenv
import hashlib
import secrets

# Load environment variables
load_dotenv()

app = FastAPI(title="KalaKriti AI Backend", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection (optional for testing)
try:
    MONGO_CLIENT = MongoClient("mongodb://localhost:27017/")
    db = MONGO_CLIENT["kalakriti"]
    artisan_collection = db["artisan_info"]
    products_collection = db["products"]
    users_collection = db["users"]
    artisan_profiles_collection = db["artisan_profiles"]
    print("✓ MongoDB connected successfully")
except Exception as e:
    print(f"⚠ MongoDB not available: {e}")
    artisan_collection = None
    products_collection = None
    users_collection = None
    artisan_profiles_collection = None

UPLOAD_DIR = pathlib.Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Pydantic models
class Info(BaseModel):
    name: str
    state: str
    city: str
    artisan_id: str
    product_info: Optional[List[Dict]] = []
    experience: int

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

# User authentication models
class UserRegistration(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    password: str
    user_type: str  # "customer" or "artisan"
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Utility functions for password handling
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

def validate_username(username: str) -> bool:
    """Validate username format"""
    import re
    if len(username) < 3 or len(username) > 20:
        return False
    return re.match(r'^[a-zA-Z0-9_]+$', username) is not None

def validate_phone(phone: str) -> bool:
    """Validate phone number format"""
    import re
    return re.match(r'^\+?[1-9]\d{1,14}$', phone.replace(' ', '').replace('-', '')) is not None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

# Basic endpoints
@app.get("/")
def read_root():
    return {"message": "KalaKriti AI Backend is running!", "status": "healthy"}

@app.get("/health")
def health_check():
    return {
        "status": "healthy", 
        "message": "Backend is running",
        "mongodb": "connected" if artisan_collection else "not available",
        "version": "1.0.0"
    }

# Simplified process endpoint (without AI for now)
@app.post("/process-and-post")
async def process_and_post(file: UploadFile, name: str = Form(...), location: str = Form(...)):
    try:
        # Save uploaded file
        file_path = UPLOAD_DIR / file.filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # For now, return mock data until AI is properly configured
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

# Artisan endpoints
@app.post("/artisan-info")
def save_artisan_info(info: Info) -> dict:
    try:
        if artisan_collection:
            artisan_collection.insert_one(info.dict())
            return {"message": "Artisan info saved successfully"}
        else:
            # Mock save for testing without MongoDB
            print(f"Mock save: {info.dict()}")
            return {"message": "Artisan info saved successfully (mock)"}
    except Exception as e:
        return {"error": str(e)}

@app.get("/artisan-info/{artisan_id}")
def get_artisan_info(artisan_id: str) -> dict:
    try:
        if artisan_collection:
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

# Product CRUD endpoints
@app.post("/products")
def create_product(product: Product):
    try:
        product_dict = product.dict()
        product_dict["id"] = str(uuid.uuid4())
        product_dict["created_at"] = datetime.now().isoformat()
        product_dict["updated_at"] = datetime.now().isoformat()
        
        if products_collection:
            products_collection.insert_one(product_dict)
        else:
            # Mock save for testing
            print(f"Mock product save: {product_dict}")
            
        return {"message": "Product created successfully", "product_id": product_dict["id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/products")
def get_products(artisan_id: Optional[str] = None, skip: int = 0, limit: int = 100):
    try:
        if products_collection:
            query = {}
            if artisan_id:
                query["artisan_id"] = artisan_id
            products = list(products_collection.find(query, {"_id": 0}).skip(skip).limit(limit))
        else:
            # Mock data for testing
            products = [
                {
                    "id": "1",
                    "title": "Traditional Punjabi Phulkari Dupatta",
                    "description": "Beautiful handcrafted dupatta",
                    "price": 2500,
                    "category": "textiles",
                    "tags": ["handmade", "traditional"],
                    "artisan_id": "artisan_001",
                    "stock": 5,
                    "status": "active"
                }
            ]
            
        return {"products": products}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/products/{product_id}")
def get_product(product_id: str):
    try:
        if products_collection:
            product = products_collection.find_one({"id": product_id}, {"_id": 0})
            if not product:
                raise HTTPException(status_code=404, detail="Product not found")
            return product
        else:
            # Mock data for testing
            return {
                "id": product_id,
                "title": "Traditional Punjabi Phulkari Dupatta",
                "description": "Beautiful handcrafted dupatta",
                "price": 2500,
                "category": "textiles",
                "tags": ["handmade", "traditional"],
                "artisan_id": "artisan_001",
                "stock": 5,
                "status": "active"
            }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/products/{product_id}")
def update_product(product_id: str, product: Product):
    try:
        product_dict = product.dict()
        product_dict["updated_at"] = datetime.now().isoformat()
        
        if products_collection:
            result = products_collection.update_one(
                {"id": product_id}, 
                {"$set": product_dict}
            )
            
            if result.matched_count == 0:
                raise HTTPException(status_code=404, detail="Product not found")
        else:
            # Mock update for testing
            print(f"Mock product update: {product_id} -> {product_dict}")
            
        return {"message": "Product updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/products/{product_id}")
def delete_product(product_id: str):
    try:
        if products_collection:
            result = products_collection.delete_one({"id": product_id})
            
            if result.deleted_count == 0:
                raise HTTPException(status_code=404, detail="Product not found")
        else:
            # Mock delete for testing
            print(f"Mock product delete: {product_id}")
            
        return {"message": "Product deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# User API endpoints
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

# User Authentication Endpoints

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
        
        # Create user profile
        user_profile = {
            "user_id": user_id,
            "email": user_data.email,
            "username": user_data.username,
            "full_name": user_data.full_name,
            "phone": user_data.phone,
            "user_type": user_data.user_type,
            "password": hashed_password,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "is_active": True
        }
        
        # Save to database
        if users_collection is not None:
            users_collection.insert_one(user_profile)
        
        # Create additional profile based on user type
        if user_data.user_type == "artisan" and artisan_profiles_collection is not None:
            artisan_profile = {
                "artisan_id": user_id,
                "email": user_data.email,
                "username": user_data.username,
                "full_name": user_data.full_name,
                "phone": user_data.phone,
                "skills": [],
                "experience_years": 0,
                "specialization": "",
                "bio": "",
                "location": {"city": "", "state": "", "country": ""},
                "social_links": {},
                "verification_status": "pending",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            artisan_profiles_collection.insert_one(artisan_profile)
        
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

@app.post("/api/user/auth/login")
async def user_login(login_data: UserLogin):
    """User login endpoint"""
    try:
        if users_collection is not None:
            user = users_collection.find_one({"email": login_data.email})
            if not user:
                raise HTTPException(status_code=401, detail="Invalid email or password")
            
            if not verify_password(login_data.password, user["password"]):
                raise HTTPException(status_code=401, detail="Invalid email or password")
            
            return {
                "success": True,
                "data": {
                    "user_id": user["user_id"],
                    "name": user["full_name"],
                    "email": user["email"],
                    "username": user["username"],
                    "user_type": user["user_type"],
                    "token": f"mock_jwt_token_{user['user_id'][:8]}"
                },
                "message": "Login successful"
            }
        else:
            # Mock response for testing without MongoDB
            return {
                "success": True,
                "data": {
                    "user_id": "mock_user_id",
                    "name": "Test User",
                    "email": login_data.email,
                    "username": "testuser",
                    "user_type": "customer",
                    "token": "mock_jwt_token_12345678"
                },
                "message": "Login successful (mock)"
            }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)