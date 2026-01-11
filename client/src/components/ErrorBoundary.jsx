import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { ErrorOutline, Refresh } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Extract error message properly
    let errorMessage = 'Unknown error';
    if (error) {
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.toString && typeof error.toString === 'function') {
        try {
          errorMessage = error.toString();
        } catch (e) {
          errorMessage = 'An error occurred';
        }
      } else {
        try {
          errorMessage = JSON.stringify(error);
          if (errorMessage === '{}') {
            errorMessage = 'An error occurred';
          }
        } catch (e) {
          errorMessage = 'An error occurred';
        }
      }
    }
    
    this.setState({
      error: error,
      errorInfo: errorInfo,
      errorMessage: errorMessage
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI
      let errorMessage = 'Something went wrong';
      
      if (this.state.errorMessage) {
        errorMessage = this.state.errorMessage;
      } else if (this.state.error) {
        if (typeof this.state.error === 'string') {
          errorMessage = this.state.error;
        } else if (this.state.error.message) {
          errorMessage = this.state.error.message;
        } else if (this.state.error.toString && typeof this.state.error.toString === 'function') {
          try {
            errorMessage = this.state.error.toString();
          } catch (e) {
            errorMessage = 'An error occurred';
          }
        }
      }
      
      return (
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Box
            sx={{
              textAlign: 'center',
              p: 4,
              borderRadius: 3,
              backgroundColor: 'background.paper',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}
          >
            <ErrorOutline sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
              Oops! Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {errorMessage}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Refresh />}
              onClick={this.handleReset}
              sx={{ mt: 2 }}
            >
              Refresh Page
            </Button>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

