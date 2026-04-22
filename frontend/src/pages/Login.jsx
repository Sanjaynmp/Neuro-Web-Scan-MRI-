import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Brain, Lock, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true); // Toggle Login/Register
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (isLogin) {
            const success = await login(username, password);
            if (success) navigate('/');
            else setError('Invalid credentials');
        } else {
            const success = await register(username, password);
            if (success) {
                setIsLogin(true); // Switch to login after registration
                alert("Registration successful! Please login.");
            } else {
                setError('Registration failed. Username might be taken.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neuro-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-8 rounded-2xl w-full max-w-md z-10 border-neuro-800"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-neuro-500/20 rounded-full mb-4">
                        <Brain className="w-10 h-10 text-neuro-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                        {isLogin ? 'Welcome Back' : 'Join NeuroScan'}
                    </h2>
                    <p className="text-gray-400 text-center">
                        {isLogin ? 'Access the advanced diagnostic portal' : 'Create your professional account'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-dark-card border border-dark-border rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-neuro-500 focus:ring-1 focus:ring-neuro-500 transition-all"
                                required
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-dark-card border border-dark-border rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-neuro-500 focus:ring-1 focus:ring-neuro-500 transition-all"
                                required
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-neuro-600 hover:bg-neuro-500 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group"
                    >
                        {isLogin ? 'Sign In' : 'Create Account'}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-gray-400 hover:text-neuro-400 text-sm transition-colors"
                    >
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
