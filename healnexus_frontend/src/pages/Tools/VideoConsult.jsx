import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Video, ArrowLeft, Calendar, Clock, User, ShieldCheck, ArrowRight, VideoOff } from 'lucide-react';

export default function VideoConsult() {
    const navigate = useNavigate();

    // Check if the user is actually logged in by looking for the JWT token
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    // MOCK DATA: Later, we will fetch this from your FastAPI backend's hn_appointments table!
    const upcomingAppointments = [
        {
            id: 1,
            doctorName: "Dr. Hasan Mahmud",
            specialty: "Cardiologist",
            date: "Today",
            time: "3:30 PM",
            status: "Starting Soon",
            // This is the "Link Portal" magic. It just points to a Google Meet room.
            meetLink: "https://meet.google.com/abc-defg-hij"
        },
        {
            id: 2,
            doctorName: "Dr. Salma Begum",
            specialty: "General Physician",
            date: "Tomorrow",
            time: "10:00 AM",
            status: "Scheduled",
            meetLink: null // Link generates closer to the meeting time
        }
    ];

    // --- VIEW 1: FOR LOGGED OUT USERS (Marketing/Prompt) ---
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    <Link to="/" className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 mb-8">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                    </Link>

                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 text-center relative overflow-hidden">
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50"></div>

                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <Video className="w-10 h-10" />
                            </div>
                            <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Virtual Consultations</h1>
                            <p className="text-lg text-slate-500 mb-8 max-w-2xl mx-auto leading-relaxed">
                                Connect with top-rated specialists across Bangladesh from the comfort of your home. Secure, private, and fully integrated with your medical records.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link to="/login" className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center">
                                    Log In to Join Call
                                </Link>
                                <Link to="/doctors" className="w-full sm:w-auto px-8 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all">
                                    Find a Doctor
                                </Link>
                            </div>

                            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left border-t border-slate-100 pt-10">
                                <div className="flex flex-col items-center text-center">
                                    <ShieldCheck className="w-8 h-8 text-emerald-500 mb-3" />
                                    <h4 className="font-bold text-slate-900">Secure & Private</h4>
                                    <p className="text-sm text-slate-500 mt-1">End-to-end encrypted video rooms via industry standards.</p>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <Calendar className="w-8 h-8 text-amber-500 mb-3" />
                                    <h4 className="font-bold text-slate-900">Easy Scheduling</h4>
                                    <p className="text-sm text-slate-500 mt-1">Book slots instantly and get SMS reminders.</p>
                                </div>
                                <div className="flex flex-col items-center text-center">
                                    <User className="w-8 h-8 text-purple-500 mb-3" />
                                    <h4 className="font-bold text-slate-900">Top Specialists</h4>
                                    <p className="text-sm text-slate-500 mt-1">Consult directly with BD Medical Council verified doctors.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- VIEW 2: FOR LOGGED IN PATIENTS (The Dashboard) ---
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <Link
                        to={localStorage.getItem('role') === 'patient' ? '/patient' : localStorage.getItem('role') === 'doctor' ? '/doctor' : '/'}
                        className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                    </Link>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-full flex items-center">
                        <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Secure Connection
                    </span>
                </div>

                <div className="flex items-center mb-8">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl mr-4 shadow-sm shrink-0">
                        <Video className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Your Video Consultations</h1>
                        <p className="text-slate-500 mt-1">Join your scheduled telehealth appointments here.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {upcomingAppointments.length > 0 ? (
                        upcomingAppointments.map((apt) => (
                            <div key={apt.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between transition-all hover:shadow-md">
                                <div className="mb-6 md:mb-0">
                                    <div className="flex items-center mb-2">
                                        <div className={`w-2 h-2 rounded-full mr-2 ${apt.status === 'Starting Soon' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                                        <span className={`text-xs font-bold uppercase tracking-wider ${apt.status === 'Starting Soon' ? 'text-emerald-600' : 'text-slate-500'}`}>
                                            {apt.status}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">{apt.doctorName}</h3>
                                    <p className="text-sm font-medium text-blue-600 mb-3">{apt.specialty}</p>

                                    <div className="flex items-center space-x-4 text-sm text-slate-600 bg-slate-50 inline-flex px-3 py-1.5 rounded-lg border border-slate-100">
                                        <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5 text-slate-400" /> {apt.date}</span>
                                        <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5 text-slate-400" /> {apt.time}</span>
                                    </div>
                                </div>

                                <div>
                                    {apt.meetLink ? (
                                        <a
                                            href={apt.meetLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30 transition-all relative overflow-hidden group"
                                        >
                                            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                                            <Video className="w-5 h-5 mr-2" /> Join Video Room
                                        </a>
                                    ) : (
                                        <button disabled className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3 bg-slate-100 text-slate-400 font-bold rounded-xl cursor-not-allowed border border-slate-200">
                                            <VideoOff className="w-5 h-5 mr-2" /> Link not ready
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 font-medium text-lg">No upcoming video consultations.</p>
                            <Link to="/doctors" className="mt-4 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800">
                                Book an appointment <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}