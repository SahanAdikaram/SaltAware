import React, { useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, Paper } from '@mui/material';
import { useRecipeContext } from '../context/RecipeContext';
import RecipeCard from './RecipeCard';

const RecommendationList = () => {
  const { recommendations, loading, error } = useRecipeContext(); // Add error state
  
  // Defensive checks
  const safeRecommendations = recommendations || [];
  const safeLoading = loading || false;
  const safeError = error || null;
  
  // Add debug logging
  useEffect(() => {
    console.log("Recommendations:", safeRecommendations);
    console.log("Loading state:", safeLoading);
    if (safeError) console.error("Error:", safeError);
  }, [safeRecommendations, safeLoading, safeError]);

  return (
    <Box sx={{ mb: 4 }}>
      <Typography 
        variant="h5" 
        gutterBottom
        sx={{ 
          mb: 3,
          fontWeight: 700,
          color: 'white',
          textShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
      >
        Recommended Recipes
      </Typography>
      
      {safeError ? (
        <Alert 
          severity="error"
          sx={{ 
            borderRadius: 2,
            mb: 2,
          }}
        >
          {typeof safeError === 'string' ? safeError : safeError?.message || 'An error occurred'}
        </Alert>
      ) : safeLoading ? (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            my: 6,
            color: 'white',
          }}
        >
          <CircularProgress sx={{ color: 'white' }} />
          <Typography 
            variant="body1" 
            sx={{ 
              ml: 2,
              color: 'white',
              fontWeight: 500,
            }}
          >
            Loading recommendations...
          </Typography>
        </Box>
      ) : safeRecommendations.length === 0 ? (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            borderRadius: 3,
            backgroundColor: 'background.paper',
          }}
        >
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ 
              fontSize: '1.1rem',
            }}
          >
            Add ingredients and set your health profile to get recommendations
          </Typography>
        </Paper>
      ) : (
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' }, 
            gap: 3 
          }}
        >
          {safeRecommendations.map(recipe => (
            <RecipeCard key={recipe?.id || Math.random()} recipe={recipe} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default RecommendationList;