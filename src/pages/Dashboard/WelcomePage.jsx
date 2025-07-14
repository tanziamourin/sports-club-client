import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
// import { AuthContext } from '../context/AuthContext';

const WelcomePage = () => {
  const { role } = useContext(AuthContext);

  let welcomeMessage = "Welcome to User Dashboard";
  if (role === 'admin') welcomeMessage = "Welcome to Admin Dashboard";
  else if (role === 'member') welcomeMessage = "Welcome to Member Dashboard";

  return (
    <div>
      <h1 className="mb-6 text-5xl font-bold">{welcomeMessage}</h1>
      
    </div>
  );
};

export default WelcomePage;
