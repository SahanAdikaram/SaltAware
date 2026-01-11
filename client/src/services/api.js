import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const recommendRecipes = async (ingredients, healthProfile) => {
  try {
    console.log("Sending to API:", { ingredients, healthProfile });
    const response = await axios.post(`${API_URL}/recommend`, {
      ingredients,
      healthProfile
    });
    console.log("API response:", response);
    return response.data;
  } catch (error) {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    // Extract proper error message
    let errorMessage = 'Failed to load recommendations. Please try again.';
    
    if (error.response?.data) {
      if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    // Create a new error with the proper message
    const customError = new Error(errorMessage);
    customError.response = error.response;
    throw customError;
  }
};
