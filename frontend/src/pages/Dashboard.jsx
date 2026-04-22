import { LayoutDashboard, Users, Activity, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const stats = [
        { title: 'Total Patients', value: '1,284', icon: Users, color: 'text-blue-400' },
        { title: 'Scans Today', value: '42', icon: Activity, color: 'text-neuro-400' },
        { title: 'Avg. Analysis Time', value: '1.2s', icon: Clock, color: 'text-purple-400' },
    ];

    return (
        <div className="p-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-gray-400">Overview of diagnostic activities</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-panel p-6 rounded-2xl flex items-center gap-4 hover:bg-white/5 transition-colors cursor-pointer group"
                        >
                            <div className={`p-4 rounded-xl bg-gray-800/50 group-hover:bg-gray-800 ${stat.color} transition-colors`}>
                                <Icon className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">{stat.title}</p>
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="glass-panel p-8 rounded-2xl"
            >
                <h2 className="text-xl font-bold text-white mb-6">Recent Scans</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-500 border-b border-gray-800">
                                <th className="pb-4">Patient Name</th>
                                <th className="pb-4">Scan Date</th>
                                <th className="pb-4">Diagnosis</th>
                                <th className="pb-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-300">
                            <tr
                                onClick={() => navigate('/patients')}
                                className="border-b border-gray-800/50 hover:bg-white/5 transition-colors cursor-pointer group"
                            >
                                <td className="py-4 font-semibold text-white group-hover:text-neuro-400 transition-colors">John Doe</td>
                                <td className="py-4">2 hours ago</td>
                                <td className="py-4 text-neuro-400">Meningioma</td>
                                <td className="py-4"><span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs">Verified</span></td>
                            </tr>
                            <tr
                                onClick={() => navigate('/patients')}
                                className="border-b border-gray-800/50 hover:bg-white/5 transition-colors cursor-pointer group"
                            >
                                <td className="py-4 font-semibold text-white group-hover:text-neuro-400 transition-colors">Sarah Smith</td>
                                <td className="py-4">4 hours ago</td>
                                <td className="py-4 text-neuro-400">No Tumor</td>
                                <td className="py-4"><span className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-400 text-xs">Pending Review</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
