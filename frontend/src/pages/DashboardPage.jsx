import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getIssues, getAllUsers } from '../api';
import { useUser } from '../context/UserContext';
import { IssueStatus } from '../api';
import './DashboardPage.css';

export default function DashboardPage() {
  const { username, currentUser, logout, canCreateIssue } = useUser();
  const [issues, setIssues] = useState({ content: [], totalElements: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    assignedToId: '',
    createdBy: '',
    page: 0,
    size: 10,
  });

  useEffect(() => {
    getAllUsers().then(setUsers).catch(() => setUsers([]));
  }, []);

  useEffect(() => {
    getIssues(filters, username)
      .then(setIssues)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [username, filters.status, filters.assignedToId, filters.createdBy, filters.page, filters.size]);

  const handleFilterChange = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value || '', page: 0 }));
  };

  if (!username) {
    return (
      <div className="dashboard">
        <p>Please <Link to="/login">log in</Link> to view issues.</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Issue Tracker</h1>
          <p className="user-info">
            Logged in as <strong>{username}</strong> ({currentUser?.role || '—'})
          </p>
        </div>
        <div className="header-actions">
          {canCreateIssue && (
            <Link to="/issues/new" className="btn btn-primary">+ New Issue</Link>
          )}
          <Link to="/users" className="btn btn-secondary">Users</Link>
          <button onClick={logout} className="btn btn-ghost">Logout</button>
        </div>
      </header>

      <div className="filters">
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">All statuses</option>
          {Object.values(IssueStatus).map((s) => (
            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
          ))}
        </select>
        <select
          value={filters.assignedToId}
          onChange={(e) => handleFilterChange('assignedToId', e.target.value || '')}
        >
          <option value="">All assigned</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.username} ({u.role})</option>
          ))}
        </select>
        <select
          value={filters.createdBy}
          onChange={(e) => handleFilterChange('createdBy', e.target.value || '')}
        >
          <option value="">All creators</option>
          {users.map((u) => (
            <option key={u.id} value={u.username}>{u.username}</option>
          ))}
        </select>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <p className="loading">Loading issues...</p>
      ) : (
        <>
          <div className="issues-table-wrap">
            <table className="issues-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Created By</th>
                  <th>Assigned To</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {issues.content?.map((issue) => (
                  <tr key={issue.id}>
                    <td>{issue.id}</td>
                    <td>
                      <Link to={`/issues/${issue.id}`} className="issue-link">
                        {issue.title}
                      </Link>
                    </td>
                    <td><span className={`status-badge ${issue.status?.toLowerCase().replace('_', '-')}`}>{issue.status}</span></td>
                    <td><span className="priority-badge">{issue.priority}</span></td>
                    <td>{issue.createdBy?.username || '—'}</td>
                    <td>{issue.assignedTo?.username || '—'}</td>
                    <td>
                      <Link to={`/issues/${issue.id}`} className="link">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(!issues.content || issues.content.length === 0) && (
            <p className="empty">No issues found.</p>
          )}
          {issues.totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={filters.page === 0}
                onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
              >
                Previous
              </button>
              <span>Page {filters.page + 1} of {issues.totalPages}</span>
              <button
                disabled={filters.page >= issues.totalPages - 1}
                onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
