import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import IssueDetailPage from './pages/IssueDetailPage';
import CreateIssuePage from './pages/CreateIssuePage';
import UsersPage from './pages/UsersPage';
import './App.css';

function RequireAuth({ children }) {
  const username = localStorage.getItem('bugAssign_username');
  if (!username) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <div className="app">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <RequireAuth>
                  <DashboardPage />
                </RequireAuth>
              }
            />
            <Route
              path="/issues/new"
              element={
                <RequireAuth>
                  <CreateIssuePage />
                </RequireAuth>
              }
            />
            <Route
              path="/issues/:id"
              element={
                <RequireAuth>
                  <IssueDetailPage />
                </RequireAuth>
              }
            />
            <Route
              path="/users"
              element={
                <RequireAuth>
                  <UsersPage />
                </RequireAuth>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}
