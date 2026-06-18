import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App'
import './styles/global.css'
import { ShopProvider } from './context/ShopContext'

const clerkPubKey =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <ShopProvider>
        <App />
      </ShopProvider>
    </ClerkProvider>
  </StrictMode>,
)