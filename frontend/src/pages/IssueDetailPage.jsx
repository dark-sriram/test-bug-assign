import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getIssueById, updateIssueStatus, assignIssue, getAllUsers } from '../api';
import { useUser } from '../context/UserContext';
import { IssueStatus, Priority } from '../api';
import './IssueDetailPage.css';

export default function IssueDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { username, currentUser, canCreateIssue, canCloseIssue } = useUser();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assignDeveloperId, setAssignDeveloperId] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!username) return;
    Promise.all([
      getIssueById(id, username),
      getAllUsers().then(setUsers).catch(() => setUsers([])),
    ])
      .then(([issueData]) => setIssue(issueData))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, username]);

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!assignDeveloperId) return;
    setError('');
    try {
      const updated = await assignIssue(id, Number(assignDeveloperId), username);
      setIssue(updated);
      setAssignDeveloperId('');
    } catch (err) {
      setError(err.message || 'Failed to assign');
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!newStatus) return;
    setError('');
    try {
      const updated = await updateIssueStatus(id, newStatus, username);
      setIssue(updated);
      setNewStatus('');
    } catch (err) {
      setError(err.message || 'Failed to update status');
    }
  };

  if (!username) {
    return (
      <div className="issue-detail">
        <p>Please <Link to="/login">log in</Link> to view this issue.</p>
      </div>
    );
  }

  if (loading) return <div className="issue-detail loading">Loading...</div>;

  if (!issue) return <div className="issue-detail">Issue not found.</div>;

  const developers = users.filter((u) => u.role === 'DEVELOPER');
  const allowedTransitions = getTransitions(issue.status);

  return (
    <div className="issue-detail">
      <div className="issue-header">
        <Link to="/" className="back-link">← Back to list</Link>
        <h1>{issue.title}</h1>
        <div className="meta">
          <span className={`status-badge ${issue.status?.toLowerCase().replace('_', '-')}`}>
            {issue.status}
          </span>
          <span className="priority-badge">{issue.priority}</span>
          <span className="id">#{issue.id}</span>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="issue-body">
        <section>
          <h3>Description</h3>
          <p>{issue.description}</p>
        </section>
        <section>
          <h3>Details</h3>
          <dl className="details">
            <dt>Created by</dt>
            <dd>{issue.createdBy?.username || '—'}</dd>
            <dt>Assigned to</dt>
            <dd>{issue.assignedTo?.username || '—'}</dd>
            <dt>Created at</dt>
            <dd>{issue.createdAt ? new Date(issue.createdAt).toLocaleString() : '—'}</dd>
            <dt>Updated at</dt>
            <dd>{issue.updatedAt ? new Date(issue.updatedAt).toLocaleString() : '—'}</dd>
          </dl>
        </section>

        {issue.status !== 'CLOSED' && (
          <>
            <section>
              <h3>Assign to Developer</h3>
              <form onSubmit={handleAssign} className="form-inline">
                <select
                  value={assignDeveloperId}
                  onChange={(e) => setAssignDeveloperId(e.target.value)}
                >
                  <option value="">Select developer</option>
                  {developers.map((d) => (
                    <option key={d.id} value={d.id}>{d.username}</option>
                  ))}
                </select>
                <button type="submit" className="btn btn-primary" disabled={!assignDeveloperId}>
                  Assign
                </button>
              </form>
            </section>
            {allowedTransitions.length > 0 && (
              <section>
                <h3>Update Status</h3>
                <form onSubmit={handleStatusUpdate} className="form-inline">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="">Select new status</option>
                    {allowedTransitions.map((s) => (
                      <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                  <button type="submit" className="btn btn-primary" disabled={!newStatus}>
                    Update
                  </button>
                </form>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function getTransitions(status) {
  const map = {
    OPEN: ['IN_PROGRESS'],
    IN_PROGRESS: ['PENDING_VERIFICATION'],
    PENDING_VERIFICATION: ['RESOLVED', 'IN_PROGRESS'],
    RESOLVED: ['CLOSED', 'REOPENED'],
    REOPENED: ['IN_PROGRESS'],
    CLOSED: [],
  };
  return map[status] || [];
}
