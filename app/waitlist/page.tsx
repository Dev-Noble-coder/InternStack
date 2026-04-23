"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, CheckCircle2, AlertCircle, Loader2, ArrowLeft, Search, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const UNIVERSITIES = [
  "Abdu Gusau Polytechnic, Talata-Mafara",
  "Abia State Polytechnic, Aba",
  "Abia State University, Uturu",
  "Abubakar Tafawa Balewa University, Bauchi",
  "Abubakar Tatari Ali Polytechnic, Bauchi",
  "Achi Polytechnic, Aba",
  "Achievers University, Owo",
  "Adamawa State Polytechnic, Yola",
  "Adamawa State University, Mubi",
  "Adekunle Ajasin University, Akungba-Akoko",
  "Adeleke University, Ede",
  "Admiralty University of Nigeria, Ibusa",
  "Afe Babalola University, Ado-Ekiti",
  "African University of Science and Technology, Abuja",
  "Ahmadu Bello University, Zaria",
  "Air Force Institute of Technology, Kaduna",
  "Ajayi Crowther University, Oyo",
  "Akperan Orshi College of Agriculture, Yandev",
  "Akwa Ibom State College of Art and Industrial Design, Akim",
  "Akwa Ibom State Polytechnic, Ikot Osurua",
  "Akwa Ibom State University, Ikot Akpaden",
  "Al-Hikmah University, Ilorin",
  "Al-Qalam University, Katsina",
  "Allover Central Polytechnic, Sango-Ota",
  "Alma Institute of Technology, Gombe",
  "Ambrose Alli University, Ekpoma",
  "American University of Nigeria, Yola",
  "Anchor University, Ayobo, Lagos",
  "Animal Husbandry Training School, Central Farm",
  "Ancilla College of Health, Ilorin",
  "Arthur Jarvis University, Akpabuyo",
  "Assanus Polytechnic, Oyo",
  "Atiba University, Oyo",
  "Augustine University, Ilara",
  "Azman College of Medical Sciences, Kano",
  "Babcock University, Ilishan-Remo",
  "Bauchi Institute of Arabic and Islamic Studies, Bauchi",
  "Bayero University, Kano",
  "Baze University, Abuja",
  "Bells University of Technology, Ota",
  "Benue State Polytechnic, Ugbokolo",
  "Benue State University, Makurdi",
  "Benson Idahosa University, Benin City",
  "Bingham University, Karu",
  "Bolingo Radio and Television Academy, Abuja",
  "Borno State University, Maiduguri",
  "Bowen University, Iwo",
  "Caleb University, Imota",
  "Capital City Polytechnic, Abuja",
  "Centre for Management Development",
  "Chrisland University, Owode",
  "Christopher University, Mowe",
  "Chukwuemeka Odumegwu Ojukwu University, Uli",
  "Clifford University, Owerrinta",
  "Coal City University, Enugu",
  "College of Administration and Management Studies, Potiskum",
  "College of Health Technology, Calabar",
  "College of Technology, Igbesa",
  "Confluence College of Education, Pingare",
  "Covenant Polytechnic, Aba",
  "Covenant University, Ota",
  "Crawford University, Igbesa",
  "Crescent University, Abeokuta",
  "Cross River University of Technology, Calabar",
  "Crown Hill University, Eiyenkorin",
  "Crown Polytechnic, Ado-Ekiti",
  "D.S. Adegbenro ICT Polytechnic, Itori",
  "Delta State Polytechnic, Ogwashi-Uku",
  "Delta State Polytechnic, Oghara",
  "Delta State Polytechnic, Ozoro",
  "Delta State School of Marine Technology, Burutu",
  "Delta State University, Abraka",
  "Dominican University, Ibadan",
  "Dominion University, Ibadan",
  "Ebonyi State University, Abakaliki",
  "Edo State Polytechnic, Usen",
  "Edo University, Iyamho",
  "Edwin Clark University, Kiagbodo",
  "Eko University of Medicine and Health Sciences, Ijanikin",
  "Ekiti State University, Ado-Ekiti",
  "Eksa University, Ipara-Remo",
  "Elizade University, Ilara-Mokin",
  "Enugu State Polytechnic, Iwollo",
  "Enugu State University of Science and Technology, Enugu",
  "Evangel University, Akaeze",
  "Federal Polytechnic, Ado-Ekiti",
  "Federal Polytechnic, Akanu Ibiam, Unwana",
  "Federal Polytechnic, Bauchi",
  "Federal Polytechnic, Bali",
  "Federal Polytechnic, Bida",
  "Federal Polytechnic, Damaturu",
  "Federal Polytechnic, Ede",
  "Federal Polytechnic, Ekowe",
  "Federal Polytechnic, Idah",
  "Federal Polytechnic, Ilaro",
  "Federal Polytechnic, Kaura Namoda",
  "Federal Polytechnic, Monguno",
  "Federal Polytechnic, Mubi",
  "Federal Polytechnic, Nasarawa",
  "Federal Polytechnic, Nekede",
  "Federal Polytechnic, Offa",
  "Federal Polytechnic, Oko",
  "Federal Polytechnic, Wannune",
  "Federal School of Surveying, Oyo",
  "Federal University of Agriculture, Abeokuta",
  "Federal University of Petroleum Resources, Effurun",
  "Federal University of Technology, Akure",
  "Federal University of Technology, Minna",
  "Federal University of Technology, Owerri",
  "Federal University, Birnin Kebbi",
  "Federal University, Dutse",
  "Federal University, Dutsin-Ma",
  "Federal University, Gashua",
  "Federal University, Gusau",
  "Federal University, Kashere",
  "Federal University, Lafia",
  "Federal University, Lokoja",
  "Federal University, Ndufu-Alike",
  "Federal University, Otuoke",
  "Federal University, Oye-Ekiti",
  "Federal University, Wukari",
  "Fidei Polytechnic, Gboko",
  "Fountain College of Education, Osogbo",
  "Fountain University, Osogbo",
  "Gateway ICT Polytechnic, Igbesa",
  "Gateway ICT Polytechnic, Saapade",
  "Global Polytechnic, Akure",
  "Godfrey Okoye University, Ugwuomu-Nike",
  "Gombe State University, Gombe",
  "Grace Polytechnic, Surulere",
  "Greenfield University, Kaduna",
  "Greenwich Polytechnic, Aba",
  "Gregory University, Uturu",
  "Hallmark University, Ijebu-Itele",
  "Haruna Adu Polytechnic, Gombe",
  "Heritage Polytechnic, Ikot Udota",
  "Hezekiah University, Umudi",
  "Hussaini Adamu Federal Polytechnic, Kazaure",
  "Ibrahim Badamasi Babangida College of Agriculture, Mokwa",
  "Ibrahim Badamasi Babangida University, Lapai",
  "Igbajo Polytechnic",
  "Igbinedion University, Okada",
  "Ikorodu City Polytechnic",
  "Imo State Polytechnic, Umuagwo",
  "Imo State University, Owerri",
  "Interlink Polytechnic, IJebu-Jesa",
  "J-K Polytechnic, Ojoku",
  "Jabir Abu Muhammad College of Legal and General Studies, Suleja",
  "Joseph Ayo Babalola University, Ikeji-Arakeji",
  "Kaduna Polytechnic, Kaduna",
  "Kaduna State University, Kaduna",
  "Kano State Polytechnic, Kano",
  "Kano University of Science and Technology, Wudil",
  "Katsina State Institute of Technology and Management, Katsina",
  "Kebbi State University of Science and Technology, Aliero",
  "Kingdom Polytechnic, Ubiaja",
  "Kings University, Odeomu",
  "Kogi State Polytechnic, Lokoja",
  "Kogi State University, Anyigba",
  "Kwara State Polytechnic, Ilorin",
  "Kwara State University, Malete",
  "Kwararafa College of Education, Zing",
  "Kwararafa University, Wukari",
  "Ladoke Akintola University of Technology, Ogbomoso",
  "Lagos City Polytechnic, Ikeja",
  "Lagos State Polytechnic, Ikorodu",
  "Lagos State University of Science and Technology, Ikorodu",
  "Lagos State University, Ojo",
  "Landmark University, Omu-Aran",
  "Lead City University, Ibadan",
  "Legacy University, Okija",
  "Lens Polytechnic, Offa",
  "Lighthouse Polytechnic, Benin City",
  "Madonna University, Okija",
  "Maranatha Polytechnic, Oyo",
  "Mcpherson University, Seriki Sotayo",
  "Michael Okpara University of Agriculture, Umudike",
  "Modibbo Adama University of Technology, Yola",
  "Moshood Abiola Polytechnic, Abeokuta",
  "Mountain Top University, Makogi Oba",
  "Mudiame College of Polytechnic, Irrua",
  "Nasarawa State University, Keffi",
  "Niger Delta University, Wilberforce Island",
  "Nigerian Army University Biu",
  "Nigerian College of Aviation Technology, Zaria",
  "Nigerian Institute of Journalism, Lagos",
  "Nigerian Navy School of Health Sciences, Offa",
  "Nile University of Nigeria, Abuja",
  "Nnamdi Azikiwe University, Awka",
  "Nok Polytechnic, Kachia",
  "Northwest University, Kano",
  "Novena University, Ogume",
  "Nuhu Bamalli Polytechnic, Zaria",
  "Obafemi Awolowo University, Ile-Ife",
  "Obong University, Obong Ntak",
  "Oduduwa University, Ipetumodu",
  "Ogun State Institute of Technology, Igbesa",
  "Olabisi Onabanjo University, Ago-Iwoye",
  "Ondo State Polytechnic, Ore",
  "Ondo State University of Science and Technology, Okitipupa",
  "Osun State College of Technology, Esa-Oke",
  "Osun State Polytechnic, Iree",
  "Osun State University, Osogbo",
  "Our Saviour Institute of Science and Technology, Enugu",
  "Oyo State College of Agriculture, Igbo-Ora",
  "Pan-Atlantic University, Lagos",
  "Paul University, Awka",
  "Petroleum Training Institute, Effurun",
  "Picah Polytechnic, Ikot Ekpene",
  "Plateau State Polytechnic, Barkin Ladi",
  "Plateau State University, Bokkos",
  "Polytechnic of Sokoto State, Sokoto",
  "Precious Cornerstone University, Ibadan",
  "Redeemer's University, Ede",
  "Renaissance University, Enugu",
  "Rhema University, Aba",
  "Rivers State Polytechnic, Bori",
  "Rivers State University, Port Harcourt",
  "Ronik Polytechnic, Lagos",
  "Rufus Giwa Polytechnic, Owo",
  "Saba'ah College of Polytechnic, Kaduna",
  "Salem University, Lokoja",
  "Samuel Adegboyega University, Ogwa",
  "Savannah Institute of Technology, Bauchi",
  "Scholars Polytechnic, Oyo",
  "Shaka Polytechnic, Benin City",
  "Skyline University Nigeria, Kano",
  "Sokoto State Polytechnic, Sokoto",
  "Sokoto State University, Sokoto",
  "St. John's Polytechnic, Kengere",
  "St. Mary Polytechnic, Kwamba",
  "Sule Lamido University, Kafin Hausa",
  "Summit University, Offa",
  "Sure Foundation Polytechnic, Ikot Akai",
  "Tai Solarin University of Education, Ijebu-Ode",
  "Tansian University, Umunya",
  "Taraba State University, Jalingo",
  "Technical University, Ibadan",
  "The Oke Ogun Polytechnic, Saki",
  "The Polytechnic, Ibadan",
  "The Polytechnic, Ijebu Igbo",
  "The Polytechnic, Ile-Ife",
  "The Polytechnic, Ikorodu",
  "Thomas Adewumi University",
  "Tower Polytechnic, Ibadan",
  "Umaru Ali Shinkafi Polytechnic, Sokoto",
  "Umaru Musa Yar'Adua University, Katsina",
  "University of Abuja, Abuja",
  "University of Africa, Toru-Orua",
  "University of Agriculture, Makurdi",
  "University of Benin, Benin City",
  "University of Calabar, Calabar",
  "University of Ibadan, Ibadan",
  "University of Ilorin, Ilorin",
  "University of Jos, Jos",
  "University of Lagos, Lagos",
  "University of Maiduguri, Maiduguri",
  "University of Mkar, Mkar",
  "University of Nigeria, Nsukka",
  "University of Port Harcourt, Port Harcourt",
  "University of Uyo, Uyo",
  "Usmanu Danfodiyo University, Sokoto",
  "Valley View Polytechnic, Ohafia",
  "Venite University, Iloro Ekiti",
  "Veritas University, Abuja",
  "Waziri Umaru Federal Polytechnic, Birnin Kebbi",
  "Wellspring University, Benin City",
  "Western Delta University, Oghara",
  "Wolex Polytechnic, Ikeja",
  "Wolex Polytechnic, Surulere",
  "Yaba College of Technology, Yaba",
  "Yobe State University, Damaturu",
  "Yusuf Bala Usman College of Legal and General Studies, Daura",
  "Yusuf Maitama Sule University, Kano",
  "Zagazola College of Aviation Technology, Kano",
  "Zaria City Polytechnic, Zaria",
  "Other"
];

