import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import { 
  CameraAlt, 
  CloudUpload,
  Add as AddIcon,
  Remove as RemoveIcon,
  InfoOutlined,
  FlashOn,
  Timer,
  GridOn
} from '@mui/icons-material';
import axios from 'axios';
import '../styles/PhotoCapture.css';
import { PhotoCamera, BurstMode, Timer10 } from '@mui/icons-material';

const PhotoCapture = () => {
  const [showSetup, setShowSetup] = useState(true);
  const [settings, setSettings] = useState({
    name: '',
    photoCount: 10,
    captureSpeed: 0.5 // in seconds
  });
  const [photos, setPhotos] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    name: '',
    photoCount: '',
    captureSpeed: ''
  });
  const [showGrid, setShowGrid] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Camera initialization
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setError('');
    } catch (err) {
      setError('Error accessing camera: ' + err.message);
      console.error('Error accessing camera:', err);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Photo capture functions
  const capturePhoto = () => {
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const startBurst = async () => {
    if (!settings.name.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsCapturing(true);
    setPhotos([]);
    const newPhotos = [];

    try {
      for (let i = 0; i < settings.photoCount; i++) {
        const photo = capturePhoto();
        newPhotos.push(photo);
        setPhotos(prev => [...prev, photo]);
        // Convert seconds to milliseconds for setTimeout
        await new Promise(resolve => setTimeout(resolve, settings.captureSpeed * 1000));
      }
    } catch (error) {
      setError('Error during capture: ' + error.message);
    } finally {
      setIsCapturing(false);
    }
  };

  const uploadPhotos = async () => {
    try {
      setIsLoading(true);
      setUploadStatus('Uploading...');
      
      const namedPhotos = photos.map((photo, index) => ({
        data: photo,
        name: generateFileName(index)
      }));

      const response = await axios.post('http://localhost:5000/api/upload', {
        photos: namedPhotos
      });
      
      setUploadStatus(`Upload complete! ${response.data.results.length} photos uploaded.`);
      setTimeout(() => {
        setPhotos([]);
        setUploadStatus('');
      }, 3000);
    } catch (error) {
      setUploadStatus(`Upload failed: ${error.message}`);
      console.error('Upload error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateFileName = (index) => {
    const randomNum = Math.floor(Math.random() * 10000);
    return `${settings.name.trim() || 'unknown'}_${randomNum}_${index + 1}`;
  };

  const validateForm = () => {
    const errors = {
      name: !settings.name.trim() ? 'Please enter your name' : '',
      photoCount: settings.photoCount < 1 ? 'Please set number of photos' : '',
      captureSpeed: settings.captureSpeed < 0.5 ? 'Please set capture speed' : ''
    };
    
    setFormErrors(errors);
    return Object.values(errors).every(error => error === '');
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setSettings(prev => ({...prev, name: newName}));
    setFormErrors(prev => ({...prev, name: ''}));
  };

  const handleStartCapture = () => {
    if (validateForm()) {
      setShowSetup(false);
      startCamera();
    }
  };

  const handleNumberChange = (field, value, min, max) => {
    const numValue = parseInt(value) || min;
    const boundedValue = Math.min(Math.max(numValue, min), max);
    setSettings(prev => ({...prev, [field]: boundedValue}));
    setFormErrors(prev => ({...prev, [field]: ''}));
  };

  const handleSpeedChange = (type) => {
    setSettings(prev => {
      let newSpeed = prev.captureSpeed;
      
      if (type === 'increment') {
        newSpeed = newSpeed === 0.5 ? 1 : Math.min(newSpeed + 1, 5);
      } else {
        newSpeed = newSpeed === 1 ? 0.5 : Math.max(newSpeed - 1, 0.5);
      }
      
      return {
        ...prev,
        captureSpeed: newSpeed
      };
    });
  };

  // Convert capture speed for display
  const getDisplaySpeed = (speed) => {
    return speed === 0.5 ? '0.5s' : `${speed}s`;
  };

  return (
    <div className="camera-app">
      <motion.header 
        className="camera-header"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-content">
          <PhotoCamera className="header-icon" />
          <Typography variant="h5" className="header-title">
            PHOTO COLLECTOR
          </Typography>
          <div className="header-status">
            <div className="status-indicator"></div>
            BURST MODE
          </div>
        </div>
      </motion.header>

      <main className="camera-viewport">
        <div className="camera-frame">
          <video ref={videoRef} autoPlay playsInline />
          <div className="camera-overlay">
            <div className="focus-frame" data-focused={isFocused}></div>
            <div className="capture-info">
              <span className="info-item">
                <BurstMode /> {settings?.photoCount || 10} Photos
              </span>
              <span className="info-item">
                <Timer10 /> {settings?.captureSpeed || 500}ms
              </span>
            </div>
          </div>
        </div>

        <motion.div 
          className="camera-controls"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <button 
            className="shutter-button"
            onClick={startBurst}
            disabled={isCapturing}
          >
            <span className="shutter-ring"></span>
            <span className="shutter-core">
              <CameraAlt />
            </span>
          </button>
        </motion.div>
      </main>

      <AnimatePresence>
        {showSetup && (
          <motion.div className="settings-overlay">
            <motion.div className="settings-form">
              <div className="form-header">
                <motion.div className="header-icon">📸</motion.div>
                <Typography variant="h5" className="form-title">
                  Burst Mode Setup
                </Typography>
              </div>

              <Box className="input-field-container">
                <Typography variant="subtitle2" className="field-label">
                  👤 Your Name
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter your name"
                  value={settings.name}
                  onChange={handleNameChange}
                  size="small"
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                  variant="outlined"
                />
              </Box>

              <Box className="input-field-container">
                <Typography variant="subtitle2" className="field-label">
                  📷 Number of Photos
                </Typography>
                <Box className="number-input-group">
                  <IconButton 
                    onClick={() => handleNumberChange('photoCount', settings.photoCount - 1, 1, 50)}
                    size="small"
                  >
                    <RemoveIcon />
                  </IconButton>
                  <TextField
                    type="number"
                    value={settings.photoCount}
                    onChange={(e) => handleNumberChange('photoCount', e.target.value, 1, 50)}
                    size="small"
                    error={!!formErrors.photoCount}
                    helperText={formErrors.photoCount}
                    InputProps={{
                      inputProps: { min: 1, max: 50 }
                    }}
                  />
                  <IconButton 
                    onClick={() => handleNumberChange('photoCount', settings.photoCount + 1, 1, 50)}
                    size="small"
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              </Box>

              <Box className="input-field-container">
                <Typography variant="subtitle2" className="field-label">
                  ⚡ Capture Speed
                </Typography>
                <Box className="number-input-group">
                  <IconButton 
                    onClick={() => handleSpeedChange('decrement')}
                    size="small"
                    disabled={settings.captureSpeed === 0.5}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <TextField
                    value={getDisplaySpeed(settings.captureSpeed)}
                    disabled
                    size="small"
                    InputProps={{
                      readOnly: true,
                      style: { textAlign: 'center' }
                    }}
                  />
                  <IconButton 
                    onClick={() => handleSpeedChange('increment')}
                    size="small"
                    disabled={settings.captureSpeed >= 5}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
                <Typography variant="caption" color="textSecondary">
                  Click + or - to adjust speed (0.5s to 5s)
                </Typography>
              </Box>

              <Box className="hint-box">
                <Typography variant="body2" color="text.secondary">
                  <strong>💡 Tips:</strong>
                  <ul>
                    <li>Capture Speed (milliseconds) determines how fast photos are taken:
                      <ul>
                        <li>100ms = Very fast capture (10 photos per second)</li>
                        <li>500ms = Medium speed (2 photos per second)</li>
                        <li>1000ms = Slow capture (1 photo per second)</li>
                      </ul>
                    </li>
                    <li>Use arrow buttons or type to adjust values</li>
                    <li>Higher speeds may require better lighting</li>
                  </ul>
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleStartCapture}
                startIcon={<CameraAlt />}
                sx={{ mt: 2 }}
                disabled={!settings.name.trim()}
              >
                LET'S GO!
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showSetup && (
        <>
          <div className="controls">
            <motion.button
              className="capture-btn"
              onClick={startBurst}
              disabled={isCapturing}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <CameraAlt />
              {isCapturing ? 'Capturing...' : 'Start Burst'}
            </motion.button>

            {photos.length > 0 && (
              <motion.button
                className="upload-btn"
                onClick={uploadPhotos}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <CloudUpload />
                Upload Photos
              </motion.button>
            )}
          </div>

          <motion.div className="photo-grid">
            <AnimatePresence>
              {photos.map((photo, index) => (
                <motion.div
                  key={index}
                  className="photo-item"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <img src={photo} alt={`Captured ${index + 1}`} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default PhotoCapture;