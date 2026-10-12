import React from 'react';
import { FaPills, FaHeartbeat, FaFirstAid, FaLeaf } from 'react-icons/fa';

const hotProducts = [
  { 
    id: 1, 
    name: 'Immunity Booster Pack', 
    category: 'Supplements', 
    price: '$25.00', 
    icon: <FaLeaf /> 
  },
  { 
    id: 2, 
    name: 'Daily Multivitamins', 
    category: 'Vitamins', 
    price: '$15.00', 
    icon: <FaPills /> 
  },
  { 
    id: 3, 
    name: 'Premium First Aid Kit', 
    category: 'Essentials', 
    price: '$35.00', 
    icon: <FaFirstAid /> 
  },
  { 
    id: 4, 
    name: 'Heart Health Monitor', 
    category: 'Devices', 
    price: '$45.00', 
    icon: <FaHeartbeat /> 
  },
];

const HotProducts = () => {
  return (
    <section id="hot-products" className="bg-white">
      <div className="container">
        <h2 className="section-title">Hot Products</h2>
        <p className="section-subtitle">Our best-selling health essentials this month.</p>
        
        <div className="card-grid">
          {hotProducts.map((product) => (
            <div key={product.id} className="hot-product-card">
              <div className="product-img-placeholder">
                {product.icon}
              </div>
              <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-title">{product.name}</h3>
                <p style={{color: '#666', fontSize: '0.9rem'}}>High quality, trusted brand.</p>
                <span className="product-price">{product.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HotProducts;