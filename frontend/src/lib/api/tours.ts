import { Tour } from "@/types";

const API_BASE_URL = 'http://localhost:4000/api';

export const toursApi = {
  // Get all tours
  getAllTours: async (): Promise<Tour[]> => {
    const response = await fetch(`${API_BASE_URL}/tours`);
    if (!response.ok) {
      throw new Error('Failed to fetch tours');
    }
    return response.json();
  },

  // Get tour by ID
  getTourById: async (id: string): Promise<Tour> => {
    const response = await fetch(`${API_BASE_URL}/tours/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch tour');
    }
    return response.json();
  },

  // Create new tour
  createTour: async (tour: Omit<Tour, 'id' | 'created_at' | 'updated_at'>): Promise<Tour> => {
    const response = await fetch(`${API_BASE_URL}/tours`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tour),
    });
    if (!response.ok) {
      throw new Error('Failed to create tour');
    }
    return response.json();
  },

  // Update tour
  updateTour: async (id: string, tour: Partial<Tour>): Promise<Tour> => {
    const response = await fetch(`${API_BASE_URL}/tours/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tour),
    });
    if (!response.ok) {
      throw new Error('Failed to update tour');
    }
    return response.json();
  },

  // Delete tour
  deleteTour: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/tours/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete tour');
    }
  },
}; 