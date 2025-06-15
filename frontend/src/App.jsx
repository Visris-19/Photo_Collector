import React, { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import PhotoCapture from './components/PhotoCapture'
import WelcomeScreen from './components/WelcomeScreen'
import './styles/App.css'

const App = () => {
  const [showWelcome, setShowWelcome] = useState(true)

  return (
    <div className="App">
      <AnimatePresence>
        {showWelcome ? (
          <WelcomeScreen onStart={() => setShowWelcome(false)} />
        ) : (
          <>
            <main>
              <PhotoCapture />
            </main>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
