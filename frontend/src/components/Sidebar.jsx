import { Link, useLocation } from 'react-router-dom';
import { Brain, LayoutDashboard, ScanLine, Users, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { pathname } = useLocation();
    const { logout } = useAuth();

    const links = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'New Scan', path: '/scan', icon: ScanLine },
        { name: 'Patients', path: '/patients', icon: Users },
    ];

    return (
        <div className="h-screen w-64 bg-neuro-950 border-r border-neuro-800 flex flex-col p-4 fixed left-0 top-0">
            <div className="flex items-center gap-3 px-4 py-6 mb-8">
                <div className="p-2 bg-neuro-500 rounded-lg shadow-lg shadow-neuro-500/20">
                    <Brain className="w-8 h-8 text-black" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-neuro-200 to-neuro-400 bg-clip-text text-transparent">
                    NeuroScan
                </h1>
            </div>

            <nav className="flex-1 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                                    ? 'bg-neuro-900/50 text-neuro-300 border border-neuro-800 shadow-neuro-glow'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-neuro-400' : ''}`} />
                            <span className="font-medium">{link.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <button
                onClick={logout}
                className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 transition-colors mt-auto"
            >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
            </button>
        </div>
    );
};

export default Sidebar;
