import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
        margin: 0,
        padding: 0,
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '400px',
          width: '90%',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏱️</div>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#2c3e50',
            marginBottom: '16px',
            margin: '0 0 16px 0',
          }}
        >
          FastTracker
        </h1>
        <p
          style={{
            fontSize: '18px',
            color: '#7f8c8d',
            marginBottom: '24px',
            margin: '0 0 24px 0',
          }}
        >
          Aralıklı Oruç Takip Uygulaması
        </p>
        <div
          style={{
            fontSize: '16px',
            color: '#27ae60',
            fontWeight: '600',
            padding: '12px 20px',
            background: '#d5edda',
            borderRadius: '8px',
            border: '1px solid #c3e6cb',
          }}
        >
          ✅ React Uygulaması Çalışıyor! 🎉
        </div>
      </div>
    </div>
  );
};

// DOM yüklenince başlat
document.addEventListener('DOMContentLoaded', () => {
  const container =
    document.getElementById('root') || document.createElement('div');
  if (!document.getElementById('root')) {
    container.id = 'root';
    document.body.appendChild(container);
  }

  // Global stil ayarları
  document.body.style.margin = '0';
  document.body.style.padding = '0';

  const root = ReactDOM.createRoot(container);
  root.render(<App />);
});

export default App;
