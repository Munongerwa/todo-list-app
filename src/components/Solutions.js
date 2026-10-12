import React from 'react';
import { FaTruck, FaUserMd, FaClipboardList } from 'react-icons/fa';
import '../App.css';

const solutions = [
  { title: 'Home Delivery', icon: <FaTruck />, desc: 'Fast and secure delivery of your medications to your doorstep.' },
  { title: 'Health Consultations', icon: <FaUserMd />, desc: 'Speak with our pharmacists for advice on medication and health.' },
  { title: 'Medication Management', icon: <FaClipboardList />, desc: 'We help organize your prescriptions for easy adherence.' },
];

const Solutions = () => {
  const sectionStyle = {
    background: '#fff',
    padding: '80px 0'
  };

  const itemStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '30px',
    background: '#f8f9fa',
    padding: '20px',
    borderRadius: '10px'
  };

  return (
    <section id="solutions" style={sectionStyle}>
      <div className="container">
        <h2 className="section-title">Our Solutions & Services</h2>
        <p className="section-subtitle">More than just a pharmacy, we are your health partners.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {solutions.map((sol, index) => (
            <div key={index} style={itemStyle}>
              <div style={{ fontSize: '2rem', color: '#5D2E8C', marginRight: '20px', marginTop: '5px' }}>{sol.icon}</div>
              <div>
                <h3 style={{ color: '#333', marginBottom: '10px' }}>{sol.title}</h3>
                <p style={{ color: '#666' }}>{sol.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Solutions;