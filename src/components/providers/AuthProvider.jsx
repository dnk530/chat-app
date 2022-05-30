import React, { useState, useMemo } from 'react';
import { AuthContext } from '../../contexts/index.js';

export default function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);

  const logIn = (loggedInUsername) => {
    setLoggedIn(true);
    setUsername(loggedInUsername);
  };
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
    setUsername(null);
  };

  const value = useMemo(() => ({
    loggedIn,
    logIn,
    logOut,
    username,
  }), [loggedIn, username]);

  try {
    const userId = JSON.parse(localStorage.getItem('userId'));
    if (!loggedIn && userId.token) {
      logIn(userId.username);
    }
  } catch (e) {}

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
