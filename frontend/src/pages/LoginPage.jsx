import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, getCurrentUser } from '../api';
import { useUser } from '../context/UserContext';
import './LoginPage.css';

export default function LoginPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { username, login } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectUser = async (selectedUser) => {
    setError('');
    try {
      const user = await getCurrentUser(selectedUser.username);
      login(user);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to login');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Bug Tracker</h1>
        <p className="subtitle">Select your account to continue</p>
        
        {error && <div className="error-banner">{error}</div>}
        
        {loading ? (
          <p className="loading">Loading users...</p>
        ) : (
          <div className="user-list">
            {users.map((user) => (
              <button
                key={user.id}
                className={`user-btn ${username === user.username ? 'selected' : ''}`}
                onClick={() => handleSelectUser(user)}
              >
                <span className="user-name">{user.username}</span>
                <span className="user-role badge">{user.role}</span>
              </button>
            ))}
            {users.length === 0 && (
              <p className="empty">No users found. Start the backend to load seed data.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
