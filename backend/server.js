const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const uploadRouter = require('./routes/uploadRoutes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Routes
app.use('/api', uploadRouter);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});