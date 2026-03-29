import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, CheckCircle2, Search, AlertTriangle, Activity, Pill, UserPlus, ChevronDown, ChevronUp, ArrowDown } from 'lucide-react';

const remedies = [
    // --- Cold, Cough & Respiratory ---
    { condition: "Viral Cold & Flu", meds: "Paracetamol (Napa/Ace) for fever, Antihistamine (Alatrol/Fexo) for runny nose.", advice: "Drink warm fluids, inhale steam, and get plenty of rest." },
    { condition: "Dry Cough", meds: "Dextromethorphan syrup (e.g., Tof / Adovas).", advice: "Drink warm water with honey and ginger. Avoid cold beverages." },
    { condition: "Wet/Chesty Cough", meds: "Ambroxol or Bromhexine syrup (e.g., Mucosol).", advice: "Drink plenty of water to help thin the mucus. Steam inhalation helps." },
    { condition: "Sore Throat", meds: "Povidone-Iodine gargle (Viodin) or soothing lozenges.", advice: "Gargle with warm salt water 3-4 times a day. Avoid spicy food." },
    { condition: "Mild Sinusitis", meds: "Nasal decongestant drops (Antazol) for max 3-5 days.", advice: "Apply a warm compress over the face. Do not use nasal drops long-term." },
    { condition: "Seasonal Allergies", meds: "Fexofenadine (Telfast/Fexo) or Cetirizine 10mg once daily.", advice: "Identify and avoid triggers like dust or pollen. Wear a mask outdoors." },

    // --- Gastrointestinal & Stomach ---
    { condition: "Mild Gastritis (Acidity)", meds: "Omeprazole (Seclo) or Esomeprazole (Maxpro) 20mg before meal.", advice: "Avoid spicy, oily, or highly acidic foods. Do not lie down immediately after eating." },
    { condition: "Acute Diarrhea", meds: "Oral Rehydration Salts (SMC ORS) after every loose motion. Zinc sulfate.", advice: "Stay strictly hydrated. Avoid milk and heavy meals. Eat soft rice and bananas." },
    { condition: "Severe Diarrhea (Non-bloody)", meds: "Loperamide (Imotil) 2mg - maximum 4 capsules a day.", advice: "Only use if no fever or blood in stool. Prioritize ORS." },
    { condition: "Constipation", meds: "Lactulose syrup (Avolac) or Bisacodyl tablet at night.", advice: "Increase water intake to 3L/day. Eat high-fiber foods like papaya and vegetables." },
    { condition: "Indigestion / Fullness", meds: "Domperidone (Omidon/Motigut) 10mg before meals.", advice: "Eat smaller, frequent meals. Walk for 10 minutes after eating." },
    { condition: "Stomach Cramps / Spasms", meds: "Hyoscine Butylbromide (Butapan/Hyospan).", advice: "Apply a hot water bag to the stomach area. Rest." },
    { condition: "Motion Sickness", meds: "Promethazine (Phenergan) or Joytrip 30 mins before travel.", advice: "Avoid reading in the car. Look straight ahead at the horizon." },
    { condition: "Food Poisoning (Mild)", meds: "ORS for hydration, Domperidone for vomiting.", advice: "Stick to a liquid diet for 24 hours. See a doctor if fever develops." },
    { condition: "Hemorrhoids (Piles) Pain", meds: "Lidocaine/Hydrocortisone ointment externally. Lactulose for soft stool.", advice: "Take warm sitz baths for 15 minutes. Avoid straining during bowel movements." },

    // --- Pain & Inflammation ---
    { condition: "Tension Headache", meds: "Paracetamol 500mg or Paracetamol+Caffeine (Napa Extra).", advice: "Rest in a quiet, dark room. Massage temples gently. Check your eyesight." },
    { condition: "Migraine Attack", meds: "Naproxen (Naprosyn) or Tolfenamic Acid (Tufnil) at onset.", advice: "Sleep in a dark room. Identify triggers (stress, caffeine, lack of sleep)." },
    { condition: "Toothache", meds: "Ketorolac (Rolac/Torax) 10mg. (Max 5 days).", advice: "Rinse mouth with warm salt water. Visit a dentist as soon as possible." },
    { condition: "Muscle Sprain / Strain", meds: "Ibuprofen 400mg. Diclofenac gel locally.", advice: "RICE method: Rest, Ice (first 24h), Compression, Elevation." },
    { condition: "Lower Back Pain", meds: "Aceclofenac (Flexi) or Naproxen. Muscle relaxant ointment.", advice: "Avoid heavy lifting. Use a firm mattress. Do gentle stretching." },
    { condition: "Neck Stiffness", meds: "Ibuprofen or Paracetamol. Pain relief spray (Moov/Volini).", advice: "Use a supportive pillow. Apply a warm compress. Avoid looking down at phones." },
    { condition: "Period Cramps (Dysmenorrhea)", meds: "Drotaverine (Spasmodin) or Naproxen.", advice: "Place a hot water bottle on the lower abdomen. Drink warm herbal tea." },
    { condition: "Joint Pain (Mild Arthritis)", meds: "Diclofenac (Voltalin) or Aceclofenac after meals.", advice: "Keep joints warm. Engage in low-impact exercises like walking or swimming." },
    { condition: "Earache", meds: "Paracetamol or Ibuprofen for pain relief.", advice: "Do not put oil or water in the ear. See an ENT specialist to check for infection." },

    // --- Skin & Dermatology ---
    { condition: "Insect Bite / Sting", meds: "Hydrocortisone 1% cream locally. Antihistamine if itchy.", advice: "Wash with soap and water. Apply ice to reduce swelling. Do not scratch." },
    { condition: "Mild Sunburn", meds: "Aloe Vera gel. Paracetamol for pain.", advice: "Take cool showers. Drink plenty of water. Avoid further sun exposure." },
    { condition: "Fungal Infection (Ringworm)", meds: "Clotrimazole or Terbinafine cream applied twice daily.", advice: "Keep the area dry and clean. Wear loose, cotton clothing. Do not share towels." },
    { condition: "Athlete's Foot", meds: "Miconazole or Ketoconazole cream.", advice: "Dry between toes thoroughly after washing. Wear cotton socks." },
    { condition: "Mild Acne / Pimples", meds: "Salicylic Acid face wash or Adapalene gel (night only).", advice: "Do not pop pimples. Wash face twice daily. Use oil-free sunscreen." },
    { condition: "Dandruff (Severe)", meds: "Ketoconazole 2% shampoo (Ketocon/Nizoral).", advice: "Leave shampoo on scalp for 5 mins before rinsing. Use twice a week." },
    { condition: "Urticaria (Hives/Rash)", meds: "Desloratadine (Deslor) or Fexofenadine.", advice: "Take a cool bath. Wear loose clothing. Avoid the suspected allergen." },
    { condition: "Minor Cuts & Scrapes", meds: "Povidone-Iodine (Viodin) ointment. Bandaid.", advice: "Wash hands first. Clean wound with clean water. Keep it covered." },
    { condition: "Minor Burns", meds: "Silver Sulfadiazine cream (Burnsil).", advice: "Run under cool (not ice) water for 10-15 mins immediately. Do not pop blisters." },
    { condition: "Chapped Lips", meds: "Petroleum jelly or medicated lip balm.", advice: "Do not lick your lips. Stay hydrated. Apply balm frequently." },

    // --- Eye & Ear ---
    { condition: "Dry Eyes", meds: "Artificial tears / Hypromellose eye drops (Tear/Art-Tear).", advice: "Blink often when using screens. Use the 20-20-20 rule for eye breaks." },
    { condition: "Mild Conjunctivitis (Pink Eye)", meds: "Chloramphenicol eye drops (if bacterial). Artificial tears.", advice: "Wash hands frequently. Do not touch the other eye. Do not share towels." },
    { condition: "Stye (Eye Bump)", meds: "Antibiotic eye ointment (consult pharmacist).", advice: "Apply a warm compress for 10 mins, 4 times a day. Never squeeze it." },
    { condition: "Ear Wax Blockage", meds: "Olive oil drops or Sodium Bicarbonate ear drops.", advice: "Put 2-3 drops for a few days to soften wax. Never use cotton buds (Q-tips)." },

    // --- First Aid & Lifestyle ---
    { condition: "Mouth Ulcers", meds: "Choline Salicylate gel (Mukitigel) applied to the ulcer.", advice: "Avoid spicy and sour foods. Drink plenty of water. Manage stress." },
    { condition: "Iron Deficiency (Weakness)", meds: "Iron + Folic Acid capsule (Ipec-Plus) after food.", advice: "Eat spinach, red meat, and liver. Take with Vitamin C (lemon) for better absorption." },
    { condition: "Vitamin D Deficiency", meds: "Cholecalciferol 40,000 IU (D-Cap) once a week (max 8 weeks).", advice: "Get 15-20 mins of direct sunlight daily. Eat egg yolks and fish." },
    { condition: "Mild Insomnia", meds: "Melatonin 3mg at night (short term).", advice: "Avoid screens 1 hour before bed. Cut caffeine after 3 PM. Keep room cool." },
    { condition: "Hangover", meds: "ORS for hydration, Paracetamol for headache, Antacid for stomach.", advice: "Drink massive amounts of water. Eat a banana to restore potassium. Sleep." },
    { condition: "Heat Exhaustion", meds: "ORS (Orsaline).", advice: "Move to a cool place. Loosen clothes. Sponge body with cool water." },
    { condition: "Minor UTI (Burning Urine)", meds: "Potassium Citrate syrup (Urocol) to alkalinize urine.", advice: "Drink 3-4 liters of water. Do not hold urine. See a doctor if fever occurs." },
    { condition: "Yeast Infection (Mild)", meds: "Fluconazole 150mg (single dose) - Consult pharmacist.", advice: "Wear breathable cotton underwear. Avoid scented soaps in the genital area." },
    { condition: "General Fatigue / Lethargy", meds: "Multivitamin & Mineral tablet (Bextram Gold) daily.", advice: "Ensure 7-8 hours of sleep. Eat a balanced diet. Exercise moderately." },
    { condition: "Morning Sickness (Mild)", meds: "Meclizine + Pyridoxine (Pregox) at night.", advice: "Eat dry crackers before getting out of bed. Eat small, frequent meals." },
    { condition: "Altitude Sickness", meds: "Acetazolamide (start 1 day before climbing).", advice: "Ascend slowly. Drink plenty of water. Avoid alcohol while climbing." },
    { condition: "Jet Lag", meds: "Melatonin 3mg at bedtime in the new time zone.", advice: "Try to sleep only at nighttime in the new location. Get morning sunlight." }
];

