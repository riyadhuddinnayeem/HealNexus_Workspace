import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    HeartPulse, Calendar, Users, FileSignature, LogOut, Clock,
    CheckCircle, AlertCircle, Search, Video, Pill, Send, Loader2, User
} from 'lucide-react';
import api from '../../services/api';

export default function DoctorDashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('schedule');
    const [searchQuery, setSearchQuery] = useState('');

    // Live Data State
    const [dashboardData, setDashboardData] = useState({
        doctor_name: '', specialty: '', todays_appointments: [], patients: []
    });

    // Form States
    const [rxForm, setRxForm] = useState({ patient_id: '', medicine: '', dosage: '', notes: '' });
    const [rxSuccess, setRxSuccess] = useState(false);

    // --- 1. FETCH LIVE DOCTOR DATA ---
    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');

            try {
                const response = await api.get('/doctor/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDashboardData(response.data);
            } catch (err) {
                if (err.response?.status === 401 || err.response?.status === 403) {
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    setError('Failed to load your schedule from the server.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // --- 2. SUBMIT DIGITAL PRESCRIPTION ---
    const handleSendPrescription = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            await api.post('/doctor/prescriptions', {
                patient_id: parseInt(rxForm.patient_id),
                medicines: [{
                    name: rxForm.medicine,
                    dosage: rxForm.dosage,
                    frequency: "As directed",
                    duration: "Standard"
                }],
                notes: rxForm.notes
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setRxSuccess(true);
            setTimeout(() => {
                setRxSuccess(false);
                setRxForm({ patient_id: '', medicine: '', dosage: '', notes: '' });
            }, 3000);
        } catch (err) {
            alert(err.response?.data?.detail || "Failed to send prescription.");
        }
    };

    // Filter patients based on search box
    const filteredPatients = dashboardData.patients.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-slate-500 font-medium animate-pulse">Loading your clinical schedule...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">

            {/* --- Sidebar Navigation --- */}
            <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col md:min-h-screen sticky top-0 md:h-screen z-20">
                <div className="p-6 flex items-center border-b border-slate-800 bg-slate-950">
                    <HeartPulse className="w-8 h-8 text-blue-500 mr-2 shrink-0" />
                    <span className="text-xl font-bold text-white tracking-tight">HealNexus</span>
                </div>

                <div className="p-4 flex-1 overflow-y-auto">
                    <p className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-4 px-2">Doctor Portal</p>
                    <nav className="space-y-1.5">
                        <button onClick={() => setActiveTab('schedule')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'schedule' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white'}`}>
                            <Calendar className="w-5 h-5" /> <span className="font-medium">My Schedule</span>
                        </button>
                        <button onClick={() => setActiveTab('patients')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'patients' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white'}`}>
                            <Users className="w-5 h-5" /> <span className="font-medium">Patient Database</span>
                        </button>
                        <button onClick={() => setActiveTab('prescriptions')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'prescriptions' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white'}`}>
                            <FileSignature className="w-5 h-5" /> <span className="font-medium">Write e-Rx</span>
                        </button>
                    </nav>
                </div>

                <div className="p-4 border-t border-slate-800 bg-slate-950">
                    <div className="flex items-center px-4 py-3 mb-2 rounded-xl bg-slate-800/50">
                        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold mr-3 shrink-0"><User className="w-4 h-4" /></div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">Dr. {dashboardData.doctor_name.split(' ')[0]}</p>
                            <p className="text-xs text-slate-400 truncate">{dashboardData.specialty || 'General'}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all font-medium">
                        <LogOut className="w-4 h-4" /> <span>Secure Logout</span>
                    </button>
                </div>
            </aside>

            {/* --- Main Dashboard Area --- */}
            <main className="flex-1 p-6 md:p-10 max-w-6xl overflow-y-auto">
                {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 font-medium">{error}</div>}

                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Good Morning, Dr. {dashboardData.doctor_name.split(' ')[0]}.</h1>
                    <p className="text-slate-500 mt-1 text-lg">Here is your clinical overview for today.</p>
                </div>

                {/* --- TAB 1: SCHEDULE --- */}
                {activeTab === 'schedule' && (
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in">
                        <div className="p-6 md:p-8 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900">Your Schedule</h2>
                            <p className="text-sm text-slate-500">You have {dashboardData.todays_appointments.length} appointments.</p>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {dashboardData.todays_appointments.length > 0 ? (
                                dashboardData.todays_appointments.map(app => (
                                    <div key={app.id} className="p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between hover:bg-slate-50 transition-colors gap-6">
                                        <div className="flex items-start space-x-5">
                                            <div className="bg-slate-100 p-3 rounded-2xl text-slate-700 font-bold text-sm text-center min-w-[100px] border border-slate-200">
                                                {app.date} <br /> <span className="text-xs font-medium text-blue-600">{app.time}</span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 text-lg">{app.patient_name}</h3>
                                                <div className="flex flex-wrap items-center text-sm text-slate-500 mt-1 gap-3">
                                                    <span className="flex items-center text-slate-600 font-medium bg-slate-100 px-2 py-0.5 rounded-md"><AlertCircle className="w-3.5 h-3.5 mr-1" /> {app.reason}</span>
                                                    <span className="flex items-center"><Users className="w-3.5 h-3.5 mr-1" /> Patient ID: {app.patient_id}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm">
                                            Start Visit
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center text-slate-500">
                                    <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                    <p className="font-medium text-lg">No appointments booked yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* --- TAB 2: LIVE PATIENT DATABASE --- */}
                {activeTab === 'patients' && (
                    <div className="animate-in fade-in">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Patient Database</h2>
                                <p className="text-sm text-slate-500">Showing all patients who have booked you.</p>
                            </div>
                            <div className="relative w-full md:w-72">
                                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search patients..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {filteredPatients.length > 0 ? (
                                filteredPatients.map(patient => (
                                    <div key={patient.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center hover:border-blue-300 transition-colors group cursor-pointer">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold border border-slate-200">
                                                {patient.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900">{patient.name}</h3>
                                                <p className="text-xs text-slate-500 mt-0.5">Age: {patient.age} • Gender: {patient.gender}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded-md inline-block mb-1 border border-slate-200">ID: {patient.id}</p>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Last Visit: {patient.last_visit}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-1 lg:col-span-2 text-center py-12 bg-white rounded-2xl border border-slate-200">
                                    <p className="text-slate-500">No patients found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* --- TAB 3: WRITE e-Rx --- */}
                {activeTab === 'prescriptions' && (
                    <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-3xl animate-in fade-in">
                        <div className="flex items-center mb-6 border-b border-slate-100 pb-4">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mr-3"><FileSignature className="w-5 h-5" /></div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Draft e-Prescription</h2>
                                <p className="text-sm text-slate-500">Create and instantly send to the Patient's vault.</p>
                            </div>
                        </div>

                        {rxSuccess ? (
                            <div className="py-12 text-center bg-emerald-50 rounded-2xl border border-emerald-100">
                                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-emerald-800 mb-2">Prescription Sent!</h3>
                                <p className="text-emerald-600 text-sm">The digital Rx has been successfully added to the patient's secure vault.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSendPrescription} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Select Patient</label>
                                    <select
                                        required
                                        value={rxForm.patient_id}
                                        onChange={(e) => setRxForm({ ...rxForm, patient_id: e.target.value })}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    >
                                        <option value="">-- Choose from your patients --</option>
                                        {dashboardData.patients.map(p => (
                                            <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Medicine Name</label>
                                        <div className="relative">
                                            <Pill className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input required type="text" placeholder="e.g., Napa Extend" value={rxForm.medicine} onChange={(e) => setRxForm({ ...rxForm, medicine: e.target.value })} className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Dosage & Frequency</label>
                                        <input required type="text" placeholder="e.g., 1+0+1 after meal" value={rxForm.dosage} onChange={(e) => setRxForm({ ...rxForm, dosage: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Clinical Notes / Advice</label>
                                    <textarea rows="3" placeholder="Rest for 3 days, drink plenty of water..." value={rxForm.notes} onChange={(e) => setRxForm({ ...rxForm, notes: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"></textarea>
                                </div>

                                <button type="submit" className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center">
                                    <Send className="w-4 h-4 mr-2" /> Send to Patient Vault
                                </button>
                            </form>
                        )}
                    </div>
                )}

            </main>
        </div>
    );
}