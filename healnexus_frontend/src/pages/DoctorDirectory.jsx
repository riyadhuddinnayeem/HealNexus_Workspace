import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
    Star, MapPin, Search, CalendarPlus, Award, Clock,
    HeartPulse, Menu, Phone, ShieldCheck, ChevronLeft
} from 'lucide-react';
import Footer from '../components/layout/Footer';

// Expanded Mock Data for Bangladesh Context (Multiple doctors per department)
const mockDoctors = [
    // Cardiologists
    { id: 1, name: "Dr. Hasan Mahmud", specialty: "Cardiology", area: "Dhaka", hospital: "Square Hospitals", rating: 4.9, reviews: 124, fee: "1500 BDT", image: "https://randomuser.me/api/portraits/men/32.jpg" },
    { id: 7, name: "Dr. Ahmed Reza", specialty: "Cardiology", area: "Chittagong", hospital: "Evercare Hospital", rating: 4.6, reviews: 89, fee: "1200 BDT", image: "https://randomuser.me/api/portraits/men/55.jpg" },

    // Gynecologists
    { id: 6, name: "Dr. Nusrat Jahan", specialty: "Gynecology", area: "Dhaka", hospital: "Labaid Specialized", rating: 4.7, reviews: 156, fee: "1500 BDT", image: "https://randomuser.me/api/portraits/women/33.jpg" },
    { id: 8, name: "Dr. Fatima Rahman", specialty: "Gynecology", area: "Sylhet", hospital: "Al Noor Hospital", rating: 4.9, reviews: 201, fee: "1000 BDT", image: "https://randomuser.me/api/portraits/women/45.jpg" },

    // Neurologists
    { id: 2, name: "Dr. Farhana Amin", specialty: "Neurology", area: "Dhaka", hospital: "Evercare Hospital", rating: 4.8, reviews: 98, fee: "2000 BDT", image: "https://randomuser.me/api/portraits/women/44.jpg" },

    // Orthopedics
    { id: 3, name: "Dr. Tariqul Islam", specialty: "Orthopedics", area: "Chittagong", hospital: "Apollo Imperial", rating: 4.5, reviews: 76, fee: "1200 BDT", image: "https://randomuser.me/api/portraits/men/46.jpg" },
    { id: 9, name: "Dr. Kamal Hossain", specialty: "Orthopedics", area: "Dhaka", hospital: "BRB Hospitals", rating: 4.3, reviews: 45, fee: "1000 BDT", image: "https://randomuser.me/api/portraits/men/78.jpg" },

    // Pediatricians
    { id: 4, name: "Dr. Salma Begum", specialty: "Pediatrics", area: "Sylhet", hospital: "Mount Adora", rating: 5.0, reviews: 210, fee: "1000 BDT", image: "https://randomuser.me/api/portraits/women/68.jpg" },

    // Dermatologists
    { id: 5, name: "Dr. Rafiq Ahmed", specialty: "Dermatology", area: "Rajshahi", hospital: "Popular Diagnostic", rating: 3.8, reviews: 45, fee: "800 BDT", image: "https://randomuser.me/api/portraits/men/22.jpg" },
];