export default function CommonPrescriptions() {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedCards, setExpandedCards] = useState([]);

    // --- NEW: Scroll State ---
    const [isAtBottom, setIsAtBottom] = useState(false);

    // Track user scroll position
    useEffect(() => {
        const handleScroll = () => {
            // Check if user is within 100px of the bottom of the page
            const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 100;
            setIsAtBottom(bottom);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check initially

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isLoggedIn = !!localStorage.getItem('token');
    const role = localStorage.getItem('role') || 'patient';
    const backRoute = isLoggedIn ? `/${role}` : '/';
    const backText = isLoggedIn ? 'Back to Dashboard' : 'Back to Home';

    const filteredRemedies = remedies.filter(item =>
        item.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.meds.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    };

    const toggleExpand = (conditionName) => {
        setExpandedCards(prev =>
            prev.includes(conditionName)
                ? prev.filter(name => name !== conditionName)
                : [...prev, conditionName]
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 relative">

            {/* --- Floating "Scroll to Bottom" Button (Now fades out at bottom) --- */}
            <button
                onClick={scrollToBottom}
                className={`fixed bottom-8 right-8 p-4 bg-amber-500 text-white rounded-full shadow-2xl hover:bg-amber-600 hover:scale-110 hover:shadow-amber-500/50 transition-all duration-300 z-50 group border-2 border-white ${isAtBottom ? 'opacity-0 translate-y-10 pointer-events-none' : 'opacity-100 translate-y-0'}`} aria-label="Scroll to bottom"
                title="Go to Next Steps"
            >
                <ArrowDown className="w-6 h-6 group-hover:animate-bounce" />
            </button>

            <div className="max-w-5xl mx-auto">
                <Link to={backRoute} className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" /> {backText}
                </Link>

                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm mb-8 flex items-start">
                    <AlertTriangle className="w-6 h-6 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-amber-800 font-bold text-sm">Medical Disclaimer</h3>
                        <p className="text-amber-700 text-xs mt-1 leading-relaxed">
                            This guide provides Over-The-Counter (OTC) advice for <strong>minor, common ailments only</strong>.
                            If symptoms persist for more than 3 days, or if you experience high fever, severe pain, or bleeding,
                            stop medication immediately and consult a registered physician.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center">
                        <div className="p-3 bg-amber-100 text-amber-600 rounded-xl mr-4 shrink-0">
                            <FileText className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Common Prescriptions</h1>
                            <p className="text-slate-500 mt-1">Standard OTC guidelines for {remedies.length} minor, everyday ailments.</p>
                        </div>
                    </div>
                </div>

                <div className="relative mb-10">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for a condition (e.g., Headache, Fever, Allergy)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all text-slate-700"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    {filteredRemedies.length > 0 ? (
                        filteredRemedies.map((item, index) => {
                            const isExpanded = expandedCards.includes(item.condition);

                            return (
                                <div key={index} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden">
                                    <div
                                        onClick={() => toggleExpand(item.condition)}
                                        className="p-6 cursor-pointer flex justify-between items-center bg-white hover:bg-slate-50 transition-colors"
                                    >
                                        <h3 className="text-lg font-bold text-amber-600 flex items-center">
                                            <CheckCircle2 className="w-5 h-5 mr-2 shrink-0" />
                                            {item.condition}
                                        </h3>
                                        {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
                                    </div>

                                    {isExpanded && (
                                        <div className="p-6 pt-0 animate-in slide-in-from-top-2 fade-in duration-200 border-t border-slate-100 mt-2">
                                            <div className="mb-4 pt-4">
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Standard Meds</span>
                                                <p className="text-slate-700 font-medium">{item.meds}</p>
                                            </div>
                                            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100/50">
                                                <span className="text-xs font-bold text-amber-800/70 uppercase tracking-wider block mb-1">Doctor's Advice</span>
                                                <p className="text-amber-900 text-sm leading-relaxed">{item.advice}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-1 md:col-span-2 text-center py-16 bg-white rounded-2xl border border-slate-200">
                            <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 font-medium text-lg">No remedies found for "{searchTerm}"</p>
                            <p className="text-slate-400 text-sm mt-1">Try searching for broader terms like "Pain" or "Stomach".</p>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Still not feeling well?</h3>
                    <p className="text-slate-500 mb-8 max-w-2xl mx-auto">
                        OTC medications are only for temporary relief. If you aren't sure about your symptoms or need detailed dosage instructions, use our other free tools or consult a professional.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link to="/self-diagnosis" className="flex items-center justify-center p-4 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold transition-colors">
                            <Activity className="w-5 h-5 mr-2" /> Self-Diagnosis Assistant
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