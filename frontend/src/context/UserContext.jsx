import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getCurrentUser } from '../api';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsernameState] = useState(() => 
    localStorage.getItem('bugAssign_username') || ''
  );

  // Restore session from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bugAssign_username');
    if (saved && !currentUser) {
      getCurrentUser(saved)
        .then((user) => setCurrentUser(user))
        .catch(() => localStorage.removeItem('bugAssign_username'));
    }
  }, []);

  const login = useCallback((user) => {
    setCurrentUser(user);
    setUsernameState(user?.username || '');
    if (user?.username) {
      localStorage.setItem('bugAssign_username', user.username);
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setUsernameState('');
    localStorage.removeItem('bugAssign_username');
  }, []);

  const setUsername = useCallback((name) => {
    setUsernameState(name);
    if (name) {
      localStorage.setItem('bugAssign_username', name);
    } else {
      localStorage.removeItem('bugAssign_username');
    }
    setCurrentUser(null); // Clear until we fetch
  }, []);

  const value = {
    currentUser,
    username,
    login,
    logout,
    setUsername,
    isAdmin: currentUser?.role === 'ADMIN',
    isTester: currentUser?.role === 'TESTER',
    isDeveloper: currentUser?.role === 'DEVELOPER',
    canCreateIssue: currentUser?.role === 'ADMIN' || currentUser?.role === 'TESTER',
    canAssignIssue: true, // Admin or tester typically
    canCloseIssue: currentUser?.role === 'ADMIN' || currentUser?.role === 'TESTER',
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