export default function DoctorDirectory() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [groupedDoctors, setGroupedDoctors] = useState({});
    const [totalFiltered, setTotalFiltered] = useState(0);

    // Theme State
    const [theme, setTheme] = useState('normal');
    const isModern = theme === 'modern';

    // Dynamic Theme Classes
    const bgBase = isModern ? 'bg-[#020817]' : 'bg-slate-50';
    const textBase = isModern ? 'text-slate-100' : 'text-slate-900';
    const textMuted = isModern ? 'text-slate-400' : 'text-slate-500';
    const bgCard = isModern ? 'bg-[#0f172a]' : 'bg-white';
    const borderColor = isModern ? 'border-slate-800' : 'border-slate-200';
    const navbarBg = isModern ? 'bg-[#020817]/90' : 'bg-white/90';

    // Read URL Parameters
    const queryParam = searchParams.get('query') || '';
    const areaParam = searchParams.get('area') || '';
    const ratingParam = searchParams.get('rating') || '';

    // Filter & Group Logic
    useEffect(() => {
        let filtered = mockDoctors;

        // 1. Filter by Search Query
        if (queryParam) {
            const lowerQuery = queryParam.toLowerCase();
            filtered = filtered.filter(doc =>
                doc.name.toLowerCase().includes(lowerQuery) ||
                doc.specialty.toLowerCase().includes(lowerQuery)
            );
        }

        // 2. Filter by Area
        if (areaParam) {
            filtered = filtered.filter(doc => doc.area === areaParam);
        }

        // 3. Filter by Rating
        if (ratingParam) {
            const minRating = parseFloat(ratingParam.replace('+', ''));
            filtered = filtered.filter(doc => doc.rating >= minRating);
        }

        setTotalFiltered(filtered.length);

        // 4. Group the remaining doctors by their specialty
        const grouped = filtered.reduce((acc, doc) => {
            if (!acc[doc.specialty]) {
                acc[doc.specialty] = [];
            }
            acc[doc.specialty].push(doc);
            return acc;
        }, {});

        // Sort the keys alphabetically so departments are in order
        const sortedGrouped = Object.keys(grouped).sort().reduce(
            (obj, key) => {
                obj[key] = grouped[key];
                return obj;
            },
            {}
        );

        setGroupedDoctors(sortedGrouped);
    }, [queryParam, areaParam, ratingParam]);

    return (
        <div className={`min-h-screen font-sans transition-colors duration-500 ${bgBase} ${textBase} flex flex-col`}>

            {/* Top Announcement Bar & Theme Switcher */}
            <div className={`${isModern ? 'bg-blue-950 text-blue-200' : 'bg-slate-900 text-slate-300'} py-2 px-6 text-xs font-medium flex flex-col sm:flex-row justify-between items-center transition-colors duration-500`}>
                <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                    <span className="flex items-center"><Phone className="w-3 h-3 mr-1.5 text-emerald-400" /> National Helpline: 16263</span>
                </div>

                <div className="flex items-center bg-black/40 rounded-full p-1 border border-white/10">
                    <button onClick={() => setTheme('normal')} className={`px-3 py-1 rounded-full transition-all ${!isModern ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}>Normal</button>
                    <button onClick={() => setTheme('modern')} className={`px-3 py-1 rounded-full transition-all ${isModern ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>Modern</button>
                </div>
            </div>

            {/* Mini Navbar */}
            <header className={`sticky top-0 z-40 backdrop-blur-md border-b ${borderColor} ${navbarBg} transition-all shadow-sm`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center cursor-pointer">
                        <HeartPulse className="w-8 h-8 text-blue-600 mr-2" />
                        <span className="text-2xl font-bold tracking-tight">HealNexus</span>
                    </Link>
                    <Link to="/" className={`flex items-center text-sm font-medium ${textMuted} hover:text-blue-500 transition-colors`}>
                        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Home
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full">

                {/* Header & Stats */}
                <div className="mb-12">
                    <h1 className="text-4xl font-extrabold mb-3">Specialist Directory</h1>
                    <p className={`text-lg ${textMuted}`}>
                        Showing {totalFiltered} doctors {areaParam && `in ${areaParam}`} {queryParam && `matching "${queryParam}"`}
                    </p>

                    {/* Active Filters Pill */}
                    {(queryParam || areaParam || ratingParam) && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {queryParam && <span className={`px-3 py-1 text-sm rounded-full ${isModern ? 'bg-blue-900/40 text-blue-300 border border-blue-800' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>Search: {queryParam}</span>}
                            {areaParam && <span className={`px-3 py-1 text-sm rounded-full ${isModern ? 'bg-blue-900/40 text-blue-300 border border-blue-800' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>Area: {areaParam}</span>}
                            {ratingParam && <span className={`px-3 py-1 text-sm rounded-full ${isModern ? 'bg-blue-900/40 text-blue-300 border border-blue-800' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>Rating: {ratingParam}</span>}
                            <Link to="/doctors" className={`px-3 py-1 text-sm rounded-full text-red-500 hover:bg-red-50 transition-colors`}>Clear All</Link>
                        </div>
                    )}
                </div>

                {/* Grouped Doctor Display */}
                {totalFiltered > 0 ? (
                    <div className="space-y-16">
                        {Object.entries(groupedDoctors).map(([department, doctors]) => (
                            <section key={department} className="animate-in fade-in slide-in-from-bottom-4 duration-500">

                                {/* Department Header */}
                                <div className={`flex items-center mb-6 border-b ${borderColor} pb-3`}>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${isModern ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                                        <HeartPulse className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">{department} Department</h2>
                                        <p className={`text-sm ${textMuted}`}>{doctors.length} Specialists Available</p>
                                    </div>
                                </div>

                                {/* Doctor Grid for this Department */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {doctors.map(doctor => (
                                        <div key={doctor.id} className={`${bgCard} rounded-2xl border ${borderColor} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col`}>
                                            <div className="flex items-start space-x-4 mb-4">
                                                <img src={doctor.image} alt={doctor.name} className={`w-16 h-16 rounded-full object-cover border-2 ${isModern ? 'border-slate-700' : 'border-blue-100'}`} />
                                                <div>
                                                    <h3 className="text-lg font-bold">{doctor.name}</h3>
                                                    <p className={`font-medium text-sm ${isModern ? 'text-blue-400' : 'text-blue-600'}`}>{doctor.specialty} Specialist</p>
                                                    <div className={`flex items-center text-sm mt-1 ${textMuted}`}>
                                                        <Star className="w-4 h-4 text-amber-400 fill-current mr-1" />
                                                        <span className={`font-bold mr-1 ${textBase}`}>{doctor.rating}</span>
                                                        ({doctor.reviews} reviews)
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`space-y-2 mb-6 flex-grow text-sm ${textMuted}`}>
                                                <div className="flex items-center">
                                                    <MapPin className="w-4 h-4 mr-2" /> {doctor.hospital}, {doctor.area}
                                                </div>
                                                <div className="flex items-center text-emerald-500 font-medium">
                                                    <Award className="w-4 h-4 mr-2" /> BMDC Verified
                                                </div>
                                                <div className="flex items-center">
                                                    <Clock className="w-4 h-4 mr-2" /> Consultation Fee: <span className={`font-bold ml-1 ${textBase}`}>{doctor.fee}</span>
                                                </div>
                                            </div>

                                            <Link to="/login" className={`w-full flex justify-center items-center py-3 rounded-xl font-semibold transition-colors ${isModern ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white'}`}>
                                                <CalendarPlus className="w-4 h-4 mr-2" /> Book Appointment
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                ) : (
                    <div className={`${bgCard} text-center py-20 rounded-3xl border ${borderColor}`}>
                        <Search className={`w-12 h-12 mx-auto mb-4 ${textMuted} opacity-50`} />
                        <h3 className="text-xl font-bold mb-2">No specialists found</h3>
                        <p className={textMuted}>Try adjusting your filters or search terms to find what you're looking for.</p>
                        <Link to="/doctors" className={`mt-6 inline-block font-semibold px-6 py-2 rounded-full transition-colors ${isModern ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>
                            Clear all filters
                        </Link>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}