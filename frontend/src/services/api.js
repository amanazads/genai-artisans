import axios from 'axios'

// API base URL - can be configured via environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds timeout for AI processing
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add authentication token if available
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API service functions
export const apiService = {
  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/health')
      return response.data
    } catch (error) {
      console.error('Health check failed:', error)
      throw error
    }
  },

  // Artisan services
  saveArtisanInfo: async artisanData => {
    try {
      const response = await api.post('/artisan-info', artisanData)
      return response.data
    } catch (error) {
      console.error('Save artisan info failed:', error)
      throw error
    }
  },

  getArtisanInfo: async artisanId => {
    try {
      const response = await api.get(`/artisan-info/${artisanId}`)
      return response.data
    } catch (error) {
      console.error('Get artisan info failed:', error)
      throw error
    }
  },

  // Product services
  createProduct: async productData => {
    try {
      const response = await api.post('/products', productData)
      return response.data
    } catch (error) {
      console.error('Create product failed:', error)
      throw error
    }
  },

  getProducts: async (artisanId = null, skip = 0, limit = 100) => {
    try {
      const params = new URLSearchParams({
        skip: skip.toString(),
        limit: limit.toString()
      })
      if (artisanId) params.append('artisan_id', artisanId)
      const response = await api.get(`/products?${params}`)
      return response.data
    } catch (error) {
      console.error('Get products failed:', error)
      throw error
    }
  },

  getProduct: async productId => {
    try {
      const response = await api.get(`/products/${productId}`)
      return response.data
    } catch (error) {
      console.error('Get product failed:', error)
      throw error
    }
  },

  updateProduct: async (productId, productData) => {
    try {
      const response = await api.put(`/products/${productId}`, productData)
      return response.data
    } catch (error) {
      console.error('Update product failed:', error)
      throw error
    }
  },

  deleteProduct: async productId => {
    try {
      const response = await api.delete(`/products/${productId}`)
      return response.data
    } catch (error) {
      console.error('Delete product failed:', error)
      throw error
    }
  },

  // Image processing and Instagram posting
  processAndPost: async (file, artisanName, artisanLocation) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('name', artisanName)
      formData.append('location', artisanLocation)

      const response = await api.post('/process-and-post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 60000 // 60 seconds for AI processing
      })
      return response.data
    } catch (error) {
      console.error('Process and post failed:', error)
      throw error
    }
  },

  // Instagram posting for existing products
  postToInstagram: async (imagePath, productData) => {
    try {
      console.log('📸 Starting Instagram post process...', {
        imagePath,
        productData
      })

      // Check if imagePath is a base64 data URL
      if (imagePath && imagePath.startsWith('data:')) {
        console.log('🔄 Converting base64 image to file...')

        // First upload the base64 image to get a proper URL
        const uploadResponse = await api.post('/upload-base64-image', {
          image_data: imagePath,
          filename: `product_${productData.id || Date.now()}.png`
        })

        // Use the returned URL for Instagram posting
        imagePath = uploadResponse.data.url
        console.log('✅ Base64 image converted to URL:', imagePath)
      }

      // Post to Instagram using the URL
      const response = await api.post('/instagram/post-from-url', {
        image_url: imagePath,
        username: productData.username, // Optional
        password: productData.password // Optional
      })

      console.log('🚀 Instagram posting successful:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Instagram posting failed:', error)

      // Handle different error scenarios
      if (error.response?.status === 400) {
        const errorData = error.response.data

        if (errorData.error?.includes('Base64')) {
          throw new Error(
            'Image format not supported. Please try uploading the image again.'
          )
        }

        if (
          errorData.error?.includes('credentials') ||
          errorData.error?.includes('login')
        ) {
          throw new Error(
            'Instagram login failed. Please check your credentials.'
          )
        }

        if (
          errorData.error?.includes('download') ||
          errorData.error?.includes('fetch')
        ) {
          throw new Error(
            'Could not access the image. Please try uploading a different image.'
          )
        }

        throw new Error(
          errorData.message || 'Instagram posting failed. Please try again.'
        )
      }

      if (error.response?.status === 503) {
        console.warn('⚠️ Instagram service not available, using simulation')
        return {
          status: 'simulated',
          message: 'Instagram posting simulated (service not available)',
          description: 'Beautiful handcrafted artwork',
          caption:
            '✨ Beautiful handcrafted artwork! 🎨 #handmade #artisan #craft',
          post_id: `sim_${Date.now()}`
        }
      }

      if (error.response?.status === 404) {
        throw new Error(
          'Image not found. Please make sure the image exists and try again.'
        )
      }

      // Network or other errors
      if (!error.response) {
        throw new Error('Network error. Please check your internet connection.')
      }

      throw new Error('Instagram posting failed. Please try again later.')
    }
  },

  // Authentication (placeholder for future implementation)
  sendOTP: mobileNumber => {
    // This would connect to a real OTP service
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          data: { message: 'OTP sent successfully', otpId: 'dummy_otp_id' }
        })
      }, 1500)
    })
  },

  verifyOTP: (otpId, otp) => {
    // This would verify OTP with a real service
    return new Promise(resolve => {
      setTimeout(() => {
        if (otp === '1234') {
          // Mock OTP for testing
          resolve({
            data: {
              message: 'OTP verified successfully',
              token: 'dummy_auth_token',
              user: { name: 'Rajesh Kumar', id: 'artisan_001' }
            }
          })
        } else {
          throw new Error('Invalid OTP')
        }
      }, 1500)
    })
  }
}

export default api
