import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, UserPlus, Search, FileText, Activity } from 'lucide-react';
// import { useAuth } from '../context/AuthContext'; // Assuming we might need this later

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newPatient, setNewPatient] = useState({ name: '', age: '', gender: 'Male', contact: '' });

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await axios.get('/patients');
            setPatients(response.data);
        } catch (error) {
            console.error("Error fetching patients:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddPatient = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/patients', newPatient);
            setPatients([...patients, response.data]);
            setShowAddModal(false);
            setNewPatient({ name: '', age: '', gender: 'Male', contact: '' });
        } catch (error) {
            console.error("Error adding patient:", error);
            alert("Failed to add patient");
        }
    };

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Users className="text-neuro-400" />
                    Patient Management
                </h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-neuro-600 hover:bg-neuro-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <UserPlus className="w-4 h-4" />
                    Add Patient
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6 relative">
                <Search className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-dark-card border border-dark-border rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-neuro-500 focus:ring-1 focus:ring-neuro-500 transition-all"
                />
            </div>

            {/* Patients List */}
            {loading ? (
                <div className="text-center text-gray-400 py-10">Loading patients...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPatients.map((patient, index) => (
                        <motion.div
                            key={patient.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass-panel p-6 rounded-xl border border-white/5 hover:border-neuro-500/50 transition-colors group cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-neuro-500/10 rounded-full group-hover:bg-neuro-500/20 transition-colors">
                                    <Activity className="text-neuro-400 w-6 h-6" />
                                </div>
                                <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full">ID: {patient.id}</span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-1">{patient.name}</h3>
                            <div className="text-sm text-gray-400 mb-4 flex gap-4">
                                <span>{patient.age} yrs</span>
                                <span>{patient.gender}</span>
                            </div>

                            <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                                <button className="flex-1 py-2 text-sm bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 transition-colors">
                                    View History
                                </button>
                                <button className="flex-1 py-2 text-sm bg-neuro-600/20 hover:bg-neuro-600/30 text-neuro-300 rounded-lg transition-colors border border-neuro-600/30">
                                    New Scan
                                </button>
                            </div>
                        </motion.div>
                    ))}

                    {filteredPatients.length === 0 && (
                        <div className="col-span-full text-center py-10 text-gray-500">
                            No patients found.
                        </div>
                    )}
                </div>
            )}

            {/* Add Patient Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-dark-card border border-dark-border p-8 rounded-2xl w-full max-w-md relative"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">Add New Patient</h2>
                        <form onSubmit={handleAddPatient} className="space-y-4">
                            <div>
                                <label className="block text-gray-400 mb-1 text-sm">Full Name</label>
                                <input
                                    type="text"
                                    value={newPatient.name}
                                    onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-neuro-500 outline-none"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 mb-1 text-sm">Age</label>
                                    <input
                                        type="number"
                                        value={newPatient.age}
                                        onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-neuro-500 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-1 text-sm">Gender</label>
                                    <select
                                        value={newPatient.gender}
                                        onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-neuro-500 outline-none"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-3 text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-neuro-600 hover:bg-neuro-500 text-white rounded-xl font-semibold transition-colors shadow-lg shadow-neuro-500/20"
                                >
                                    Add Patient
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Patients;
