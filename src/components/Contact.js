import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import '../App.css';

const Contact = () => {
  const formStyle = {
    background: 'white',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 5px 20px rgba(0,0,0,0.05)'
  };

  const inputStyle = {
    width: '100%',
    padding: '15px',
    marginBottom: '20px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem'
  };

  return (
    <section id="contact" style={{ padding: '80px 0', background: '#f8f9fa' }}>
      <div className="container">
        <h2 className="section-title">Contact Us</h2>
        <p className="section-subtitle">Have questions? Reach out to our team.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px' }}>
          {/* Contact Info */}
          <div>
            <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center' }}>
              <FaMapMarkerAlt style={{ color: '#4CAF50', fontSize: '1.5rem', marginRight: '15px' }} />
              <div>
                <h4 style={{ color: '#5D2E8C' }}>Visit Us</h4>
                <p>123 Health Avenue, Medical District</p>
              </div>
            </div>
            <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center' }}>
              <FaPhone style={{ color: '#4CAF50', fontSize: '1.5rem', marginRight: '15px' }} />
              <div>
                <h4 style={{ color: '#5D2E8C' }}>Call Us</h4>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center' }}>
              <FaEnvelope style={{ color: '#4CAF50', fontSize: '1.5rem', marginRight: '15px' }} />
              <div>
                <h4 style={{ color: '#5D2E8C' }}>Email Us</h4>
                <p>care@hpluspharmacy.com</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form style={formStyle} onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Your Name" style={inputStyle} required />
            <input type="email" placeholder="Your Email" style={inputStyle} required />
            <textarea placeholder="How can we help?" rows="5" style={inputStyle} required></textarea>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;