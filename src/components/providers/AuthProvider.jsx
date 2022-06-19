import React, { useState, useMemo } from 'react';
import { AuthContext } from '../../contexts/index.js';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const logIn = ({ token, username }) => {
    localStorage.setItem('userId', JSON.stringify({ token, username }));
    setUser({ token, username });
  };

  const logOut = () => {
    localStorage.removeItem('userId');
    setUser(null);
  };

  const value = useMemo(() => ({
    logIn,
    logOut,
    user,
  }), [user]);

  const userId = JSON.parse(localStorage.getItem('userId'));
  if (!user && userId) {
    logIn(userId);
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
