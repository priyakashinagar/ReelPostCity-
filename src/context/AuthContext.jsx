import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    // Initialize demo account if doesn't exist
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const demoExists = users.find(u => u.email === 'demo@test.com');
    
    if (!demoExists) {
      const demoUser = {
        id: 1,
        email: 'demo@test.com',
        password: '123456',
        username: 'DemoUser',
        userType: 'free',
        createdAt: new Date().toISOString(),
        profileImg: `https://i.pravatar.cc/150?img=10`,
      };
      users.push(demoUser);
      localStorage.setItem('users', JSON.stringify(users));
    }

    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const register = (email, password, username, userType) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: Date.now(),
      email,
      password, // In real app, use bcrypt!
      username,
      userType, // 'free', 'premium', 'vip'
      createdAt: new Date().toISOString(),
      profileImg: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (!foundUser) {
      throw new Error('Invalid email or password');
    }

    localStorage.setItem('currentUser', JSON.stringify(foundUser));
    setUser(foundUser);
    return foundUser;
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  const upgradeUserType = (newType) => {
    if (!user) return;
    
    const updatedUser = { ...user, userType: newType };
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    }
    
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        register,
        login,
        logout,
        upgradeUserType,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
