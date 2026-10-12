import React from 'react';

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="container hero-content">
        <div className="hero-text">
          <h1>Health | Care | Trust</h1>
          <p>Welcome to H+ Pharmacy. We provide comprehensive pharmaceutical care and a wide range of health products to keep you and your family healthy.</p>
          <div className="hero-buttons">
            <a href="#products" className="btn btn-primary">View Products</a>
            <a href="#solutions" className="btn btn-outline">Our Services</a>
          </div>
        </div>
        <div className="hero-image-container">
          {/* Make sure hero-image.jpg is in the public folder */}
          <img src="/homeimage.png" alt="Pharmacist helping customer" className="hero-image" />
        </div>
      </div>
    </section>
  );
};

export default Hero;