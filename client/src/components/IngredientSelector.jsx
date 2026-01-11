import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Chip, 
  Grid,
  Autocomplete,
  Stack
} from '@mui/material';
import { Kitchen, AddCircle } from '@mui/icons-material';
import { useRecipeContext } from '../context/RecipeContext';

const commonIngredients = [
  'chicken', 'salmon', 'rice', 'pasta', 'tomato', 
  'onion', 'garlic', 'broccoli', 'carrot', 'lettuce',
  'olive oil', 'lemon', 'soy sauce', 'lentils', 'beans',
  'potato', 'spinach', 'egg', 'milk', 'cheese'
];

const IngredientSelector = () => {
  const { ingredients, addIngredient, removeIngredient } = useRecipeContext();
  const [inputValue, setInputValue] = useState('');
  
  // Defensive check - must be after hooks
  if (!ingredients || !addIngredient || !removeIngredient) {
    return null;
  }
  
  const handleAdd = () => {
  if (inputValue.trim()) {
    const normalized = normalizeIngredient(inputValue);
    addIngredient(normalized);
    setInputValue('');
  }
};
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

const normalizeIngredient = (ing) => {
  return ing.trim().toLowerCase().replace(/s+/g, ' ');
};

  return (
    <Box 
      sx={{ 
        mb: 4, 
        p: { xs: 3, md: 4.5 }, 
        borderRadius: 3,
        backgroundColor: 'background.paper',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          backgroundSize: '200% 100%',
          animation: 'gradientShift 3s ease infinite',
        },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
          }}
        >
          <Kitchen sx={{ fontSize: 28, color: 'white' }} />
        </Box>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 800,
            color: 'text.primary',
            letterSpacing: '-0.01em',
          }}
        >
          Your Pantry
        </Typography>
      </Stack>
      
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} sm={8}>
          <Autocomplete
            freeSolo
            options={commonIngredients}
            inputValue={inputValue}
            onInputChange={(_, newValue) => setInputValue(newValue)}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Add an ingredient"
                fullWidth
                onKeyPress={handleKeyPress}
                placeholder="Type or select an ingredient"
              />
            )}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '14px',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={handleAdd}
            fullWidth
            startIcon={<AddCircle />}
            sx={{ 
              height: '56px',
              borderWidth: 2,
              fontWeight: 700,
              fontSize: '1rem',
              borderRadius: '14px',
              '&:hover': {
                borderWidth: 2,
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              },
            }}
          >
            Add Ingredient
          </Button>
        </Grid>
      </Grid>
      
      {ingredients.length > 0 && (
        <Box 
          sx={{ 
            mt: 3, 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 1.5,
            p: 3,
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            border: '1px solid',
            borderColor: 'grey.200',
            minHeight: '60px',
            alignItems: 'center',
          }}
        >
          {ingredients.map((ingredient, index) => (
            <Chip
              key={index}
              label={ingredient}
              onDelete={() => removeIngredient(ingredient)}
              sx={{ 
                textTransform: 'capitalize',
                fontWeight: 600,
                fontSize: '0.9rem',
                height: '36px',
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
                },
                '& .MuiChip-deleteIcon': {
                  color: 'text.secondary',
                  fontSize: '20px',
                  '&:hover': {
                    color: 'error.main',
                    transform: 'scale(1.2)',
                  }
                }
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default IngredientSelector;