import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    HeartPulse, LogOut, LayoutDashboard, Users, Activity,
    ShieldCheck, UserCog, Check, X, Search, Loader2
} from 'lucide-react';
import api from '../../services/api';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [searchQuery, setSearchQuery] = useState('');

    const [dashboardData, setDashboardData] = useState({
        admin_name: '', stats: {}, pending_doctors: [], all_users: []
    });

    // Edit Modal States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({ full_name: '', phone: '', password: '' });

    const fetchAdminData = async () => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');
        try {
            const response = await api.get('/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } });
            setDashboardData(response.data);
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                localStorage.removeItem('token'); navigate('/login');
            }
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchAdminData(); }, [navigate]);

    const handleAction = async (endpoint, method, data = null) => {
        const token = localStorage.getItem('token');
        try {
            await api({ method, url: endpoint, data, headers: { Authorization: `Bearer ${token}` } });
            fetchAdminData(); // Refresh data instantly
            setIsEditModalOpen(false);
            alert("Action successful!");
        } catch (err) { alert("Action failed."); }
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setEditForm({ full_name: user.full_name, phone: user.phone || '', password: '' });
        setIsEditModalOpen(true);
    };

    const filteredUsers = dashboardData.all_users.filter(u => u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()));

    if (loading) return <div className="min-h-screen bg-slate-100 flex items-center justify-center"><Loader2 className="w-12 h-12 text-indigo-600 animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans relative">

            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col md:min-h-screen sticky top-0 md:h-screen z-20">
                <div className="p-6 flex items-center border-b border-slate-800 bg-slate-950">
                    <HeartPulse className="w-8 h-8 text-indigo-500 mr-2 shrink-0" />
                    <span className="text-xl font-bold text-white tracking-tight">HealNexus</span>
                </div>

                <div className="p-4 flex-1">
                    <p className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-4 px-2">Admin Controls</p>
                    <nav className="space-y-1.5">
                        <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
                            <LayoutDashboard className="w-5 h-5" /> <span>Overview</span>
                        </button>
                        <button onClick={() => setActiveTab('approvals')} className={`w-full flex justify-between items-center px-4 py-3 rounded-xl transition-all ${activeTab === 'approvals' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
                            <div className="flex items-center space-x-3"><ShieldCheck className="w-5 h-5" /> <span>Approvals</span></div>
                            {dashboardData.stats.pending_approvals > 0 && <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{dashboardData.stats.pending_approvals}</span>}
                        </button>
                        <button onClick={() => setActiveTab('users')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'users' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
                            <Users className="w-5 h-5" /> <span>Manage Users</span>
                        </button>
                    </nav>
                </div>

                <div className="p-4 border-t border-slate-800">
                    <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} className="w-full flex items-center space-x-3 px-4 py-2.5 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all font-medium">
                        <LogOut className="w-4 h-4" /> <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto">

                {/* TAB 1: OVERVIEW */}
                {activeTab === 'overview' && (
                    <div className="animate-in fade-in">
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-6">System Overview</h1>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center"><Users className="w-7 h-7" /></div>
                                <div><p className="text-sm text-slate-500 font-medium">Total Patients</p><p className="text-3xl font-extrabold">{dashboardData.stats.total_patients}</p></div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
                                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center"><Activity className="w-7 h-7" /></div>
                                <div><p className="text-sm text-slate-500 font-medium">Approved Doctors</p><p className="text-3xl font-extrabold">{dashboardData.stats.total_doctors}</p></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: APPROVALS */}
                {activeTab === 'approvals' && (
                    <div className="animate-in fade-in">
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Doctor Approvals</h1>
                        <p className="text-slate-500 mb-6">Review licenses and grant system access.</p>

                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="divide-y divide-slate-100">
                                {dashboardData.pending_doctors.length > 0 ? dashboardData.pending_doctors.map(doc => (
                                    <div key={doc.id} className="p-6 flex flex-col md:flex-row justify-between items-center hover:bg-slate-50">
                                        <div>
                                            <h3 className="font-bold text-lg">Dr. {doc.full_name}</h3>
                                            <p className="text-sm text-slate-500">Email: {doc.email} | License: {doc.license_no || 'N/A'}</p>
                                        </div>
                                        <div className="flex space-x-3 mt-4 md:mt-0">
                                            <button onClick={() => handleAction(`/admin/approve-doctor/${doc.id}`, 'PUT')} className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg font-bold hover:bg-emerald-200 flex items-center"><Check className="w-4 h-4 mr-2" /> Approve</button>
                                            <button onClick={() => handleAction(`/admin/reject-doctor/${doc.id}`, 'DELETE')} className="bg-rose-100 text-rose-700 px-4 py-2 rounded-lg font-bold hover:bg-rose-200 flex items-center"><X className="w-4 h-4 mr-2" /> Reject</button>
                                        </div>
                                    </div>
                                )) : <div className="p-12 text-center text-slate-500">No pending approvals!</div>}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: MANAGE USERS */}
                {activeTab === 'users' && (
                    <div className="animate-in fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-extrabold text-slate-900">User Database</h1>
                            <div className="relative w-64">
                                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="text" placeholder="Search name or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                                    <tr><th className="p-4">ID</th><th className="p-4">Name</th><th className="p-4">Role</th><th className="p-4">Phone</th><th className="p-4">Actions</th></tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {filteredUsers.map(user => (
                                        <tr key={user.id} className="hover:bg-slate-50">
                                            <td className="p-4 font-medium text-slate-500">{user.id}</td>
                                            <td className="p-4 font-bold text-slate-900">{user.full_name}<br /><span className="text-xs text-slate-400 font-normal">{user.email}</span></td>
                                            <td className="p-4"><span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : user.role === 'doctor' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{user.role}</span></td>
                                            <td className="p-4 text-slate-600">{user.phone || 'N/A'}</td>
                                            <td className="p-4">
                                                <button onClick={() => openEditModal(user)} className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center"><UserCog className="w-4 h-4 mr-1" /> Edit</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* Edit User Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-xl relative">
                        <button onClick={() => setIsEditModalOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
                        <h2 className="text-xl font-bold mb-4">Edit User: {editingUser.full_name}</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleAction(`/admin/users/${editingUser.id}`, 'PUT', editForm); }} className="space-y-4">
                            <div><label className="block text-sm font-bold mb-1">Full Name</label><input type="text" value={editForm.full_name} onChange={e => setEditForm({ ...editForm, full_name: e.target.value })} className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" /></div>
                            <div><label className="block text-sm font-bold mb-1">Phone Number</label><input type="text" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" /></div>
                            <div><label className="block text-sm font-bold mb-1">New Password (leave blank to keep current)</label><input type="password" value={editForm.password} onChange={e => setEditForm({ ...editForm, password: e.target.value })} className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder="••••••••" /></div>
                            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700">Save Changes</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}