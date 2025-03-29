import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import UserList from './UsersList';
import { AuthProvider } from './components/context/AuthContext';
import { Toaster } from 'sonner';



function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/users" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
          <Route path="/" element={<Navigate replace to="/users" />} />
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Or sessionStorage
  return token ? children : <Navigate to="/login" replace />;
};

export default App;