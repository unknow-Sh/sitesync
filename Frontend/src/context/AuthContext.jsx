import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const MOCK_USERS = {
  'owner@sitesync.in': {
    id: 'u1', name: 'Rajesh Kumar', email: 'owner@sitesync.in',
    role: 'owner', company: 'Kumar Constructions', avatar: 'RK', password: 'demo123'
  },
  'contractor@sitesync.in': {
    id: 'u2', name: 'Suresh Patel', email: 'contractor@sitesync.in',
    role: 'contractor', company: 'Patel Builders', avatar: 'SP', password: 'demo123'
  },
  'supervisor@sitesync.in': {
    id: 'u3', name: 'Mohan Singh', email: 'supervisor@sitesync.in',
    role: 'supervisor', company: 'Kumar Constructions', avatar: 'MS', password: 'demo123'
  },
  'investor@sitesync.in': {
    id: 'u4', name: 'Anita Shah', email: 'investor@sitesync.in',
    role: 'investor', company: 'Shah Investments', avatar: 'AS', password: 'demo123'
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('sitesync_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const found = MOCK_USERS[email.toLowerCase()];
    if (!found || found.password !== password) {
      throw new Error('Invalid email or password');
    }
    const { password: _pw, ...safeUser } = found;
    setUser(safeUser);
    localStorage.setItem('sitesync_user', JSON.stringify(safeUser));
    return safeUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sitesync_user');
  };

  const hasRole = (...roles) => user && roles.includes(user.role);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
