import React, { useState } from 'react';
import { seedFirestore } from '../../firebase/seedData';

const DataSeeder = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedStatus, setSeedStatus] = useState('');

  const handleSeedData = async () => {
    setIsSeeding(true);
    setSeedStatus('Starting data seeding...');

    try {
      await seedFirestore();
      setSeedStatus('✅ Data seeded successfully!');
    } catch (error) {
      setSeedStatus(`❌ Error seeding data: ${error.message}`);
      console.error('Seeding error:', error);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '20px', 
      right: '20px', 
      background: 'white', 
      padding: '20px', 
      border: '2px solid #ccc', 
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Firebase Data Seeder</h3>
      <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#666' }}>
        Click to populate Firestore with initial data
      </p>
      
      <button 
        onClick={handleSeedData}
        disabled={isSeeding}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: isSeeding ? '#ccc' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isSeeding ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        {isSeeding ? 'Seeding...' : 'Seed Firestore Data'}
      </button>
      
      {seedStatus && (
        <div style={{ 
          marginTop: '10px', 
          padding: '8px', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '4px',
          fontSize: '12px',
          wordBreak: 'break-word'
        }}>
          {seedStatus}
        </div>
      )}
      
      <div style={{ 
        marginTop: '10px', 
        fontSize: '11px', 
        color: '#999',
        fontStyle: 'italic'
      }}>
        Note: Only run this once to avoid duplicates
      </div>
    </div>
  );
};

export default DataSeeder;