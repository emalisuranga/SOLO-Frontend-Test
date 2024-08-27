import React, { Component } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useSpring, animated } from 'react-spring';
import ErrorIcon from '@mui/icons-material/Error';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

const ErrorFallback = ({ onRetry }) => {
  const fade = useSpring({ from: { opacity: 0 }, to: { opacity: 1 } });
  const bounce = useSpring({
    from: { transform: 'translateY(-50px)' },
    to: { transform: 'translateY(0px)' },
    config: { tension: 280, friction: 60 },
  });

  return (
    <animated.div style={fade}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          textAlign: 'center',
          p: 3,
          bgcolor: '#f8d7da',
          color: '#721c24',
        }}
      >
        <animated.div style={bounce}>
          <ErrorIcon sx={{ fontSize: 80, mb: 2 }} />
          <Typography variant="h4" sx={{ mb: 2 }}>
            Oops! Something went wrong.
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            An unexpected error has occurred. Please try again.
          </Typography>
          <Button variant="contained" color="error" onClick={onRetry}>
            Retry
          </Button>
        </animated.div>
      </Box>
    </animated.div>
  );
};

export default ErrorBoundary;