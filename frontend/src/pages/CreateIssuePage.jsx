import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createIssue } from '../api';
import { useUser } from '../context/UserContext';
import { Priority } from '../api';
import './CreateIssuePage.css';

export default function CreateIssuePage() {
  const navigate = useNavigate();
  const { username, canCreateIssue } = useUser();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(Priority.MEDIUM);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.');
      return;
    }
    if (description.length < 10) {
      setError('Description must be at least 10 characters.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const issue = await createIssue({ title, description, priority }, username);
      navigate(`/issues/${issue.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create issue');
    } finally {
      setLoading(false);
    }
  };

  if (!username) {
    return (
      <div className="create-issue">
        <p>Please <Link to="/login">log in</Link> to create issues.</p>
      </div>
    );
  }

  if (!canCreateIssue) {
    return (
      <div className="create-issue">
        <p>Only TESTER or ADMIN can create issues. Your role does not allow this.</p>
        <Link to="/">Back to dashboard</Link>
      </div>
    );
  }

  return (
    <div className="create-issue">
      <Link to="/" className="back-link">← Back to list</Link>
      <h1>Create New Issue</h1>

      {error && <div className="error-banner">{error}</div>}

      <form onSubmit={handleSubmit} className="create-form">
        <label>
          <span>Title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief issue title"
            maxLength={255}
            required
          />
        </label>
        <label>
          <span>Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue (min 10 characters)"
            rows={5}
            minLength={10}
            required
          />
        </label>
        <label>
          <span>Priority</span>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            {Object.values(Priority).map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Issue'}
          </button>
          <Link to="/" className="btn btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
