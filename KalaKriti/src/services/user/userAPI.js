const API_BASE_URL = 'http://127.0.0.1:8000/api/user'

class UserAPIService {
  // Product endpoints
  async getFeaturedProducts () {
    try {
      const response = await fetch(`${API_BASE_URL}/products/featured`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching featured products:', error)
      throw error
    }
  }

  async getNewArrivals () {
    try {
      const response = await fetch(`${API_BASE_URL}/products/new-arrivals`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching new arrivals:', error)
      throw error
    }
  }

  async getBestsellers () {
    try {
      const response = await fetch(`${API_BASE_URL}/products/bestsellers`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching bestsellers:', error)
      throw error
    }
  }

  async getAllProducts (page = 1, limit = 20) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/products/all?page=${page}&limit=${limit}`
      )
      return await response.json()
    } catch (error) {
      console.error('Error fetching all products:', error)
      throw error
    }
  }

  async getProduct (productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching product:', error)
      throw error
    }
  }

  async getRelatedProducts (productId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/products/${productId}/related`
      )
      return await response.json()
    } catch (error) {
      console.error('Error fetching related products:', error)
      throw error
    }
  }

  // Search endpoints
  async searchProducts (query, filters = {}) {
    try {
      const params = new URLSearchParams({
        q: query,
        ...filters
      })

      const response = await fetch(`${API_BASE_URL}/search?${params}`)
      return await response.json()
    } catch (error) {
      console.error('Error searching products:', error)
      throw error
    }
  }

  async visualSearch (imageFile, options = {}) {
    try {
      const formData = new FormData()
      formData.append('file', imageFile)

      // Add any additional options
      Object.keys(options).forEach(key => {
        formData.append(key, JSON.stringify(options[key]))
      })

      const response = await fetch(`${API_BASE_URL}/search/visual`, {
        method: 'POST',
        body: formData
      })

      return await response.json()
    } catch (error) {
      console.error('Error performing visual search:', error)
      throw error
    }
  }

  // Artisan endpoints
  async getArtisan (artisanId) {
    try {
      const response = await fetch(`${API_BASE_URL}/artisans/${artisanId}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching artisan:', error)
      throw error
    }
  }

  // Authentication endpoints
  async login (email, password, userType = 'user') {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('Error logging in:', error)
      throw error
    }
  }

  async register (userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('Error registering:', error)
      throw error
    }
  }

  // User profile endpoints
  async getUserAddresses () {
    try {
      // Mock implementation - in production, use actual API
      return {
        success: true,
        data: [
          {
            id: 'addr_1',
            name: 'Home',
            phone: '+91 9876543210',
            address_line1: '123 Main Street',
            address_line2: 'Apartment 4B',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            is_default: true
          }
        ]
      }
    } catch (error) {
      console.error('Error fetching user addresses:', error)
      throw error
    }
  }

  async addUserAddress (addressData) {
    try {
      // Mock implementation
      return {
        success: true,
        data: {
          id: `addr_${Date.now()}`,
          ...addressData
        },
        message: 'Address added successfully'
      }
    } catch (error) {
      console.error('Error adding address:', error)
      throw error
    }
  }

  // Order endpoints
  async createOrder (orderData) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })

      return await response.json()
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  }

  async getOrder (orderId) {
    try {
      // Mock implementation
      return {
        success: true,
        data: {
          orderId,
          status: 'confirmed',
          items: [],
          total: 0,
          created_at: new Date().toISOString()
        }
      }
    } catch (error) {
      console.error('Error fetching order:', error)
      throw error
    }
  }

  async getUserOrders () {
    try {
      // Mock implementation
      return {
        success: true,
        data: []
      }
    } catch (error) {
      console.error('Error fetching user orders:', error)
      throw error
    }
  }

  // Payment integration helpers
  async initializePayment (paymentData) {
    try {
      // Mock payment initialization
      // In production, integrate with Razorpay/Stripe
      return {
        success: true,
        data: {
          payment_id: `pay_${Date.now()}`,
          status: 'pending',
          redirect_url: null // For payment gateway redirect
        }
      }
    } catch (error) {
      console.error('Error initializing payment:', error)
      throw error
    }
  }

  async verifyPayment (paymentId, signature) {
    try {
      // Mock payment verification
      return {
        success: true,
        data: {
          payment_id: paymentId,
          status: 'verified'
        }
      }
    } catch (error) {
      console.error('Error verifying payment:', error)
      throw error
    }
  }
}

// Create and export a singleton instance
export const userAPI = new UserAPIService()
export default userAPI
