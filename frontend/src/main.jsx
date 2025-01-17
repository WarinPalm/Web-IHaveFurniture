import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


import './CSS/header.css';
import './CSS/hero-image.css';
import './CSS/style.css';
import './CSS/footer.css';
import './CSS/Login.css'
import './CSS/adminstyle.css'

import App from './App.jsx';
import Footer from "./components/Footer.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <div className="app-container">
        <div className="main-content">
          <App/>
        </div>
        <Footer />
      </div>
  </StrictMode>,
);