const LEVELS = ["100 lvl", "200 lvl", "300 lvl", "400 lvl"];
const DEPARTMENTS = ["Computer Science", "Computer Engineering", "Software Engineering", "Other"];
const DURATIONS = ["3 months", "6 months"];
const CHALLENGES = [
  "Finding a company that accepts SIWES students",
  "Writing professional CVs that get noticed.",
  "Keeping up with daily/weekly logbook entries.",
  "Understanding ITF requirements and submission."
];
const SOURCES = ["From a friend", "WhatsApp Status", "University Group", "Other"];

interface FormData {
  email: string;
  fullName: string;
  whatsappNumber: string;
  university: string;
  otherUniversity?: string;
  level: string;
  department: string;
  otherDepartment?: string;
  duration: string;
  challenges: string[];
  source: string;
  otherSource?: string;
}

function SchoolCombobox({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredSchools = UNIVERSITIES.filter(school => 
    school.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#29335C] border border-[#F1F5F9]/20 p-3 flex items-center justify-between cursor-pointer focus-within:border-[#F3A712] transition-colors"
      >
        <span className={value ? "text-[#F1F5F9]" : "text-[#F1F5F9]/40"}>
          {value || "Select your institution..."}
        </span>
        <ChevronDown size={20} className={`text-[#F3A712] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-[#1A2341] border border-[#F1F5F9]/10 shadow-2xl max-h-60 overflow-hidden flex flex-col"
          >
            <div className="p-3 border-b border-[#F1F5F9]/10 flex items-center gap-2 bg-[#29335C]">
              <Search size={16} className="text-[#F3A712]" />
              <input
                autoFocus
                type="text"
                placeholder="Search schools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="overflow-y-auto custom-scrollbar">
              {filteredSchools.length > 0 ? (
                filteredSchools.map((school) => (
                  <div
                    key={school}
                    onClick={() => {
                      onChange(school);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className="p-3 text-sm hover:bg-[#F3A712] hover:text-[#29335C] cursor-pointer transition-colors border-b border-[#F1F5F9]/5 last:border-none"
                  >
                    {school}
                  </div>
                ))
              ) : (
                <div className="p-4 text-sm text-[#F1F5F9]/40 text-center">
                  No schools found. Try selecting "Other"
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function WaitlistPage() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    fullName: '',
    whatsappNumber: '',
    university: '',
    otherUniversity: '',
    level: '',
    department: '',
    otherDepartment: '',
    duration: '',
    challenges: [],
    source: '',
    otherSource: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChallengeChange = (challenge: string) => {
    setFormData(prev => ({
      ...prev,
      challenges: prev.challenges.includes(challenge)
        ? prev.challenges.filter(c => c !== challenge)
        : [...prev.challenges, challenge]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error: supabaseError } = await supabase
        .from('waitlist')
        .insert([{
          email: formData.email,
          full_name: formData.fullName,
          whatsapp_number: formData.whatsappNumber,
          university: formData.university === 'Other' ? formData.otherUniversity : formData.university,
          department: formData.department === 'Other' ? formData.otherDepartment : formData.department,
          current_level: formData.level,
          siwes_duration: formData.duration,
          challenges: formData.challenges,
          referral_source: formData.source === 'Other' ? formData.otherSource : formData.source
        }]);

      if (supabaseError) throw supabaseError;

      setIsSubmitted(true);
      toast.success('Successfully joined the waitlist!');
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
      toast.error('Failed to join waitlist. Please check your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#29335C] text-[#F1F5F9] flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-[#1A2341]/50 p-10 border border-[#F1F5F9]/10 shadow-[8px_8px_0px_0px_#F3A712]"
        >
          <CheckCircle2 className="w-16 h-16 text-[#F3A712] mx-auto mb-6" />
          <h1 className="text-3xl font-extrabold mb-4">Thanks for joining!</h1>
          <p className="text-[#F1F5F9]/80 mb-8 leading-relaxed text-sm">
            We've received your details and we can't wait to have you on board.
            We'll reach out to you soon with next steps and exclusive early-bird updates.
          </p>
          <div className="pt-6 border-t border-[#F1F5F9]/10">
            <p className="text-sm font-medium text-[#F1F5F9]/80">
              <span className='text-[#F0CEA0]'>Intern<span className='text-white'>Stack</span></span> | Build your career, layer by layer.
            </p>
          </div>
          <Link
            href="/"
            className="mt-8 inline-block bg-[#F3A712] text-[#29335C] px-8 py-3 font-medium text-sm shadow-[4px_4px_0px_0px_#FFF] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#FFF] transition-all duration-200"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#29335C] text-[#F1F5F9] py-20 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <Link 
          href="/" 
          className="flex items-center gap-2 mb-6 text-xs text-[#F1F5F9]/60 hover:text-[#F3A712] transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        <Link href="/" className="inline-flex items-center gap-2 mb-12  transition-colors group">
          <Layers className="text-[#F3A712]" />
          <span className="text-2xl font-bold tracking-tight">
            <span className="text-[#F0CEA0]">Intern</span>
            <span>Stack</span>
          </span>
        </Link>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-extrabold mb-6">
            Shortlisting in Progress...
          </h1>
          <div className="h-1 w-20 bg-[#F3A712] mb-8" />

          <div className="p-6 bg-[#F3A712]/10 border border-[#F3A712]/20 mb-8">
            <p className="text-lg font-bold text-[#F3A712] mb-2">Waitlist is currently closed.</p>
            <p className="text-sm text-[#F1F5F9]/80 leading-relaxed">
              We are currently shortlisting students who have already joined the waitlist. 
              We want to focus on providing the best experience for our early users first.
              Please check back another time or follow us for updates.
            </p>
          </div>

          <div className="space-y-4 text-sm text-[#F1F5F9]/80 font-medium leading-relaxed">
            <p>
              Stop guessing and start building. <span className="text-[#F1F5F9] font-bold">InternStack</span> is the ultimate engine for Nigerian students to master their SIWES journey.
            </p>
            <p>By joining the waitlist, you'll get early access to:</p>
            <ul className="space-y-3">
              <li className="list-disc list-inside">
                
                <span><span className="font-bold text-[#F1F5F9]">AI CV Builder:</span> Tech-ready resumes in minutes.</span>
              </li>
              <li className="list-disc list-inside">
               
                <span><span className="font-bold text-[#F1F5F9]">Logbook Assistant:</span> Error-free daily entries that meet ITF standards.</span>
              </li>
              <li className="list-disc list-inside">
                
                <span><span className="font-bold text-[#F1F5F9]">Verified Directory:</span> Direct access to top tech companies accepting interns.</span>
              </li>
            </ul>
            <p className="mt-8 font-semibold italic text-[#F0CEA0]">
              Secure your spot and be the first to know when we launch ( soon ) !
            </p>
            <p className="text-sm bg-black/20 p-4 border-l-4 border-blue-400">
              If you encounter any issue while filling the form, Contact Us via <a href="https://wa.me/2347075688609" className="text-blue-400 underline" target="_blank">07075688609 via WhatsApp</a>.
            </p>
          </div>
        </motion.div>

        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={(e) => {
            e.preventDefault();
            toast.error('Signups are currently closed for shortlisting.');
          }}
          className="space-y-8 bg-[#1A2341]/50 p-8 md:p-12 border border-[#F1F5F9]/10 shadow-[8px_8px_0px_0px_#F1F5F9]/10 opacity-60 pointer-events-none"
        >
          {/* Form inputs commented out as shortlisting is in progress */}
          {/*
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-100 flex items-center gap-3">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="block text-sm font-bold uppercase tracking-wider text-[#F0CEA0]">Email Address *</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#29335C] border border-[#F1F5F9]/20 p-3 focus:border-[#F3A712] outline-none transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold uppercase tracking-wider text-[#F0CEA0]">Full Name *</label>
              <input
                required
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-[#29335C] border border-[#F1F5F9]/20 p-3 focus:border-[#F3A712] outline-none transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-3 lg:col-span-2">
              <label className="block text-sm font-bold uppercase tracking-wider text-[#F0CEA0]">WhatsApp Number *</label>
              <input
                required
                type="tel"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                className="w-full bg-[#29335C] border border-[#F1F5F9]/20 p-3 focus:border-[#F3A712] outline-none transition-colors"
                placeholder="e.g. +234 812 345 6789"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold uppercase tracking-wider text-[#F0CEA0]">University *</label>
            <SchoolCombobox 
              value={formData.university}
              onChange={(val) => setFormData({ ...formData, university: val })}
            />
            {formData.university === 'Other' && (
              <motion.input
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                required
                type="text"
                placeholder="Please specify your university..."
                value={formData.otherUniversity}
                onChange={(e) => setFormData({ ...formData, otherUniversity: e.target.value })}
                className="w-full bg-[#29335C] border border-[#F1F5F9]/20 p-3 focus:border-[#F3A712] outline-none transition-colors mt-2"
              />
            )}
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold uppercase tracking-wider text-[#F0CEA0]">Department *</label>
            <div className="flex flex-wrap gap-6">
              {DEPARTMENTS.map((dept) => (
                <label key={dept} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      required
                      type="radio"
                      name="department"
                      value={dept}
                      checked={formData.department === dept}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-[#F1F5F9]/30 peer-checked:border-[#F3A712] transition-colors" />
                    <div className="absolute w-2.5 h-2.5 bg-[#F3A712] scale-0 peer-checked:scale-100 transition-transform" />
                  </div>
                  <span className="text-sm group-hover:text-[#F3A712] transition-colors">{dept}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold uppercase tracking-wider text-[#F0CEA0]">Current Level / Year *</label>
            <div className="flex flex-wrap gap-6">
              {LEVELS.map((lvl) => (
                <label key={lvl} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      required
                      type="radio"
                      name="level"
                      value={lvl}
                      checked={formData.level === lvl}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-[#F1F5F9]/30 peer-checked:border-[#F3A712] transition-colors" />
                    <div className="absolute w-2.5 h-2.5 bg-[#F3A712] scale-0 peer-checked:scale-100 transition-transform" />
                  </div>
                  <span className="text-sm group-hover:text-[#F3A712] transition-colors">{lvl}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold uppercase tracking-wider text-[#F0CEA0]">SIWES Duration *</label>
            <div className="flex flex-wrap gap-8">
              {DURATIONS.map((dur) => (
                <label key={dur} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      required
                      type="radio"
                      name="duration"
                      value={dur}
                      checked={formData.duration === dur}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-[#F1F5F9]/30 peer-checked:border-[#F3A712] transition-colors" />
                    <div className="absolute w-2.5 h-2.5 bg-[#F3A712] scale-0 peer-checked:scale-100 transition-transform" />
                  </div>
                  <span className="text-sm group-hover:text-[#F3A712] transition-colors">{dur}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold uppercase tracking-wider text-[#F0CEA0]">What is your biggest challenge with SIWES right now? *</label>
            <div className="space-y-4">
              {CHALLENGES.map((challenge) => (
                <label key={challenge} className="flex items-start gap-4 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-1">
                    <input
                      type="checkbox"
                      checked={formData.challenges.includes(challenge)}
                      onChange={() => handleChallengeChange(challenge)}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-[#F1F5F9]/30 peer-checked:border-[#F3A712] transition-colors" />
                    <CheckCircle2 className="absolute w-4 h-4 text-[#F3A712] scale-0 peer-checked:scale-100 transition-transform" />
                  </div>
                  <span className="text-sm leading-relaxed group-hover:text-[#F3A712] transition-colors">{challenge}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold uppercase tracking-wider text-[#F0CEA0]">How did you hear about InternStack? *</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SOURCES.map((src) => (
                <label key={src} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      required
                      type="radio"
                      name="source"
                      value={src}
                      checked={formData.source === src}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-[#F1F5F9]/30 peer-checked:border-[#F3A712] transition-colors" />
                    <div className="absolute w-2.5 h-2.5 bg-[#F3A712] scale-0 peer-checked:scale-100 transition-transform" />
                  </div>
                  <span className="text-sm group-hover:text-[#F3A712] transition-colors">{src}</span>
                </label>
              ))}
            </div>
          </div>
          */}

          <button
            disabled={true}
            type="button"
            className="w-full bg-[#F3A712]/50 text-[#29335C] py-3 font-semibold shadow-[6px_6px_0px_0px_#FFF] transition-all duration-200 cursor-not-allowed flex items-center justify-center gap-3 text-sm"
          >
            Shortlist in progress...
          </button>
        </motion.form>
      </div>
    </div>
  );
}
