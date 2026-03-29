import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    HeartPulse, LogOut, Calendar, FileText, Activity,
    Video, PlusCircle, Clock, Loader2, User, X, CheckCircle,
    Pill, Stethoscope, FileSignature, LayoutDashboard, Eye, ExternalLink, ChevronDown, ChevronUp
} from 'lucide-react';
import api from '../../services/api';

export default function PatientDashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [activeTab, setActiveTab] = useState('overview');

    const [dashboardData, setDashboardData] = useState({
        patient_name: '', email: '', appointments: [], medical_records: [], prescriptions: [], available_doctors: []
    });

    // --- MODAL STATES ---
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [viewRecord, setViewRecord] = useState(null);

    // --- NEW: Toggle State for Vault Expansion ---
    const [isVaultExpanded, setIsVaultExpanded] = useState(false);

    const [bookingForm, setBookingForm] = useState({ doctor_id: '', date_time: '', reason: '', file: null });
    const [uploadForm, setUploadForm] = useState({ record_type: 'Lab Report', description: '', file: null });

    const API_BASE_URL = 'http://127.0.0.1:8000';

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');

            try {
                const response = await api.get('/patient/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDashboardData(response.data);
            } catch (err) {
                if (err.response?.status === 401 || err.response?.status === 403) {
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    setError('Failed to load your health data.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [navigate, refreshTrigger]);

    const handleBookAppointment = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        const formData = new FormData();
        formData.append('doctor_id', bookingForm.doctor_id);
        formData.append('date_time', bookingForm.date_time);
        formData.append('reason', bookingForm.reason);
        if (bookingForm.file) {
            formData.append('file', bookingForm.file);
        }

        try {
            await api.post('/patient/appointments', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setIsBookingModalOpen(false);
            setSuccessMsg("Appointment successfully booked!");
            setBookingForm({ doctor_id: '', date_time: '', reason: '', file: null });
            setRefreshTrigger(prev => prev + 1);
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) { alert("Failed to book appointment."); }
    };

    const handleUploadRecord = async (e) => {
        e.preventDefault();
        if (!uploadForm.file) return alert("Please select a file.");
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('record_type', uploadForm.record_type);
        formData.append('description', uploadForm.description);
        formData.append('file', uploadForm.file);

        try {
            await api.post('/patient/records', formData, {
                headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
            });
            setIsUploadModalOpen(false);
            setSuccessMsg("Medical record safely uploaded to vault!");
            setUploadForm({ record_type: 'Lab Report', description: '', file: null });
            setRefreshTrigger(prev => prev + 1);
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) { alert("Failed to upload record."); }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Determine how many records to show
    const displayedRecords = isVaultExpanded ? dashboardData.medical_records : dashboardData.medical_records.slice(0, 5);

    if (loading) return <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center"><Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" /><p className="text-slate-500 font-medium animate-pulse">Loading health profile...</p></div>;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans relative">

            {/* --- SIDEBAR --- */}
            <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col md:min-h-screen sticky top-0 md:h-screen z-20 shadow-xl">
                <div className="p-6 flex items-center border-b border-slate-800 bg-slate-950">
                    <HeartPulse className="w-8 h-8 text-blue-500 mr-2 shrink-0" />
                    <span className="text-xl font-bold text-white tracking-tight">HealNexus</span>
                </div>

                <div className="p-4 flex-1 overflow-y-auto">
                    <p className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-4 px-2">Patient Menu</p>
                    <nav className="space-y-1.5">
                        <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white'}`}>
                            <LayoutDashboard className="w-5 h-5" /> <span className="font-medium">My Dashboard</span>
                        </button>
                        <button onClick={() => setActiveTab('prescriptions')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'prescriptions' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 hover:text-white'}`}>
                            <FileSignature className="w-5 h-5" /> <span className="font-medium">My e-Prescriptions</span>
                        </button>
                        <button onClick={() => setIsBookingModalOpen(true)} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all text-left">
                            <PlusCircle className="w-5 h-5" /> <span className="font-medium">Book a Doctor</span>
                        </button>
                        <button onClick={() => setIsUploadModalOpen(true)} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all text-left">
                            <FileText className="w-5 h-5" /> <span className="font-medium">Upload Record</span>
                        </button>

                        <div className="my-4 border-t border-slate-800"></div>
                        <p className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-2 px-2">Health Tools</p>

                        <Link to="/video-consult" className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-400 transition-all">
                            <Video className="w-5 h-5" /> <span className="font-medium">Join Video Call</span>
                        </Link>
                        <Link to="/self-diagnosis" className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-rose-500/10 hover:text-rose-400 transition-all">
                            <Stethoscope className="w-5 h-5" /> <span className="font-medium">Self Diagnosis</span>
                        </Link>
                        <Link to="/pill-directory" className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-cyan-500/10 hover:text-cyan-400 transition-all">
                            <Pill className="w-5 h-5" /> <span className="font-medium">Pill Directory</span>
                        </Link>
                        <Link to="/common-prescriptions" className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-amber-500/10 hover:text-amber-400 transition-all">
                            <Activity className="w-5 h-5" /> <span className="font-medium">Common Rx</span>
                        </Link>
                    </nav>
                </div>

                <div className="p-4 border-t border-slate-800 bg-slate-950">
                    <div className="flex items-center px-4 py-3 mb-2 rounded-xl bg-slate-800/50">
                        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold mr-3 shrink-0"><User className="w-4 h-4" /></div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">{dashboardData.patient_name}</p>
                            <p className="text-xs text-slate-400 truncate">Patient</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-2.5 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl transition-all font-medium">
                        <LogOut className="w-4 h-4" /> <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <main className="flex-1 p-6 md:p-10 max-w-7xl overflow-y-auto">
                {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 font-medium flex items-center"><Activity className="w-5 h-5 mr-2" /> {error}</div>}
                {successMsg && <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 font-bold flex items-center animate-in fade-in"><CheckCircle className="w-5 h-5 mr-2" /> {successMsg}</div>}

                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="animate-in fade-in">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-8 md:p-10 text-white shadow-xl shadow-blue-900/10 mb-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                            <div className="relative z-10">
                                <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Welcome back, {dashboardData.patient_name.split(' ')[0]}!</h1>
                                <p className="text-blue-100 max-w-xl text-lg">Take control of your health journey. Manage your appointments and view medical records all in one place.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                                    <h2 className="text-xl font-extrabold text-slate-900 flex items-center"><Calendar className="w-5 h-5 mr-2 text-blue-600" /> My Appointments</h2>
                                </div>
                                {dashboardData.appointments.length > 0 ? (
                                    <div className="space-y-4">
                                        {dashboardData.appointments.map((apt, index) => {
                                            const aptDate = new Date(apt.date_time);
                                            return (
                                                <div key={index} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                    <div>
                                                        <div className="flex items-center space-x-2 mb-3">
                                                            <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${apt.status.toLowerCase() === 'scheduled' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{apt.status}</span>
                                                        </div>
                                                        <h3 className="font-bold text-lg text-slate-900">Dr. {apt.doctor_name}</h3>
                                                        <p className="text-sm font-medium text-slate-500 mb-3 bg-slate-50 inline-block px-3 py-1 rounded-lg">Reason: {apt.reason}</p>
                                                        <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-700">
                                                            <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5 text-blue-500" /> {aptDate.toLocaleDateString()}</span>
                                                            <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5 text-blue-500" /> {aptDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center">
                                        <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-slate-800 mb-2">No upcoming appointments</h3>
                                        <button onClick={() => setIsBookingModalOpen(true)} className="mt-4 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md">Book a Visit</button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                                    <h2 className="text-xl font-extrabold text-slate-900 flex items-center"><FileText className="w-5 h-5 mr-2 text-emerald-600" /> Medical Vault</h2>
                                </div>

                                {dashboardData.medical_records.length > 0 ? (
                                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                                        {/* Records List (Limited to 5 or All) */}
                                        <div className="divide-y divide-slate-100">
                                            {displayedRecords.map((record, index) => (
                                                <div key={index} className="p-5 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                                                    <div className="flex items-start">
                                                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl mr-4 shrink-0 border border-emerald-100">
                                                            <FileText className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-900">{record.record_type}</h4>
                                                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{record.description}</p>
                                                            <span className="text-[10px] font-bold text-slate-400 mt-3 block uppercase tracking-wider">
                                                                Uploaded: {new Date(record.uploaded_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => setViewRecord(record)}
                                                        className="p-3 bg-white border border-slate-200 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl shadow-sm transition-all flex items-center justify-center shrink-0"
                                                        title="View Document"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Expand/Collapse Button */}
                                        {dashboardData.medical_records.length > 5 && (
                                            <button
                                                onClick={() => setIsVaultExpanded(!isVaultExpanded)}
                                                className="p-4 bg-slate-50 text-emerald-700 text-sm font-bold border-t border-slate-100 hover:bg-emerald-50 transition-colors flex items-center justify-center w-full"
                                            >
                                                {isVaultExpanded ? (
                                                    <><ChevronUp className="w-4 h-4 mr-2" /> Show Less</>
                                                ) : (
                                                    <><ChevronDown className="w-4 h-4 mr-2" /> View All {dashboardData.medical_records.length} Records</>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm">
                                        <FileText className="w-14 h-14 text-slate-300 mx-auto mb-4" />
                                        <h3 className="font-bold text-slate-700 mb-1">Vault Empty</h3>
                                        <button onClick={() => setIsUploadModalOpen(true)} className="mt-4 w-full py-2.5 text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors">+ Upload Record</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* PRESCRIPTIONS TAB */}
                {activeTab === 'prescriptions' && (
                    <div className="animate-in fade-in">
                        <div className="mb-8">
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center"><FileSignature className="w-8 h-8 mr-3 text-blue-600" /> Digital Prescriptions</h1>
                            <p className="text-slate-500 mt-1 text-lg">View official e-Rx documents prescribed by your doctors.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {dashboardData.prescriptions.length > 0 ? dashboardData.prescriptions.map((rx, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
                                    <div className="flex justify-between items-start mb-4 pl-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900">Dr. {rx.doctor_name}</h3>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{new Date(rx.date).toLocaleDateString()} at {new Date(rx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">Official e-Rx</span>
                                    </div>
                                    <div className="pl-4">
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center"><Pill className="w-3 h-3 mr-1" /> Medicines</h4>
                                            <ul className="space-y-3">
                                                {rx.medicines.map((m, i) => (
                                                    <li key={i} className="flex flex-col">
                                                        <span className="font-bold text-slate-900">{m.name}</span>
                                                        <span className="text-sm text-slate-600">{m.dosage}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        {rx.notes && (
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Doctor's Notes</h4>
                                                <p className="text-sm text-slate-700 italic border-l-2 border-slate-300 pl-3 py-1">{rx.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-1 md:col-span-2 text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">
                                    <FileSignature className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">No prescriptions found</h3>
                                    <p className="text-slate-500">You haven't received any digital prescriptions from a doctor yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* --- BOOKING MODAL --- */}
            {isBookingModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative">
                        <button onClick={() => setIsBookingModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"><X className="w-6 h-6" /></button>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Book Appointment</h2>
                        <form onSubmit={handleBookAppointment} className="space-y-4 mt-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Select Doctor</label>
                                <select
                                    required
                                    value={bookingForm.doctor_id}
                                    onChange={(e) => setBookingForm({ ...bookingForm, doctor_id: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">-- Choose a Doctor --</option>
                                    {dashboardData.available_doctors.map(doc => (
                                        <option key={doc.id} value={doc.id}>Dr. {doc.name} ({doc.specialty || 'General'})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Date & Time</label>
                                <input required type="datetime-local" value={bookingForm.date_time} onChange={(e) => setBookingForm({ ...bookingForm, date_time: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Reason for visit</label>
                                <input required type="text" placeholder="e.g., Routine Checkup, Chest Pain" value={bookingForm.reason} onChange={(e) => setBookingForm({ ...bookingForm, reason: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>

                            {/* --- FILE ATTACHMENT FIELD --- */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Attach Document (Optional)</label>
                                <input type="file" onChange={(e) => setBookingForm({ ...bookingForm, file: e.target.files[0] })} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                <p className="text-xs text-slate-500 mt-1">Upload a previous prescription or lab report for the doctor.</p>
                            </div>

                            <button type="submit" className="w-full py-3.5 mt-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md transition-colors">Confirm Booking</button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- UPLOAD RECORD MODAL --- */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative">
                        <button onClick={() => setIsUploadModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"><X className="w-6 h-6" /></button>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Upload to Vault</h2>
                        <form onSubmit={handleUploadRecord} className="space-y-4 mt-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Record Type</label>
                                <select required value={uploadForm.record_type} onChange={(e) => setUploadForm({ ...uploadForm, record_type: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none">
                                    <option value="Lab Report">Lab Report</option>
                                    <option value="Prescription">Previous Prescription</option>
                                    <option value="MRI / X-Ray">MRI / X-Ray</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Short Description</label>
                                <input required type="text" placeholder="e.g., Blood test from Square Hospital" value={uploadForm.description} onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Attach File</label>
                                <input required type="file" onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files[0] })} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
                            </div>
                            <button type="submit" className="w-full py-3.5 mt-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-md transition-colors">Upload Securely</button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- DOCUMENT VIEWER MODAL --- */}
            {viewRecord && (
                <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">

                        {/* Header */}
                        <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">{viewRecord.record_type}</h2>
                                <p className="text-sm text-slate-500">{viewRecord.description}</p>
                            </div>
                            <button onClick={() => setViewRecord(null)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* File Viewer Area */}
                        <div className="flex-1 overflow-auto p-4 bg-slate-100 flex items-center justify-center min-h-[50vh]">

                            {/* If it's an Image */}
                            {viewRecord.file_path.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                                <img
                                    src={`${API_BASE_URL}/${viewRecord.file_path}`}
                                    alt="Medical Record"
                                    className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                                />
                            ) :

                                /* If it's a PDF */
                                viewRecord.file_path.match(/\.(pdf)$/i) ? (
                                    <iframe
                                        src={`${API_BASE_URL}/${viewRecord.file_path}`}
                                        className="w-full h-[60vh] md:h-[70vh] rounded-lg shadow-sm bg-white"
                                        title="PDF Document"
                                    />
                                ) :

                                    /* If it's something else (like .docx), give a fallback download link */
                                    (
                                        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
                                            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                            <p className="text-slate-600 font-medium mb-4">In-app preview is not available for this file type.</p>
                                            <a
                                                href={`${API_BASE_URL}/${viewRecord.file_path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors inline-flex items-center"
                                            >
                                                <ExternalLink className="w-4 h-4 mr-2" /> Open / Download File
                                            </a>
                                        </div>
                                    )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}