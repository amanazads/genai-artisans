// Image service to handle backend upload directory and image URLs

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const imageService = {
  // Convert backend image path to full URL
  getImageUrl: imagePath => {
    if (!imagePath) return null

    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
      return imagePath
    }

    // Handle base64 data URLs - convert them through backend endpoint
    if (imagePath.startsWith('data:')) {
      // For base64 data, use the backend conversion endpoint
      return `${API_BASE_URL}/image-from-data?data=${encodeURIComponent(
        imagePath
      )}`
    }

    // If it's a backend upload path, construct the full URL
    if (
      imagePath.startsWith('uploads/') ||
      imagePath.startsWith('./uploads/')
    ) {
      const cleanPath = imagePath.replace('./', '')
      return `${API_BASE_URL}/${cleanPath}`
    }

    // If it's just a filename, assume it's in uploads directory
    return `${API_BASE_URL}/uploads/${imagePath}`
  },

  // Get fallback image for different product categories
  getFallbackImage: (category = 'other') => {
    const fallbackImages = {
      textiles:
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop&crop=center',
      pottery:
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center',
      jewelry:
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&crop=center',
      woodwork:
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center',
      painting:
        'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop&crop=center',
      other:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center'
    }

    return fallbackImages[category] || fallbackImages.other
  },

  // Process image array from backend
  processProductImages: function (images, category = 'other') {
    if (!images || !Array.isArray(images) || images.length === 0) {
      return [this.getFallbackImage(category)]
    }

    return images.map(img => this.getImageUrl(img)).filter(Boolean)
  },

  // Handle image upload (placeholder for future file upload functionality)
  uploadImage: async file => {
    // This would be implemented when we add file upload to backend
    // For now, return a promise that resolves to a placeholder
    return new Promise(resolve => {
      setTimeout(() => {
        const reader = new FileReader()
        reader.onload = e => {
          resolve(e.target.result)
        }
        reader.readAsDataURL(file)
      }, 1000)
    })
  },

  // Convert data URL to displayable format
  processDataUrl: function (dataUrl) {
    if (!dataUrl) return null

    // If it's already a data URL, return as is
    if (dataUrl.startsWith('data:')) {
      return dataUrl
    }

    // Otherwise, treat as regular URL
    return this.getImageUrl(dataUrl)
  }
}

export default imageService
