// Type definitions that match the backend Pydantic models

export interface ArtisanInfo {
  name: string;
  state: string;
  city: string;
  artisan_id: string;
  product_info?: any[];
  experience: number;
  craft_description?: string;
  story?: string;
}

export interface Product {
  id?: string;
  title: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  artisan_id: string;
  stock?: number;
  status?: 'active' | 'inactive' | 'draft';
  images?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface AIProcessingResult {
  artisan: {
    name: string;
    location: string;
  };
  seed: {
    craft_hint: string;
    labels: string[];
    colors: string[];
  };
  listing: {
    title: string;
    short_description: string;
    long_description: string;
    tags: string[];
    suggested_price: number;
    price_explanation: string;
  };
  poster: string; // Path to generated poster image
}

export interface ProcessAndPostResponse {
  refined_listing: AIProcessingResult['listing'];
  insta_post: {
    status: string;
    message: string;
    description?: string;
    caption?: string;
  };
  poster_path: string;
  message?: string; // For fallback scenarios
}

export interface HealthCheckResponse {
  status: string;
  message: string;
  mongodb: string;
  ai_features: string;
  instagram: string;
  version: string;
}

export interface APIResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

export interface ProductsResponse {
  products: Product[];
}

export interface CreateProductResponse {
  message: string;
  product_id: string;
}

export interface InstagramPostResponse {
  status: string;
  message: string;
  product_title?: string;
  post_id?: string;
  timestamp?: string;
  description?: string;
  caption?: string;
}