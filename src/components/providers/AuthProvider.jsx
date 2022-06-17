import React, { useState, useMemo } from 'react';
import { AuthContext } from '../../contexts/index.js';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState({ loggedIn: false });

  const logIn = ({ token, username }) => {
    localStorage.setItem('userId', JSON.stringify({ token, username }));
    setUser({ token, username, loggedIn: true });
  };

  const logOut = () => {
    localStorage.removeItem('userId');
    setUser({ loggedIn: false });
  };

  const value = useMemo(() => ({
    logIn,
    logOut,
    user,
  }), [user]);

  try {
    const userId = JSON.parse(localStorage.getItem('userId'));
    if (!user.loggedIn && userId.token) {
      logIn(userId);
    }
  } catch (e) {
    console.log('no token');
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
