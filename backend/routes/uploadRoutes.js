const express = require('express');
const { uploadPhotos } = require('../controllers/uploadController');

const router = express.Router();

router.post('/upload', uploadPhotos);

module.exports = router;