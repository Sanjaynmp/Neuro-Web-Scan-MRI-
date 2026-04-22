import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Setup Axios defaults
    axios.defaults.baseURL = 'http://localhost:8000';
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    useEffect(() => {
        if (token) {
            axios.get('/auth/me')
                .then(res => setUser(res.data))
                .catch(() => logout())
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (username, password) => {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        try {
            const res = await axios.post('/auth/token', formData);
            const newToken = res.data.access_token;
            setToken(newToken);
            localStorage.setItem('token', newToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

            // Fetch user details immediately
            const userRes = await axios.get('/auth/me');
            setUser(userRes.data);
            return true;
        } catch (e) {
            console.error("Login failed", e);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    };

    const register = async (username, password) => {
        try {
            await axios.post('/auth/register', { username, password_hash: password });
            return true;
        } catch (e) {
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
