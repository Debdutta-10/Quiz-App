import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes, useLocation } from 'react-router-dom';
import Quiz1 from './components/Quiz1';
import './App.css';

const App = () => {
  const location = useLocation();

  return (
    <div>
      {/* Conditionally render the button if the current path is not '/quiz1' */}
      {location.pathname !== '/quiz1' && (
        <Link to="/quiz1" style={{ textDecoration: 'none' }}>
          <div style={{marginTop:"10%",fontSize: '30px',color:"white",textAlign:"center"}}>Select the Course</div>
          <div 
            style={{
              padding: '10px',
              backgroundColor: '#111827', // Corrected hex color code
              color: 'white',
              border: '2px solid white',
              fontSize: '30px',
              paddingBlock: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              borderRadius: '5px',
              width: '300px',
              margin: '20px auto'
            }}
          >
            Psychology of Learning
          </div>
        </Link>
      )}
      <Routes>
        <Route path="/quiz1" element={<Quiz1 />} />
      </Routes>
    </div>
  );
}

const RootApp = () => (
  <Router>
    <App />
  </Router>
);

export default RootApp;
