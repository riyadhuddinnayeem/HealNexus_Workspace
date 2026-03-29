import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    HeartPulse, Users, Stethoscope, ShieldCheck,
    LogOut, Activity, UserPlus, CheckCircle, XCircle, Settings
} from 'lucide-react';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    // Mock data for the Admin
    const systemStats = { totalPatients: 1245, totalDoctors: 84, appointmentsToday: 156 };

    const pendingDoctors = [
        { id: 1, name: "Dr. Ahmed Reza", specialty: "Cardiology", license: "BMDC-A8832", status: "Pending" },
        { id: 2, name: "Dr. Fatima Rahman", specialty: "Neurology", license: "BMDC-N9021", status: "Pending" }
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">

            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col md:min-h-screen shadow-xl z-10">
                <div className="p-6 flex items-center border-b border-slate-800">
                    <HeartPulse className="w-8 h-8 text-blue-500 mr-2" />
                    <span className="text-xl font-bold text-white">HealNexus</span>
                </div>

                <div className="p-6">
                    <p className="text-xs font-bold tracking-wider text-purple-400 uppercase mb-4 flex items-center">
                        <ShieldCheck className="w-4 h-4 mr-1" /> Admin Portal
                    </p>
                    <nav className="space-y-2">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-purple-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
                        >
                            <Activity className="w-5 h-5" /> <span>System Overview</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('doctors')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'doctors' ? 'bg-purple-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
                        >
                            <Stethoscope className="w-5 h-5" /> <span>Manage Doctors</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('patients')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'patients' ? 'bg-purple-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
                        >
                            <Users className="w-5 h-5" /> <span>Patient Registry</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-purple-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
                        >
                            <Settings className="w-5 h-5" /> <span>Platform Settings</span>
                        </button>
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-slate-800">
                    <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all">
                        <LogOut className="w-5 h-5" /> <span>Secure Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Dashboard Area */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Administrator Console</h1>
                    <p className="text-slate-500">Monitor and manage the HealNexus platform.</p>
                </div>

                {/* Dynamic Tab Content */}
                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                                <div><p className="text-sm text-slate-500 font-medium mb-1">Total Patients</p><p className="text-3xl font-bold text-slate-900">{systemStats.totalPatients}</p></div>
                                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center"><Users className="w-7 h-7" /></div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                                <div><p className="text-sm text-slate-500 font-medium mb-1">Verified Doctors</p><p className="text-3xl font-bold text-slate-900">{systemStats.totalDoctors}</p></div>
                                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center"><Stethoscope className="w-7 h-7" /></div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                                <div><p className="text-sm text-slate-500 font-medium mb-1">Today's Traffic</p><p className="text-3xl font-bold text-slate-900">{systemStats.appointmentsToday}</p></div>
                                <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center"><Activity className="w-7 h-7" /></div>
                            </div>
                        </div>

                        {/* Quick Actions / Alerts */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                                <h2 className="text-lg font-bold text-slate-900 flex items-center"><UserPlus className="w-5 h-5 mr-2 text-amber-500" /> Pending Doctor Approvals</h2>
                                <span className="bg-amber-100 text-amber-700 py-1 px-3 rounded-full text-xs font-bold">{pendingDoctors.length} Action Required</span>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {pendingDoctors.map(doc => (
                                    <div key={doc.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition-colors">
                                        <div className="mb-4 sm:mb-0">
                                            <h3 className="font-bold text-slate-900 text-lg">{doc.name}</h3>
                                            <div className="flex items-center text-sm text-slate-500 mt-1 space-x-4">
                                                <span className="font-medium text-purple-600">{doc.specialty}</span>
                                                <span>License: <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{doc.license}</span></span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <button className="flex items-center px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white text-sm font-semibold rounded-lg transition-colors">
                                                <CheckCircle className="w-4 h-4 mr-1.5" /> Approve
                                            </button>
                                            <button className="flex items-center px-4 py-2 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white text-sm font-semibold rounded-lg transition-colors">
                                                <XCircle className="w-4 h-4 mr-1.5" /> Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Placeholders for other tabs */}
                {activeTab === 'doctors' && (
                    <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center">
                        <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Doctor Directory Management</h3>
                        <p className="text-slate-500">View, edit, or suspend doctor accounts here.</p>
                    </div>
                )}

                {activeTab === 'patients' && (
                    <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center">
                        <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Patient Registry</h3>
                        <p className="text-slate-500">Search and audit patient accounts across the platform.</p>
                    </div>
                )}

            </main>
        </div>
    );
}