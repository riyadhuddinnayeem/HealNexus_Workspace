import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, HeartPulse, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import api from '../../services/api';

export default function Register() {
    const navigate = useNavigate();
    const [role, setRole] = useState('patient');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState(''); // <--- NEW STATE FOR SUCCESS

    const [formData, setFormData] = useState({
        full_name: '', email: '', password: '', confirmPassword: '',
        age: '', gender: '', phone: '', specialization: '', license_no: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const calculateStrength = (pass) => {
        let strength = 0;
        if (pass.length > 5) strength += 1;
        if (pass.length > 8) strength += 1;
        if (/[A-Z]/.test(pass)) strength += 1;
        if (/[0-9]/.test(pass)) strength += 1;
        if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
        return strength;
    };
    const passwordStrength = calculateStrength(formData.password);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg(''); // Clear old success messages

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            // Build the payload based on the selected role
            const payload = {
                full_name: formData.full_name,
                email: formData.email,
                password: formData.password,
                role: role,
                ...(role === 'patient' && { age: formData.age ? parseInt(formData.age) : null, gender: formData.gender, phone: formData.phone }),
                ...(role === 'doctor' && { specialization: formData.specialization, license_no: formData.license_no })
            };

            await api.post('/auth/register', payload);

            // --- NEW: Dynamic Success Message ---
            if (role === 'patient') {
                setSuccessMsg('Successfully created Patient user. Redirecting to login...');
            } else {
                setSuccessMsg('Account created! Waiting for Admin approval. Redirecting...');
            }

            // --- NEW: 3-Second Delay before Redirect ---
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed. Please try again.');
            setLoading(false); // Only stop loading if there's an error so the button doesn't flicker
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
            <div className="mb-6 flex items-center justify-center mt-12 md:mt-0">
                <HeartPulse className="w-8 h-8 text-blue-600 mr-2" />
                <span className="text-2xl font-bold text-slate-900">HealNexus</span>
            </div>

            <Link
                to="/"
                className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Link>

            <Link
                to="/login"
                className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
            >
                Back to Login Page <ArrowRight className="w-4 h-4 ml-2" />
            </Link>

            <div className="bg-white max-w-lg w-full p-8 rounded-2xl shadow-xl border border-slate-100">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">Create an Account</h2>
                    <p className="text-sm text-slate-500 mt-2">Join our digital healthcare ecosystem.</p>
                </div>

                {/* Role Selector Tabs */}
                <div className="flex p-1 bg-slate-100 rounded-lg mb-8">
                    {['patient', 'doctor', 'admin'].map((r) => (
                        <button
                            key={r} type="button" onClick={() => setRole(r)}
                            disabled={successMsg !== ''} // Disable switching roles while redirecting
                            className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition-all ${role === r ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>

                {/* ERROR BANNER */}
                {error && <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded border-l-4 border-red-500">{error}</div>}

                {/* SUCCESS BANNER */}
                {successMsg && (
                    <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 text-sm rounded-lg border border-emerald-200 font-bold flex items-center animate-in fade-in">
                        <CheckCircle className="w-5 h-5 mr-2 shrink-0" />
                        {successMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input name="full_name" type="text" required value={formData.full_name} onChange={handleChange} disabled={successMsg !== ''} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none disabled:opacity-50" placeholder="John Doe" />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <input name="email" type="email" required value={formData.email} onChange={handleChange} disabled={successMsg !== ''} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none disabled:opacity-50" placeholder="john@example.com" />
                        </div>
                    </div>

                    {/* Dynamic Fields based on Role */}
                    {role === 'patient' && (
                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                                <input name="age" type="number" value={formData.age} onChange={handleChange} disabled={successMsg !== ''} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none disabled:opacity-50" placeholder="e.g. 34" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} disabled={successMsg !== ''} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none disabled:opacity-50">
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {role === 'doctor' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Specialization</label>
                                <input name="specialization" type="text" value={formData.specialization} onChange={handleChange} disabled={successMsg !== ''} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none disabled:opacity-50" placeholder="e.g. Cardiology" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">License No.</label>
                                <input name="license_no" type="text" value={formData.license_no} onChange={handleChange} disabled={successMsg !== ''} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none disabled:opacity-50" placeholder="MED-12345" />
                            </div>
                        </div>
                    )}

                    <div className="pt-2 border-t border-slate-100">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input name="password" type="password" required value={formData.password} onChange={handleChange} disabled={successMsg !== ''} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none disabled:opacity-50" placeholder="••••••••" />
                        {formData.password && (
                            <div className="mt-2 flex gap-1">
                                {[1, 2, 3, 4, 5].map((level) => (
                                    <div key={level} className={`h-1.5 w-full rounded-full ${level <= passwordStrength ? (passwordStrength > 3 ? 'bg-green-500' : passwordStrength > 2 ? 'bg-yellow-400' : 'bg-red-400') : 'bg-slate-200'}`} />
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                        <input name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} disabled={successMsg !== ''} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none disabled:opacity-50" placeholder="••••••••" />
                    </div>

                    <button type="submit" disabled={loading || successMsg !== ''} className={`w-full flex justify-center items-center px-4 py-3 text-white text-sm font-semibold rounded-lg transition-all ${loading || successMsg !== '' ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}>
                        {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {successMsg ? 'Redirecting...' : 'Creating account...'}</> : 'Create Account'}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-slate-500">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-800">
                        Log in here
                    </Link>
                </p>
            </div>
        </div>
    );
}