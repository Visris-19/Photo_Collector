import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const uploadPhotos = async (photos) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/upload`, { photos });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Upload error:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
};