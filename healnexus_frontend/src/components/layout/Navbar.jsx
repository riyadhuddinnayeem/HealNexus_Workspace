import { useNavigate } from 'react-router-dom';
import { HeartPulse, LogOut, Bell } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

export default function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    let userEmail = 'User';
    if (token) {
        try { userEmail = jwtDecode(token).sub; } catch (e) { }
    }

    const handleLogout = () => {
        localStorage.removeItem('token'); // Destroy the session
        navigate('/login'); // Kick them back to login
    };

    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center">
                <HeartPulse className="w-8 h-8 text-primary mr-2" />
                <span className="text-xl font-bold text-slate-900">HealNexus</span>
            </div>

            <div className="flex items-center space-x-4">
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
                    <Bell className="w-5 h-5" />
                </button>

                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-primary font-bold border border-blue-200">
                    {userEmail.charAt(0).toUpperCase()}
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center text-sm font-medium text-slate-600 hover:text-red-600 transition-colors ml-4"
                >
                    <LogOut className="w-4 h-4 mr-1.5" />
                    Logout
                </button>
            </div>
        </header>
    );
}