const API_BASE = '/api';

function getHeaders(username) {
  const headers = { 'Content-Type': 'application/json' };
  if (username) {
    headers['X-Username'] = username;
  }
  return headers;
}

async function handleResponse(res) {
  const text = await res.text();
  if (!res.ok) {
    try {
      const err = JSON.parse(text);
      throw new Error(err.message || err.error || text || res.statusText);
    } catch (e) {
      if (e instanceof SyntaxError) throw new Error(text || res.statusText);
      throw e;
    }
  }
  return text ? JSON.parse(text) : null;
}

export async function getCurrentUser(username) {
  const res = await fetch(`${API_BASE}/users/me`, { headers: getHeaders(username) });
  const data = await handleResponse(res);
  return data;
}

export async function getAllUsers() {
  const res = await fetch(`${API_BASE}/users`);
  return handleResponse(res);
}

export async function createUser(userData) {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });
  return handleResponse(res);
}

export async function getIssues(params = {}, username) {
  const searchParams = new URLSearchParams();
  if (params.status) searchParams.set('status', params.status);
  if (params.assignedToId) searchParams.set('assignedToId', params.assignedToId);
  if (params.createdBy) searchParams.set('createdBy', params.createdBy);
  if (params.page != null) searchParams.set('page', params.page);
  if (params.size != null) searchParams.set('size', params.size);
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
  const query = searchParams.toString();
  const url = `${API_BASE}/issues${query ? '?' + query : ''}`;
  const res = await fetch(url, { headers: getHeaders(username) });
  return handleResponse(res);
}

export async function getIssueById(id, username) {
  const res = await fetch(`${API_BASE}/issues/${id}`, { headers: getHeaders(username) });
  return handleResponse(res);
}

export async function createIssue(issueData, username) {
  const res = await fetch(`${API_BASE}/issues`, {
    method: 'POST',
    headers: getHeaders(username),
    body: JSON.stringify(issueData),
  });
  return handleResponse(res);
}

export async function assignIssue(issueId, developerId, username) {
  const res = await fetch(`${API_BASE}/issues/${issueId}/assign`, {
    method: 'PUT',
    headers: getHeaders(username),
    body: JSON.stringify({ developerId }),
  });
  return handleResponse(res);
}

export async function updateIssueStatus(issueId, newStatus, username) {
  const res = await fetch(`${API_BASE}/issues/${issueId}/status`, {
    method: 'PUT',
    headers: getHeaders(username),
    body: JSON.stringify({ newStatus }),
  });
  return handleResponse(res);
}

// Enums matching backend
export const IssueStatus = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  PENDING_VERIFICATION: 'PENDING_VERIFICATION',
  RESOLVED: 'RESOLVED',
  REOPENED: 'REOPENED',
  CLOSED: 'CLOSED',
};

export const Priority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
};

export const Role = {
  ADMIN: 'ADMIN',
  DEVELOPER: 'DEVELOPER',
  TESTER: 'TESTER',
};
