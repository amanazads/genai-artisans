# KalaKriti AI - Frontend & Backend Integration

## Project Structure
```
Kalakriti/
├── backend/                 # FastAPI backend
│   ├── main.py             # Main API server
│   ├── image.py            # AI image processing
│   ├── instaPost.py        # Instagram integration
│   ├── requirements.txt    # Python dependencies
│   ├── start.bat          # Windows start script
│   ├── start.sh           # Linux/Mac start script
│   └── .env               # Environment variables
└── KalaKriti/              # React frontend
    ├── src/
    │   ├── services/
    │   │   └── api.js      # API service layer
    │   ├── pages/          # React pages
    │   └── components/     # React components
    ├── package.json        # Node dependencies
    ├── .env               # Frontend environment
    └── .env.example       # Environment template
```

## Quick Start

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- MongoDB (local or cloud)

### 1. Backend Setup
```bash
cd backend
# Windows
start.bat

# Linux/Mac
chmod +x start.sh
./start.sh
```

### 2. Frontend Setup
```bash
cd KalaKriti
npm install
npm run dev
```

### 3. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Features Connected

✅ **Image Upload & AI Processing**
- Upload images on AddProductPage
- AI generates product listings
- Integrates with Google Gemini and vision APIs

✅ **Product Management**
- Create, read, update, delete products
- Store products in MongoDB
- Real-time data synchronization

✅ **Artisan Profile Management**
- Save artisan information
- Connect profiles to products

✅ **Authentication Framework**
- OTP-based login system
- Token management
- Session handling

## API Endpoints

### Core Endpoints
- `POST /process-and-post` - Process images with AI
- `POST /artisan-info` - Save artisan information
- `GET /artisan-info/{id}` - Get artisan details

### Product Endpoints
- `POST /products` - Create product
- `GET /products` - List products
- `GET /products/{id}` - Get product details
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product

### Utility
- `GET /health` - Health check

## Environment Configuration

### Backend (.env)
```
GENAI_API_KEY=your_gemini_api_key
PROJECT_ID=your_gcp_project
REGION=us-central1
INSTA_USER=your_instagram_username
INSTA_PASS=your_instagram_password
HUGGINGFACEHUB_API_KEY=your_huggingface_key
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=KalaKriti AI
VITE_APP_VERSION=1.0.0
```

## Next Steps

1. **Production Deployment**
   - Deploy backend to cloud (AWS, GCP, Azure)
   - Deploy frontend to Vercel/Netlify
   - Update CORS origins and API URLs

2. **Enhanced Features**
   - Real file upload to cloud storage
   - Advanced authentication
   - Real-time notifications
   - Payment integration

3. **Testing**
   - Run backend: `uvicorn main:app --reload`
   - Run frontend: `npm run dev`
   - Test the complete workflow

## Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure backend CORS is configured for frontend URL
2. **API Connection**: Check if backend is running on port 8000
3. **MongoDB**: Ensure MongoDB is running and accessible
4. **Environment Variables**: Verify all required variables are set

### Development Tips
- Use browser dev tools to monitor network requests
- Check backend logs for API errors
- Verify MongoDB collections are created
- Test individual API endpoints using FastAPI docs

## Technologies Used
- **Frontend**: React, Vite, Tailwind CSS, Axios
- **Backend**: FastAPI, Python, MongoDB
- **AI**: Google Gemini, Vertex AI, Hugging Face
- **Social**: Instagram API integration