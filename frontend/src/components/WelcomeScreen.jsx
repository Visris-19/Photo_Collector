import React from 'react';
import { motion } from 'framer-motion';
import { Button, Typography } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import '../styles/WelcomeScreen.css';

const WelcomeScreen = ({ onStart }) => {
  return (
    <motion.div 
      className="welcome-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="welcome-content"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
      >
        <motion.div
          className="welcome-icon"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 0, 360]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <CameraAltIcon style={{ fontSize: 64 }} />
        </motion.div>
        
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Photo Collector
        </Typography>
        
        <Typography variant="body1" paragraph>
          Capture burst photos easily and store them securely in your Google Drive.
        </Typography>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            variant="contained" 
            size="large" 
            onClick={onStart}
            startIcon={<CameraAltIcon />}
          >
            Start Capturing
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeScreen;