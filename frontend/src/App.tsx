import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Dashboard } from './components/Dashboard/Dashboard';
import { PublicReslinkPage } from './pages/PublicReslinkPage';
import { CreateReslinkFlow } from './components/Dashboard/CreateReslinkFlow';
import { Teleprompter } from './components/Teleprompter/Teleprompter';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public route for reslink pages */}
            <Route path="/reslink/:slug" element={<PublicReslinkPage />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/create-reslink/*" element={
              <ProtectedRoute>
                <CreateReslinkFlow />
              </ProtectedRoute>
            } />
            
            {/* Default redirect to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Catch all - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
