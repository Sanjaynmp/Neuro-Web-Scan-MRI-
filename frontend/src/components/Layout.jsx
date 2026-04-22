import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="flex min-h-screen bg-dark-bg text-gray-100 font-sans">
            <Sidebar />
            <main className="flex-1 ml-64 bg-dark-bg relative overflow-hidden">
                {/* Global Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                    <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-neuro-900/10 rounded-full blur-[120px]"></div>
                    <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-blue-900/10 rounded-full blur-[100px]"></div>
                </div>

                <div className="relative z-10">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
