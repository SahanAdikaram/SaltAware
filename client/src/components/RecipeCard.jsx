import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Stack, 
  Box, 
  Divider 
} from '@mui/material';
import { Favorite, AccessTime, LocalDining } from '@mui/icons-material';

const RecipeCard = ({ recipe }) => {
  // Defensive check
  if (!recipe) {
    return null;
  }

  const getSodiumStatus = (sodium) => {
    const sodiumValue = sodium || 0;
    if (sodiumValue < 150) return { label: 'Very Low Sodium', color: 'success' };
    if (sodiumValue < 300) return { label: 'Low Sodium', color: 'success' };
    if (sodiumValue < 600) return { label: 'Moderate Sodium', color: 'warning' };
    return { label: 'High Sodium', color: 'error' };
  };

  const sodiumStatus = getSodiumStatus(recipe?.sodium);

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${
            sodiumStatus.color === 'success' ? '#4caf50' : 
            sodiumStatus.color === 'warning' ? '#ff9800' : '#f44336'
          } 0%, ${
            sodiumStatus.color === 'success' ? '#81c784' : 
            sodiumStatus.color === 'warning' ? '#ffb74d' : '#e57373'
          } 100%)`,
          opacity: 0.8,
        },
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2), 0 8px 24px rgba(102, 126, 234, 0.15)',
          '&::before': {
            opacity: 1,
          },
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3.5 }}>
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{
            fontWeight: 800,
            mb: 2.5,
            color: 'text.primary',
            fontSize: '1.35rem',
            letterSpacing: '-0.01em',
            lineHeight: 1.3,
          }}
        >
          {recipe?.name || 'Untitled Recipe'}
        </Typography>
        
        <Stack 
          direction="row" 
          spacing={1} 
          sx={{ 
            mb: 3,
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Chip 
            label={`${recipe?.matchScore || 0}% Match`}
            color="primary"
            size="small"
            sx={{ 
              fontWeight: 700,
              fontSize: '0.8rem',
              height: '28px',
              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)',
            }}
          />
          <Chip 
            label={sodiumStatus.label}
            color={sodiumStatus.color}
            size="small"
            sx={{ 
              fontWeight: 600,
              fontSize: '0.8rem',
              height: '28px',
            }}
          />
          {recipe?.hasDiabetes && recipe?.carbs > 30 && (
            <Chip 
              label="High Carb"
              color="warning"
              size="small"
              sx={{ 
                fontWeight: 600,
                fontSize: '0.8rem',
                height: '28px',
              }}
            />
          )}
        </Stack>
        
        <Box
          sx={{
            mb: 3,
            p: 2,
            borderRadius: '12px',
            backgroundColor: 'grey.50',
            border: '1px solid',
            borderColor: 'grey.200',
          }}
        >
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              lineHeight: 1.7,
              fontSize: '0.9rem',
            }}
          >
            <Box component="span" sx={{ fontWeight: 700, color: 'text.primary', display: 'block', mb: 0.5 }}>
              Ingredients:
            </Box>
            {recipe?.ingredients?.map(i => i?.name || '').filter(Boolean).join(', ') || 'No ingredients listed'}
          </Typography>
        </Box>
        
        <Divider sx={{ my: 2.5, opacity: 0.2 }} />
        
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2,
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          <Chip 
            icon={<AccessTime fontSize="small" />}
            label={`${Math.floor(Math.random() * 10) + 15} min`}
            size="small"
            sx={{ 
              fontWeight: 600,
              backgroundColor: 'rgba(102, 126, 234, 0.1)',
              color: 'primary.main',
            }}
          />
          <Chip 
            icon={<LocalDining fontSize="small" />}
            label={`${recipe?.calories || 0} cal`}
            size="small"
            sx={{ 
              fontWeight: 600,
              backgroundColor: 'rgba(118, 75, 162, 0.1)',
              color: 'secondary.main',
            }}
          />
          <Chip 
            icon={<Favorite fontSize="small" />}
            label={`${recipe?.sodium || 0}mg sodium`}
            size="small"
            color={sodiumStatus.color}
            sx={{ 
              fontWeight: 600,
            }}
          />
        </Box>
        
        <Typography 
          variant="body2" 
          sx={{ 
            mt: 2.5,
            fontStyle: 'italic',
            color: 'text.secondary',
            lineHeight: 1.7,
            fontSize: '0.875rem',
            backgroundColor: 'grey.50',
            p: 1.5,
            borderRadius: '10px',
          }}
        >
          {recipe?.instructions ? recipe.instructions.substring(0, 130) + '...' : 'No instructions available'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;