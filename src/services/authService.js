import { getItem, setItem } from './localStorage';

export const login = (email, password) => {
  const users = getItem('users', []);
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    setItem('currentUser', user);
    return user;
  }
  throw new Error('Invalid email or password');
};

export const register = (userData) => {
  const users = getItem('users', []);
  if (users.find(u => u.email === userData.email)) {
    throw new Error('Email already registered');
  }
  
  const newUser = {
    id: `USR-${Date.now()}`,
    ...userData,
    role: 'citizen',
    reliabilityScore: 100,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  setItem('users', users);
  
  return newUser;
};

export const getCurrentUser = () => {
  return getItem('currentUser', null);
};

export const logout = () => {
  localStorage.removeItem('currentUser');
};

export const getUsers = () => {
  return getItem('users', []);
};
