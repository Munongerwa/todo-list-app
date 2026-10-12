import React from 'react';
import { FaPills, FaBaby, FaHeartbeat, FaLeaf } from 'react-icons/fa';
import '../App.css';

const products = [
  { title: 'Prescription Medication', icon: <FaPills size={40} />, desc: 'Wide range of prescription drugs managed by licensed pharmacists.' },
  { title: 'Over-The-Counter (OTC)', icon: <FaHeartbeat size={40} />, desc: 'Pain relief, cold & flu, and daily essentials.' },
  { title: 'Vitamins & Supplements', icon: <FaLeaf size={40} />, desc: 'Boost your immunity with our curated selection of vitamins.' },
  { title: 'Baby & Mother Care', icon: <FaBaby size={40} />, desc: 'Gentle products for infants and nursing mothers.' },
];

const Products = () => {
  const cardStyle = {
    background: 'white',
    padding: '40px 20px',
    borderRadius: '15px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
    textAlign: 'center',
    transition: 'transform 0.3s',
    cursor: 'pointer'
  };

  return (
    <section id="products" style={{ padding: '80px 0' }}>
      <div className="container">
        <h2 className="section-title">Our Product Range</h2>
        <p className="section-subtitle">Explore our catalog of health and wellness products.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
          {products.map((prod, index) => (
            <div key={index} style={cardStyle} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ color: '#4CAF50', marginBottom: '20px' }}>{prod.icon}</div>
              <h3 style={{ color: '#5D2E8C', marginBottom: '15px' }}>{prod.title}</h3>
              <p style={{ color: '#666' }}>{prod.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;