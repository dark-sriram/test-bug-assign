import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers, createUser } from '../api';
import { useUser } from '../context/UserContext';
import { Role } from '../api';
import './UsersPage.css';

export default function UsersPage() {
  const { username } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newRole, setNewRole] = useState(Role.DEVELOPER);

  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newUsername.trim()) return;
    setError('');
    try {
      const user = await createUser({ username: newUsername.trim(), role: newRole });
      setUsers((prev) => [...prev, user]);
      setNewUsername('');
      setNewRole(Role.DEVELOPER);
      setShowForm(false);
    } catch (err) {
      setError(err.message || 'Failed to create user');
    }
  };

  if (!username) {
    return (
      <div className="users-page">
        <p>Please <Link to="/login">log in</Link> to view users.</p>
      </div>
    );
  }

  return (
    <div className="users-page">
      <div className="page-header">
        <Link to="/" className="back-link">← Back to issues</Link>
        <h1>Users</h1>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="users-actions">
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Create User'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="create-user-form">
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
            {Object.values(Role).map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <button type="submit" className="btn btn-primary">Create</button>
        </form>
      )}

      {loading ? (
        <p className="loading">Loading users...</p>
      ) : (
        <div className="users-table-wrap">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td><span className="role-badge">{user.role}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
