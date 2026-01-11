import React, { createContext, useState, useContext } from 'react';
import { recommendRecipes } from '../services/api';

// Create context
const RecipeContext = createContext();

// Create provider
export function RecipeProvider({ children }) {
  const [ingredients, setIngredients] = useState([]);
  const [healthProfile, setHealthProfile] = useState({
    dailySodiumMax: 1500,
    birthDate: '',
    hasDiabetes: false,
    hasRenalDisease: false
  });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addIngredient = (ingredient) => {
    if (ingredient && !ingredients.includes(ingredient.toLowerCase())) {
      setIngredients([...ingredients, ingredient.toLowerCase()]);
    }
  };

  const removeIngredient = (ingredient) => {
    setIngredients(ingredients.filter(ing => ing !== ingredient));
  };

  const updateHealthProfile = (newProfile) => {
    setHealthProfile({ ...healthProfile, ...newProfile });
  };

  const getRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await recommendRecipes(ingredients, healthProfile);
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      // Extract error message properly
      const errorMessage = error?.message || error?.response?.data?.error || 'Failed to load recommendations. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RecipeContext.Provider
      value={{
        ingredients,
        healthProfile,
        recommendations,
        loading,
        error,
        addIngredient,
        removeIngredient,
        updateHealthProfile,
        getRecommendations
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
}

// Create and export custom hook
export const useRecipeContext = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipeContext must be used within a RecipeProvider');
  }
  return context;
};