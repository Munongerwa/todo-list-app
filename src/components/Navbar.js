import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container nav-content">
        <a href="#home" className="logo-container">
          {/* Make sure logo.png is in the public folder */}
          <img src="/logo.jpeg" alt="H+ Logo" style={{ height: '50px' }} />
          <div className="logo-text">H<span>+</span> Pharmacy</div>
        </a>
        
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#products">Products</a></li>
          <li><a href="#hot-products">Featured</a></li>
          <li><a href="#solutions">Services</a></li>
          <li><a href="#contact" className="btn btn-primary" style={{ padding: '8px 20px' }}>Contact Us</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;