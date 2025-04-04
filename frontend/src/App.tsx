import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProfileDemo from './pages/ProfileDemo';
import styled from 'styled-components';

const NavBar = styled.nav`
  background: #fff;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const NavLink = styled(Link)`
  color: #333;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    color: #666;
  }
`;

const App = () => {
  return (
    <Router>
      <NavBar>
        <NavLink to="/profile-demo">View Profile Demo</NavLink>
      </NavBar>
      <Routes>
        <Route path="/profile-demo" element={<ProfileDemo />} />
        <Route path="/" element={<ProfileDemo />} />
      </Routes>
    </Router>
  );
};

export default App;
