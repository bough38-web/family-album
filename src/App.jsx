import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Hero from './components/Hero';
import PhotoGrid from './components/PhotoGrid';
import Timeline from './components/Timeline';
import About from './components/About';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import SignUp from './components/SignUp';
import AdminPanel from './components/AdminPanel';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PhotoProvider } from './context/PhotoContext';
import { SettingsProvider } from './context/SettingsContext';
import { ToastProvider } from './context/ToastContext';
import { ContentProvider } from './context/ContentContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // Or a spinner

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const Home = () => {
  return (
    <>
      <Hero />
      <PhotoGrid />
    </>
  );
};
const Gallery = () => <div style={{ paddingTop: '100px', textAlign: 'center' }}><h2>Complete Gallery</h2><p>Coming Soon</p></div>;

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <ToastProvider>
          <ContentProvider>
            <PhotoProvider>
              <Router>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/signup" element={<SignUp />} />

                  <Route path="/" element={
                    <ProtectedRoute>
                      <Layout><Home /></Layout>
                    </ProtectedRoute>
                  } />

                  <Route path="/gallery" element={
                    <ProtectedRoute>
                      <Layout><PhotoGrid /></Layout>
                    </ProtectedRoute>
                  } />

                  <Route path="/timeline" element={
                    <ProtectedRoute>
                      <Layout><Timeline /></Layout>
                    </ProtectedRoute>
                  } />

                  <Route path="/about" element={
                    <ProtectedRoute>
                      <Layout><About /></Layout>
                    </ProtectedRoute>
                  } />

                  <Route path="/admin" element={
                    <ProtectedRoute>
                      <Layout><AdminPanel /></Layout>
                    </ProtectedRoute>
                  } />
                </Routes>
              </Router>
            </PhotoProvider>
          </ContentProvider>
        </ToastProvider>
      </SettingsProvider>
    </AuthProvider >
  );
}

export default App;
