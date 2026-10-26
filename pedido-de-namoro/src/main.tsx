import '@fontsource/pacifico/400.css'
import '@fontsource/quicksand/500.css'
import '@fontsource/quicksand/600.css'
import '@fontsource/quicksand/700.css'
import '@fontsource/great-vibes/400.css'
import '@fontsource/dancing-script/500.css'
import '@fontsource/parisienne/400.css'
import '@fontsource/caveat/500.css'
import '@fontsource/playfair-display/500-italic.css'
import { MotionConfig } from 'framer-motion'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </StrictMode>,
)
