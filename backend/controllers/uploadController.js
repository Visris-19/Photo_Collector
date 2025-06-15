const drive = require('../config/driveConfig');
const { Readable } = require('stream');
const { convertBase64ToBuffer, generateFileName } = require('../utils/fileHelper');

const uploadPhotos = async (req, res) => {
  try {
    const { photos } = req.body;
    
    // Add request validation
    if (!photos || !Array.isArray(photos)) {
      console.error('Invalid request: photos array missing or invalid');
      return res.status(400).json({
        success: false,
        message: 'Photos must be provided as an array'
      });
    }

    console.log(`Received ${photos.length} photos for upload`);
    const results = [];

    for (const [index, photo] of photos.entries()) {
      try {
        console.log(`Uploading photo ${index + 1}/${photos.length}`);
        
        const buffer = convertBase64ToBuffer(photo);
        const bufferStream = new Readable();
        bufferStream.push(buffer);
        bufferStream.push(null);

        const fileMetadata = {
          name: generateFileName(index),
          parents: [process.env.GOOGLE_DRIVE_FOLDER_ID]
        };

        const media = {
          mimeType: 'image/jpeg',
          body: bufferStream
        };

        const response = await drive.files.create({
          resource: fileMetadata,
          media: media,
          fields: 'id, webViewLink'
        });

        console.log(`Successfully uploaded photo ${index + 1}`);

        results.push({
          index,
          success: true,
          fileId: response.data.id,
          link: response.data.webViewLink
        });

      } catch (error) {
        console.error(`Error uploading photo ${index + 1}:`, error);
        results.push({
          index,
          success: false,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      results
    });

  } catch (error) {
    console.error('Upload controller error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing upload',
      error: error.message
    });
  }
};

module.exports = {
  uploadPhotos
};