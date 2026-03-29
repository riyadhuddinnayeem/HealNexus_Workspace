import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    HeartPulse, Search, ArrowRight, ShieldCheck, Calendar, FileText,
    Video, Phone, Star, MapPin, Sliders, Menu, X,
    User, Stethoscope, Shield, ChevronRight, Activity, PlusCircle
} from 'lucide-react';
import Footer from '../components/layout/Footer';

// Mock Data for Popular Doctors on Landing Page
const popularDoctors = [
    { id: 1, name: "Dr. Hasan Mahmud", specialty: "Cardiologist", rating: "4.9", reviews: 124, image: "https://randomuser.me/api/portraits/men/32.jpg" },
    { id: 2, name: "Dr. Nusrat Jahan", specialty: "Gynecologist", rating: "4.8", reviews: 156, image: "https://randomuser.me/api/portraits/women/33.jpg" },
    { id: 3, name: "Dr. Farhana Amin", specialty: "Neurologist", rating: "4.9", reviews: 98, image: "https://randomuser.me/api/portraits/women/44.jpg" },
    { id: 4, name: "Dr. Salma Begum", specialty: "Pediatrician", rating: "5.0", reviews: 210, image: "https://randomuser.me/api/portraits/women/68.jpg" },
];

export default function Home() {
    const navigate = useNavigate();

    // States
    const [theme, setTheme] = useState('normal');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [area, setArea] = useState('');
    const [rating, setRating] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const isModern = theme === 'modern';

    // Dynamic Theme Classes
    const bgBase = isModern ? 'bg-[#020817]' : 'bg-white';
    const textBase = isModern ? 'text-slate-100' : 'text-slate-900';
    const textMuted = isModern ? 'text-slate-400' : 'text-slate-500';
    const bgCard = isModern ? 'bg-[#0f172a]' : 'bg-slate-50';
    const borderColor = isModern ? 'border-slate-800' : 'border-slate-200';
    const navbarBg = isModern ? 'bg-[#020817]/90' : 'bg-white/90';

    // Search Function
    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchQuery) params.append('query', searchQuery);
        if (area) params.append('area', area);
        if (rating) params.append('rating', rating);
        navigate(`/doctors?${params.toString()}`);
        setShowFilters(false);
    };

    // Features & Self-Service Tools Data (Now with dedicated links!)
    const features = [
        {
            id: 'scheduling',
            title: 'Smart Scheduling',
            icon: Calendar,
            colorClass: 'text-blue-500',
            bgClass: 'bg-blue-500/10',
            summary: 'Book appointments with top specialists instantly. Skip the waiting room.',
            link: '/doctors'
        },
        {
            id: 'records',
            title: 'Centralized Records',
            icon: FileText,
            colorClass: 'text-purple-500',
            bgClass: 'bg-purple-500/10',
            summary: 'Access your entire medical history, labs, and notes in one secure vault.',
            link: '/patient'
        },
        {
            id: 'video',
            title: 'Video Consultations',
            icon: Video,
            colorClass: 'text-emerald-500',
            bgClass: 'bg-emerald-500/10',
            summary: 'Connect with healthcare professionals securely from the comfort of home.',
            link: '/video-consult'
        },
        {
            id: 'diagnosis',
            title: 'Self-Diagnosis Assistant',
            icon: Activity,
            colorClass: 'text-rose-500',
            bgClass: 'bg-rose-500/10',
            summary: 'Check your symptoms instantly and get triage advice before booking.',
            link: '/self-diagnosis'
        },
        {
            id: 'prescription',
            title: 'Common Prescriptions',
            icon: FileText,
            colorClass: 'text-amber-500',
            bgClass: 'bg-amber-500/10',
            summary: 'Standard OTC medical guidelines and remedies for minor ailments.',
            link: '/common-prescriptions'
        },
        {
            id: 'pills',
            title: 'Pill Directory & Dosage',
            icon: PlusCircle,
            colorClass: 'text-cyan-500',
            bgClass: 'bg-cyan-500/10',
            summary: 'Quick reference guide for common medications and age-based dosages.',
            link: '/pill-directory'
        }
    ];

    return (
        <div className={`min-h-screen font-sans transition-colors duration-500 ${bgBase} ${textBase}`}>

            {/* 1. Top Announcement Bar & Theme Switcher */}
            <div className={`${isModern ? 'bg-blue-950 text-blue-200' : 'bg-slate-900 text-slate-300'} py-2 px-6 text-xs font-medium flex flex-col sm:flex-row justify-between items-center transition-colors duration-500`}>
                <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                    <span className="flex items-center"><Phone className="w-3 h-3 mr-1.5 text-emerald-400" /> National Helpline: 16263</span>
                    <span className="flex items-center hidden md:flex"><ShieldCheck className="w-3 h-3 mr-1.5 text-emerald-400" /> Verified BD Medical Council Doctors</span>
                </div>

                <div className="flex items-center bg-black/40 rounded-full p-1 border border-white/10">
                    <button onClick={() => setTheme('normal')} className={`px-3 py-1 rounded-full transition-all ${!isModern ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}>Normal</button>
                    <button onClick={() => setTheme('modern')} className={`px-3 py-1 rounded-full transition-all ${isModern ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>Modern</button>
                </div>
            </div>

            {/* 2. Sticky Navbar */}
            <header className={`sticky top-0 z-40 backdrop-blur-md border-b ${borderColor} ${navbarBg} transition-all shadow-sm`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center cursor-pointer mr-6">
                        <HeartPulse className="w-8 h-8 text-blue-600 mr-2" />
                        <span className="text-2xl font-bold tracking-tight hidden lg:block">HealNexus</span>
                    </div>

                    <div className="hidden md:flex flex-1 max-w-3xl relative mr-6">
                        <form onSubmit={handleSearch} className={`w-full flex items-center ${bgCard} border ${borderColor} rounded-full px-2 py-1.5 shadow-inner transition-all focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent`}>
                            <div className="flex items-center flex-1 px-3">
                                <Search className={`w-4 h-4 ${textMuted} mr-2 flex-shrink-0`} />
                                <input type="text" placeholder="Search specialties, doctors..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`w-full bg-transparent border-none outline-none text-sm placeholder-${isModern ? 'slate-500' : 'slate-400'}`} />
                            </div>
                            <div className={`h-5 w-px ${isModern ? 'bg-slate-700' : 'bg-slate-300'} mx-1`}></div>
                            <button type="button" onClick={() => setShowFilters(!showFilters)} className={`flex items-center px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${showFilters ? 'bg-blue-100 text-blue-700' : `${textMuted} hover:text-blue-500`}`}>
                                <Sliders className="w-4 h-4 mr-1.5" /> Filter
                            </button>
                            <button type="submit" className="bg-blue-600 text-white rounded-full p-2 ml-1 hover:bg-blue-700 transition-colors shadow-sm"><ArrowRight className="w-4 h-4" /></button>
                        </form>

                        {showFilters && (
                            <div className={`absolute top-full right-0 mt-3 w-72 ${bgBase} border ${borderColor} rounded-2xl shadow-xl p-5 z-50`}>
                                <h4 className={`font-semibold mb-4 border-b pb-2 ${borderColor}`}>Refine Search</h4>
                                <div className="mb-4">
                                    <label className={`block text-xs font-medium ${textMuted} mb-1.5 flex items-center`}><MapPin className="w-3.5 h-3.5 mr-1" /> Select Area</label>
                                    <select value={area} onChange={(e) => setArea(e.target.value)} className={`w-full ${bgCard} border ${borderColor} rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer`}>
                                        <option value="">All over Bangladesh</option>
                                        <option value="Dhaka">Dhaka</option>
                                        <option value="Chittagong">Chittagong</option>
                                        <option value="Sylhet">Sylhet</option>
                                        <option value="Rajshahi">Rajshahi</option>
                                        <option value="Khulna">Khulna</option>
                                    </select>
                                </div>
                                <div className="mb-6">
                                    <label className={`block text-xs font-medium ${textMuted} mb-1.5 flex items-center`}><Star className="w-3.5 h-3.5 mr-1" /> Minimum Rating</label>
                                    <select value={rating} onChange={(e) => setRating(e.target.value)} className={`w-full ${bgCard} border ${borderColor} rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer`}>
                                        <option value="">Any Rating</option>
                                        <option value="5">5 Stars Only</option>
                                        <option value="4+">4 Stars & Above</option>
                                        <option value="3+">3 Stars & Above</option>
                                    </select>
                                </div>
                                <button onClick={handleSearch} className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">Apply Filters</button>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-4 flex-shrink-0">
                        <div className="hidden sm:flex items-center space-x-4">
                            <Link to="/login" className={`text-sm font-semibold hover:text-blue-600 transition-colors ${isModern ? 'text-slate-300' : 'text-slate-700'}`}>Log In</Link>
                            <Link to="/register" className="text-sm font-semibold text-white bg-blue-600 px-5 py-2.5 rounded-full hover:bg-blue-700 shadow-md hover:shadow-lg transition-all">Sign Up Free</Link>
                        </div>
                        <button onClick={() => setIsMenuOpen(true)} className={`p-2 rounded-full border ${borderColor} ${bgCard} hover:bg-blue-50 transition-colors`}>
                            <Menu className={`w-5 h-5 ${textBase}`} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Slide-out Menu Drawer */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsMenuOpen(false)}></div>
                    <div className={`relative w-80 h-full shadow-2xl flex flex-col ${bgBase} border-l ${borderColor} animate-in slide-in-from-right duration-300`}>
                        <div className={`flex items-center justify-between p-6 border-b ${borderColor}`}>
                            <div className="flex items-center"><HeartPulse className="w-6 h-6 text-blue-600 mr-2" /><span className="text-xl font-bold tracking-tight">System Menu</span></div>
                            <button onClick={() => setIsMenuOpen(false)} className={`p-2 rounded-full ${bgCard} hover:text-red-500 transition-colors`}><X className="w-5 h-5" /></button>
                        </div>

                        <div className="p-6 flex-1 overflow-y-auto space-y-8">
                            {/* NEW: Features Section in Mobile Menu */}
                            <div>
                                <h4 className={`text-xs font-bold uppercase tracking-wider ${textMuted} mb-3`}>Features & Tools</h4>
                                <div className="space-y-2">
                                    {features.map((feature) => {
                                        const Icon = feature.icon;
                                        return (
                                            <Link
                                                key={feature.id}
                                                to={feature.link}
                                                className={`flex items-center px-4 py-3 rounded-xl ${bgCard} hover:bg-blue-600 hover:text-white transition-all group`}
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <Icon className={`w-5 h-5 mr-3 ${feature.colorClass} group-hover:text-white`} />
                                                <span className="font-medium text-sm">{feature.title}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <h4 className={`text-xs font-bold uppercase tracking-wider ${textMuted} mb-3`}>Public Directory</h4>
                                <div className="space-y-2">
                                    <Link to="/doctors" className={`flex items-center px-4 py-3 rounded-xl ${bgCard} hover:bg-blue-600 hover:text-white transition-all group`} onClick={() => setIsMenuOpen(false)}>
                                        <Search className="w-5 h-5 mr-3 text-blue-500 group-hover:text-white" /><span className="font-medium text-sm">Find a Doctor</span>
                                    </Link>
                                </div>
                            </div>

                            <div>
                                <h4 className={`text-xs font-bold uppercase tracking-wider ${textMuted} mb-3`}>Secure Portals (Protected)</h4>
                                <div className="space-y-2">
                                    <Link to="/patient" className={`flex items-center px-4 py-3 rounded-xl ${bgCard} hover:bg-blue-600 hover:text-white transition-all group`} onClick={() => setIsMenuOpen(false)}>
                                        <User className="w-5 h-5 mr-3 text-emerald-500 group-hover:text-white" /><span className="font-medium text-sm">Patient Dashboard</span>
                                    </Link>
                                    <Link to="/doctor" className={`flex items-center px-4 py-3 rounded-xl ${bgCard} hover:bg-blue-600 hover:text-white transition-all group`} onClick={() => setIsMenuOpen(false)}>
                                        <Stethoscope className="w-5 h-5 mr-3 text-blue-500 group-hover:text-white" /><span className="font-medium text-sm">Doctor Portal</span>
                                    </Link>
                                    <Link to="/admin" className={`flex items-center px-4 py-3 rounded-xl ${bgCard} hover:bg-blue-600 hover:text-white transition-all group`} onClick={() => setIsMenuOpen(false)}>
                                        <Shield className="w-5 h-5 mr-3 text-purple-500 group-hover:text-white" /><span className="font-medium text-sm">Admin God-Mode</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. Hero Section */}
            <main className="relative overflow-hidden">
                <div className={`absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none transition-colors duration-700 ${isModern ? 'bg-blue-600' : 'bg-blue-200'}`}></div>
                <div className={`absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full blur-3xl opacity-30 pointer-events-none transition-colors duration-700 ${isModern ? 'bg-emerald-600' : 'bg-emerald-100'}`}></div>

                <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                    <div className="space-y-8">
                        <h1 className="text-5xl lg:text-6xl font-extrabold leading-[1.15] tracking-tight">
                            Find the right doctor. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-400">Book instantly.</span>
                        </h1>
                        <p className={`text-lg max-w-lg leading-relaxed ${textMuted}`}>
                            Take control of your healthcare in Bangladesh. Search top-rated specialists in Dhaka, Chittagong, and beyond. Book virtual or in-person visits seamlessly.
                        </p>
                        <Link to="/doctors" className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30 transition-all">
                            Browse Top Doctors <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    </div>
                    <div className="relative">
                        <img src="https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&q=80&w=800" alt="Doctor" className={`rounded-3xl shadow-2xl border-4 ${isModern ? 'border-slate-800 shadow-blue-900/20' : 'border-white'}`} />
                    </div>
                </div>
            </main>

            {/* 4. Popular Doctors Section */}
            <section className={`py-20 border-y ${borderColor} ${isModern ? 'bg-[#0a0f1c]' : 'bg-slate-50'} transition-colors duration-500`}>
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-3">Top Rated Specialists</h2>
                            <p className={textMuted}>Highly recommended by patients across Bangladesh.</p>
                        </div>
                        <Link to="/doctors" className={`hidden md:flex items-center text-sm font-semibold mt-4 md:mt-0 ${isModern ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>
                            View all doctors <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {popularDoctors.map((doc) => (
                            <div key={doc.id} className={`p-5 rounded-2xl border ${borderColor} ${bgBase} hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group`}>
                                <div className="flex items-center space-x-4 mb-4">
                                    <img src={doc.image} alt={doc.name} className={`w-14 h-14 rounded-full object-cover border-2 ${isModern ? 'border-slate-700' : 'border-blue-100'}`} />
                                    <div>
                                        <h3 className="font-bold text-sm">{doc.name}</h3>
                                        <p className={`text-xs font-medium mt-0.5 ${isModern ? 'text-blue-400' : 'text-blue-600'}`}>{doc.specialty}</p>
                                    </div>
                                </div>

                                <div className={`flex items-center justify-between text-xs mb-5 ${textMuted}`}>
                                    <div className="flex items-center text-amber-400">
                                        <Star className="w-3.5 h-3.5 fill-current mr-1" />
                                        <span className={`font-bold ${textBase}`}>{doc.rating}</span>
                                    </div>
                                    <span>{doc.reviews} Reviews</span>
                                </div>

                                <Link
                                    to={`/doctors?query=${doc.specialty}`}
                                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${isModern
                                        ? 'bg-blue-900/30 text-blue-300 group-hover:bg-blue-600 group-hover:text-white'
                                        : 'bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white'
                                        }`}
                                >
                                    View {doc.specialty} Dept <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 text-center md:hidden">
                        <Link to="/doctors" className={`inline-flex items-center text-sm font-semibold ${isModern ? 'text-blue-400' : 'text-blue-600'}`}>
                            View all doctors <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* 5. Interactive Feature Cards & Self-Service Tools */}
            <section id="services" className={`py-24 ${isModern ? 'bg-[#0f172a]' : 'bg-white'}`}>
                <div className="max-w-6xl mx-auto px-6">

                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">Empowering Your Health Decisions</h2>
                        <p className={textMuted}>
                            From booking top specialists to instant self-service medical guides, HealNexus puts you entirely in control.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature) => {
                            const Icon = feature.icon;

                            return (
                                <Link
                                    key={feature.id}
                                    to={feature.link}
                                    className={`group block p-8 rounded-3xl border ${borderColor} ${bgBase} hover:-translate-y-1 hover:shadow-xl hover:border-blue-400 transition-all duration-300`}
                                >
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${feature.bgClass} ${feature.colorClass}`}>
                                        <Icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                    <p className={`${textMuted} leading-relaxed mb-6 text-sm`}>
                                        {feature.summary}
                                    </p>
                                    <div className={`flex items-center text-sm font-semibold ${isModern ? 'text-blue-400' : 'text-blue-600'}`}>
                                        Try it out <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                </div>
            </section>

            {/* 6. Footer */}
            <Footer />

        </div>
    );
}