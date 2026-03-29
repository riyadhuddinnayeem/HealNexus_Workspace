import { useState } from 'react';
import { Activity, AlertTriangle, CheckCircle, ArrowLeft, FileText, Pill, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const commonSymptoms = [
    "Fever", "Cough", "Headache", "Fatigue", "Nausea", "Sore Throat", "Shortness of Breath", "Body Aches"
];

export default function SelfDiagnosis() {
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [result, setResult] = useState(null);

    // --- NEW SMART ROUTING LOGIC ---
    const isLoggedIn = !!localStorage.getItem('token');
    const role = localStorage.getItem('role') || 'patient';
    const backRoute = isLoggedIn ? `/${role}` : '/';
    const backText = isLoggedIn ? 'Back to Dashboard' : 'Back to Home';

    const toggleSymptom = (symptom) => {
        if (selectedSymptoms.includes(symptom)) {
            setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
        } else {
            setSelectedSymptoms([...selectedSymptoms, symptom]);
        }
    };

    const analyzeSymptoms = () => {
        if (selectedSymptoms.length === 0) return;

        // Simple mock logic for demonstration
        if (selectedSymptoms.includes("Shortness of Breath") || selectedSymptoms.length > 4) {
            setResult({
                severity: "High",
                message: "Your symptoms indicate a potentially serious condition. Please consult a doctor immediately or visit the nearest emergency room.",
                color: "bg-red-50 border-red-200 text-red-800",
                icon: <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
            });
        } else if (selectedSymptoms.includes("Fever") && selectedSymptoms.includes("Cough")) {
            setResult({
                severity: "Moderate",
                message: "You are showing signs of a viral infection (like the flu). Rest, stay hydrated, and book a standard consultation if symptoms persist for more than 3 days.",
                color: "bg-amber-50 border-amber-200 text-amber-800",
                icon: <Activity className="w-6 h-6 text-amber-600 mr-2" />
            });
        } else {
            setResult({
                severity: "Low",
                message: "Your symptoms appear mild. Get plenty of rest and monitor your condition. Use our Pill Directory for over-the-counter relief options.",
                color: "bg-emerald-50 border-emerald-200 text-emerald-800",
                icon: <CheckCircle className="w-6 h-6 text-emerald-600 mr-2" />
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <Link to={backRoute} className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 mb-6">
                    <ArrowLeft className="w-4 h-4 mr-1" /> {backText}
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
                    <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mr-4">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Self-Diagnosis Assistant</h1>
                            <p className="text-slate-500 text-sm">Select what you are experiencing to get basic triage advice.</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="font-semibold text-slate-700 mb-3">Select your symptoms:</h3>
                        <div className="flex flex-wrap gap-2">
                            {commonSymptoms.map(symptom => (
                                <button
                                    key={symptom}
                                    onClick={() => toggleSymptom(symptom)}
                                    className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${selectedSymptoms.includes(symptom)
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                                        : 'bg-white border-slate-300 text-slate-600 hover:border-blue-400 hover:text-blue-600'
                                        }`}
                                >
                                    {symptom}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={analyzeSymptoms}
                        disabled={selectedSymptoms.length === 0}
                        className={`w-full py-3 rounded-xl font-bold text-white transition-all ${selectedSymptoms.length === 0 ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg'
                            }`}
                    >
                        Analyze Symptoms
                    </button>

                    {result && (
                        <div className={`mt-8 p-6 rounded-xl border animate-in fade-in slide-in-from-bottom-4 ${result.color}`}>
                            <div className="flex items-center mb-2">
                                {result.icon}
                                <h3 className="font-bold text-lg">Triage Result: {result.severity} Priority</h3>
                            </div>
                            <p className="ml-8 leading-relaxed">{result.message}</p>

                            {result.severity !== "Low" && (
                                <div className="ml-8 mt-4">
                                    <Link to="/doctors" className="inline-block bg-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm border border-current hover:opacity-80 transition-opacity">
                                        Find a Doctor Now
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* --- Next Steps / Navigation CTA --- */}
                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Need more guidance?</h3>
                    <p className="text-slate-500 mb-8 max-w-2xl mx-auto">
                        Once you've checked your symptoms, you can look up common over-the-counter remedies, search our medication database, or book an appointment.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link to="/common-prescriptions" className="flex items-center justify-center p-4 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 font-semibold transition-colors">
                            <FileText className="w-5 h-5 mr-2" /> Common Prescriptions
                        </Link>
                        <Link to="/pill-directory" className="flex items-center justify-center p-4 rounded-xl bg-cyan-50 text-cyan-700 hover:bg-cyan-100 font-semibold transition-colors">
                            <Pill className="w-5 h-5 mr-2" /> Search Pill Directory
                        </Link>
                        <Link to="/doctors" className="flex items-center justify-center p-4 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-semibold transition-colors shadow-md">
                            <UserPlus className="w-5 h-5 mr-2" /> Book a Doctor
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}