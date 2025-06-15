# 📸 Photo Collector

A modern MERN stack application for capturing burst photos with a professional camera-like interface.

## ✨ Features

- 📷 Real-time photo capture with device camera
- 🚀 Adjustable burst speed (0.5s to 5s intervals)
- 🔢 Customizable photo count
- 💫 Professional camera interface with focus frame
- 🎨 Modern UI with Material Design
- 🖼️ Image processing and storage
- 📱 Responsive design for all devices

## 🛠️ Tech Stack

- **Frontend:**
  - React with Vite
  - Material-UI
  - Framer Motion
  - Axios

- **Backend:**
  - Node.js
  - Express
  - MongoDB
  - Multer

## 📦 Installation

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/photo-collector.git
cd photo-collector
```

2. **Set up environment variables:**

For Backend:
```bash
cd backend
cp .env.example .env
```
Update `.env` with your MongoDB URI:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

For Frontend:
```bash
cd frontend
cp .env.example .env
```
Update `.env` with your API URL:
```
VITE_API_URL=http://localhost:5000/api
```

3. **Install dependencies:**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd frontend
npm install
```

## 🚀 Running the Application

1. **Start the backend server:**
```bash
cd backend
npm start
```

2. **Start the frontend development server:**
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## 💻 Usage

1. Allow camera access when prompted
2. Enter your name in the setup form
3. Adjust burst settings:
   - Number of photos (1-50)
   - Capture speed (0.5s-5s)
4. Click "LET'S GO!" to start
5. Use the camera shutter button to begin burst capture
6. View and download your captured photos

## 🌐 Deployment

### Vercel Deployment:
```bash
# Deploy backend
cd backend
vercel

# Deploy frontend
cd frontend
vercel
```

### Netlify Deployment:
```bash
# Deploy backend
cd backend
netlify deploy

# Deploy frontend
cd frontend
netlify deploy --prod
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 👨‍💻 Author

Your Name
- GitHub: [Visris-19](https://github.com/yourusername)
- LinkedIn: [Vishal Pandey](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- Material-UI for the component library
- Framer Motion for animations
- The MERN stack community

---

Made with ❤️ and ☕