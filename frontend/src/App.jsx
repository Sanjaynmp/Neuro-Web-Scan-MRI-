import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ScanPage from './pages/ScanPage';

import Patients from './pages/Patients';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="flex items-center justify-center h-screen bg-dark-bg text-neuro-400">Loading NeuroScan...</div>;
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={
                <ProtectedRoute>
                    <Layout />
                </ProtectedRoute>
            }>
                <Route index element={<Dashboard />} />
                <Route path="scan" element={<ScanPage />} />
                <Route path="patients" element={<Patients />} />
            </Route>
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
