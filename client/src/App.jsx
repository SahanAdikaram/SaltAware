import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { RestaurantMenu, Favorite } from '@mui/icons-material';
import IngredientSelector from './components/IngredientSelector';
import HealthProfile from './components/HealthProfile';
import RecommendationList from './components/RecommendationList';
import { RecipeProvider } from './context/RecipeContext';

function App() {
  return (
    <RecipeProvider>
      <Box
        sx={{
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 15s ease infinite',
          py: { xs: 4, md: 8 },
          px: { xs: 2, sm: 3 },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
            pointerEvents: 'none',
          },
          '@keyframes gradientShift': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              textAlign: 'center',
              mb: { xs: 4, md: 6 },
              color: 'white',
              animation: 'fadeInUp 0.8s ease-out',
              '@keyframes fadeInUp': {
                '0%': {
                  opacity: 0,
                  transform: 'translateY(30px)',
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              },
            }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
                p: 3,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05) rotate(5deg)',
                  background: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              <RestaurantMenu sx={{ fontSize: { xs: 40, md: 56 }, color: 'white' }} />
            </Box>
            <Typography
              variant="h2"
              gutterBottom
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2.75rem', md: '4rem' },
                mb: 2,
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                letterSpacing: '-0.03em',
                background: 'linear-gradient(180deg, #ffffff 0%, #f0f0f0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              SaltAware
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
              <Favorite sx={{ fontSize: 20, color: 'rgba(255, 255, 255, 0.9)' }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 400,
                  fontSize: { xs: '1.1rem', md: '1.4rem' },
                  opacity: 0.95,
                  maxWidth: '700px',
                  mx: 'auto',
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  letterSpacing: '0.01em',
                }}
              >
                Smart Recipe Recommendations for Hypertension Management
              </Typography>
              <Favorite sx={{ fontSize: 20, color: 'rgba(255, 255, 255, 0.9)' }} />
            </Box>
          </Box>

          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: { xs: 3, md: 4 },
              animation: 'fadeInUp 1s ease-out 0.2s both',
            }}
          >
            <HealthProfile />
            <IngredientSelector />
            <RecommendationList />
          </Box>
        </Container>
      </Box>
    </RecipeProvider>
  );
}

export default App;
