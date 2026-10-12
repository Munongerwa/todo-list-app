import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Products from './components/Products'; // Keep your existing Products component
import HotProducts from './components/HotProducts'; // New Component
import Solutions from './components/Solutions';
import Contact from './components/Contact';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <Products /> 
      <HotProducts /> {/* Added here */}
      <Solutions />
      <Contact />
      
      <footer>
        <div className="container">
          <p>&copy; 2026 H+ Pharmacy. All Rights Reserved. | Health | Care | Trust</p>
        </div>
      </footer>
    </div>
  );
}

export default App;