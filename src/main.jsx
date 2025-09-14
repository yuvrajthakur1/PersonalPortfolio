import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import ChatBot from './pages/ChatBot.jsx'
import Patntry from './pages/Pantry.jsx'
import Color from './pages/Color.jsx'

const router = createBrowserRouter([
      {
        path:"/",
        element:<App/>
      }, {
        path:"/chatbot",
        element:<ChatBot/>
      }
      , {
        path:"/pantry",
        element:<Patntry/>
      }
      , {
        path:"/color",
        element:<Color/>
      }
])




createRoot(document.getElementById('root')).render(
  <StrictMode>
       <RouterProvider router={router} />
  </StrictMode>,
)
