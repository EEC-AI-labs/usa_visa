



import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, PrepContent, HistoryItem, ModalState, TestScores, Sponsor, CareerGoalDetails, WorkExperienceItem } from './types';
import { COURSE_LEVELS } from './constants';
import { getFunctions, httpsCallable } from "firebase/functions";
import { getAuth, signInAnonymously } from "firebase/auth";




import { generatePrepPlan, analyzeAnswer, getPronunciation } from './services/geminiService';
import { playAudio } from './utils/audio';
import { UNIVERSITIES } from './data/universities';
// import { BRANCHES } from './data/branches';
import Header from './components/Header';
import Modal from './components/Modal';
import PracticeSection from './components/PracticeSection';
import UniversityInput from './components/UniversityInput';
import IndianUniversityInput from './components/IndianUniversityInput';
import SponsorDetailsForm from './components/SponsorDetailsForm';
import CareerGoalsForm from './components/CareerGoalsForm';
import WorkExperienceForm from './components/WorkExperienceForm';
import AutoResizeTextarea from './components/AutoResizeTextarea';
import PillarContent from './components/PillarContent';
// FIX: Import MethodologySection component to resolve 'Cannot find name' error.
import MethodologySection from './components/MethodologySection';
import { BranchLocator } from './components/BranchLocator';
import KnowledgeHub from './components/KnowledgeHub';
// import AuthGate from './components/AuthGate';
import LoginSignupModal from './components/LoginSignupModel';
import AuthGateModal from './components/AuthGateModal';
import { app } from './services/firebaseConfig';


const functions = getFunctions(app);
const incrementFn = httpsCallable(functions, "incrementPrepCount");




export const incrementPrepCount = async () => {
    try {
      const result = await incrementFn();
      return result.data;
    } catch (err) {
      console.error("❌ Failed to increment prep count:", err);
      throw err;
    }
  };



const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.log(error);
            return initialValue;
        }
    });

    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.log(error);
        }
    };

    return [storedValue, setValue];
};


const App: React.FC = () => {
    const [profile, setProfile] = useLocalStorage<UserProfile>('f1VisaProfile_v3', {
        university: '', courseLevel: '', course: '', lastQualification: '', grade: '', indianUniversity: '',
        workExperience: [], 
        sponsors: [{
            id: Date.now().toString(),
            type: '',
            fatherOccupation: '', fatherAnnualIncomeUSD: '', fatherAnnualIncomeINR: '',
            motherOccupation: '', motherAnnualIncomeUSD: '', motherAnnualIncomeINR: '',
            otherRelationship: '', otherOccupation: '', otherAnnualIncomeUSD: '', otherAnnualIncomeINR: '', 
            sponsorName: '',
            scholarshipType: 'Full', scholarshipAmountUSD: '',
            assistantshipDetails: '', assistantshipWaiver: 'None', assistantshipWaiverAmount: '',
            hasStipend: 'No', stipendAmount: '',
            waiverAmount: ''
        }],
        careerGoals: { goal: '', details: '' }, 
        testScores: {
            waiverIB: false, waiverIndianBoard: false, waiverUniversity: false,
            ielts: '', toefl: '', pte: '', duolingo: '', gre: '', sat: '', gmat: '',
            otherTestName: '', otherTestScore: ''
        },
        hasRefusal: 'no', refusalType: '', refusalReason: '',
        hasTraveled: 'no', travelDetails: '',
        hasPetition: 'no', petitionDetails: '',
        additionalDetails: '',
    });
    const [prepContent, setPrepContent] = useLocalStorage<PrepContent | null>('f1VisaPrepContent_v2', null);
    const [history, setHistory] = useLocalStorage<HistoryItem[]>('f1VisaHistory_v2', []);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>('f1VisaAuthenticated_v1', false);
    const [isLoggedIn, setIsLoggedIn] = useLocalStorage<boolean>('f1VisaLoggedIn_v1', false);
    const [showAuthModal, setShowAuthModal] = useState(() => !isLoggedIn);
    const [authScreen, setAuthScreen] = useState<'signup' | 'login'>('signup');
    const [modalState, setModalState] = useState<ModalState>({ isOpen: false, message: '' });
    const [progress, setProgress] = useState(0);
    const [pronunciation, setPronunciation] = useState<{ phonetic: string; audio: string | null }>({ phonetic: '', audio: null });
    const [isFetchingPronunciation, setIsFetchingPronunciation] = useState(false);

    const interviewSectionRef = useRef<HTMLElement>(null);
    const pronunciationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);




    

     useEffect(() => {
        const fetchPronunciation = async () => {
            if (profile.university && UNIVERSITIES.some(u => u.name === profile.university)) {
                setIsFetchingPronunciation(true);
                setPronunciation({ phonetic: '', audio: null });
                try {
                    const result = await getPronunciation(profile.university);
                    if (result) {
                        setPronunciation(result);
                    }
                } catch (e) {
                    console.error("Failed to fetch pronunciation", e);
                } finally {
                    setIsFetchingPronunciation(false);
                }
            } else {
                setPronunciation({ phonetic: '', audio: null });
            }
        };

        if (pronunciationTimeoutRef.current) {
            clearTimeout(pronunciationTimeoutRef.current);
        }
        
        pronunciationTimeoutRef.current = setTimeout(() => {
            if (profile.university) {
                fetchPronunciation();
            } else {
                 setPronunciation({ phonetic: '', audio: null });
            }
        }, 500);

        return () => {
            if (pronunciationTimeoutRef.current) {
                clearTimeout(pronunciationTimeoutRef.current);
            }
        };
    }, [profile.university]);

    const showModal = (message: string, isConfirm = false, onConfirm?: () => void) => {
        setModalState({ isOpen: true, message, isConfirm, onConfirm });
    };

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleTestScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setProfile(prev => ({
            ...prev,
            testScores: {
                ...prev.testScores,
                [name]: type === 'checkbox' ? checked : value
            }
        }));
    };
    
    const handleSponsorsChange = (newSponsors: Sponsor[]) => {
        setProfile(prev => ({...prev, sponsors: newSponsors}));
    }

    const handleWorkExperienceChange = (newWorkExperience: WorkExperienceItem[]) => {
        setProfile(prev => ({ ...prev, workExperience: newWorkExperience }));
    };

    const handleCareerGoalChange = (newCareerGoals: CareerGoalDetails) => {
        setProfile(prev => ({ ...prev, careerGoals: newCareerGoals }));
    };

    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({...prev, [name]: value as 'yes' | 'no'}));
    };

    const handleGeneratePrep = async () => {
        if (!isLoggedIn) {
            setShowAuthModal(true);
            setAuthScreen('signup');
            return showModal('Please sign up or log in to generate your prep plan.');
        }





            // 🔥 STEP 1: Make sure user is signed into Firebase Auth
    try {
        const auth = getAuth();
        if (!auth.currentUser) {
            await signInAnonymously(auth);
        }
    } catch (e) {
        console.error("Firebase anonymous login failed", e);
    }

          // 🔥 NEW: Increment prep plan count in Firebase
    try {
        await incrementPrepCount();
        console.log("Prep plan count incremented");
    } catch (e) {
        console.error("Failed to update prep plan count:", e);
    }

        const requiredFields: (keyof UserProfile)[] = ['university', 'courseLevel', 'course', 'lastQualification', 'grade'];
        for (const field of requiredFields) {
            if (!profile[field]) {
                 return showModal('Please fill in all academic and personalization details to generate your plan.');
            }
        }
        if (!profile.careerGoals.goal || !profile.careerGoals.details) {
            return showModal('Please provide your future career goals in India.');
        }
        if (!profile.indianUniversity) {
             return showModal('Please provide your Indian school or university name.');
        }
        if (profile.sponsors.length === 0 || profile.sponsors.some(s => !s.type)) {
            return showModal('Please select a sponsor type for all financial sponsors.');
        }

        setIsAuthenticated(false); // Reset authentication status for new plan
        setIsLoading(true);
        let progressInterval: ReturnType<typeof setInterval>;
        try {
            setProgress(0);
            progressInterval = setInterval(() => {
                setProgress(p => (p < 95 ? p + 2 : p));
            }, 100);

            const content = await generatePrepPlan(profile);
            
            if (content) {
                setPrepContent(content);
                setProgress(100);
                setTimeout(() => {
                    interviewSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                    setProgress(0);
                }, 500);
            } else {
                 throw new Error("Received empty content from the AI.");
            }
        } catch (error) {
            console.error(error);
            showModal(error instanceof Error ? error.message : "An unknown error occurred.");
            setProgress(0);
        } finally {
            clearInterval(progressInterval);
            setIsLoading(false);
        }
    };
    
    const handleGetFeedback = async (question: string, transcript: string): Promise<HistoryItem | null> => {
        if (!isLoggedIn) {
            setShowAuthModal(true);
            setAuthScreen('login');
            showModal('Please log in to get feedback on your practice.');
            return null;
        }
        try {
            const feedback = await analyzeAnswer(question, transcript);

            if (!feedback) {
                showModal("The AI returned content feedback in an unexpected format. Please try again.");
                return null;
            }

            const newHistoryItem: HistoryItem = {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                question,
                transcript,
                ...feedback,
            };
            
            setHistory(prev => {
                const filtered = prev.filter(h => h.question !== question);
                return [newHistoryItem, ...filtered];
            });
            return newHistoryItem;

        } catch (error) {
            showModal(error instanceof Error ? error.message : 'Failed to get feedback.');
            return null;
        }
    };

    const handleClearHistory = () => {
        showModal("Are you sure you want to clear your entire practice history?", true, () => {
            setHistory([]);
            setModalState({ isOpen: false, message: '' });
        });
    };

    const handleAuthSuccess = () => {
        setIsAuthenticated(true);
        setTimeout(() => {
            interviewSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100); // Small delay to allow content to render before scrolling
    };

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        setShowAuthModal(false);
    };
    
    const showIndianUniversitySearch = profile.courseLevel === 'Masters' || profile.courseLevel === 'PhD';
    
    const coursePlaceholder =
        profile.courseLevel === 'Bachelors' ? "e.g., Computer Science" :
        profile.courseLevel === 'PhD' ? "e.g., PhD in Artificial Intelligence" :
        "e.g., MS in Business Analytics";
    
    const lastQualificationPlaceholder = 
        profile.courseLevel === 'Bachelors' ? "e.g., 12th Grade / HSC (GSHSEB)" :
        profile.courseLevel === 'PhD' ? "e.g., M.S. in Data Science from University of Mumbai" :
        "e.g., B.E. in Information Technology from GTU";

    const gradePlaceholder = 
        profile.courseLevel === 'Bachelors' ? "e.g., 88% or 9.2 CGPA" :
        profile.courseLevel === 'PhD' ? "e.g., 3.8/4.0 GPA in Masters" :
        "e.g., 8.7 SPI or First Class with Distinction";

    return (
        <>
            {showAuthModal && (
                authScreen === 'signup' ? (
                    <LoginSignupModal 
                        onAuthSuccess={handleLoginSuccess} 
                        onSwitchToLogin={() => setAuthScreen('login')} 
                        onClose={() => setShowAuthModal(false)}
                    />
                ) : (
                    <AuthGateModal 
                        onAuthSuccess={handleLoginSuccess} 
                        onSwitchToSignup={() => setAuthScreen('signup')} 
                        onClose={() => setShowAuthModal(false)}
                    />
                )
            )}

            <div className={showAuthModal ? 'blur-sm pointer-events-none' : ''}>
                <Header />
                <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                    <section id="setup" className="mb-16 text-center">
                        
                        <div className="flex flex-col">

                        
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight max-w-3xl mx-auto">AI-Powered USA F-1 Visa Interview Prep By EEC</h1>
                        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Enter your details for an ultra hyper-personalized US student visa preparation UNLIMITED experience. Anytime. Anywhere (Version 3.0)</p>
                    
                        {/* Right: Image Section */}
                            <div className="  flex flex-col items-center justify-center mt-8">
                                <img
                                    src="https://ai.eecglobal.com/assets/visaQueue.jpeg" // ← Replace with your image import
                                    alt="Visa Interview Queue"
                                    className="rounded-2xl shadow-lg object-cover w-full max-w-md"
                                />
                                <p className="mt-4 text-base text-slate-700 dark:text-slate-300 text-center">
    Real Photo US Consulate, India on Visa Day
    </p>
                            </div>
                        </div>
                        <div className="mt-10 max-w-xl mx-auto bg-white dark:bg-slate-800/50 p-6 sm:p-8 rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200/80 dark:border-slate-700/80">
                        
                        
                            <div className="space-y-6">
                                
                                {/* Academic Plan */}
                                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 text-left border-b border-slate-200 dark:border-slate-700 pb-3">Your Academic Plan<span className="text-red-500 ml-1">*</span></h2>
                                <div>
                                    <label htmlFor="university" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 text-left">Your US University<span className="text-red-500 ml-1">*</span></label>
                                    <UniversityInput
                                        value={profile.university}
                                        onChange={(newValue) => setProfile(prev => ({ ...prev, university: newValue }))}
                                    />
                                    {(isFetchingPronunciation || pronunciation.phonetic) && (
                                        <div className="mt-2 text-left px-1">
                                            {isFetchingPronunciation ? (
                                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 animate-pulse bg-slate-100 dark:bg-slate-700/50 rounded-md p-2">
                                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                    Fetching pronunciation...
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/50 rounded-md p-2 fade-in">
                                                    <span className="font-mono break-words">{pronunciation.phonetic}</span>
                                                    {pronunciation.audio && (
                                                        <button 
                                                            onClick={() => playAudio(pronunciation.audio!)} 
                                                            disabled={isFetchingPronunciation}
                                                            className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex-shrink-0 disabled:opacity-50"
                                                            aria-label="Play pronunciation"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="courseLevel" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 text-left">Course Level<span className="text-red-500 ml-1">*</span></label>
                                    <select id="courseLevel" name="courseLevel" value={profile.courseLevel} onChange={handleProfileChange} className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-shadow bg-white dark:bg-slate-900 dark:text-slate-100">
                                        <option value="">-- Select a Course Level --</option>
                                        {COURSE_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="course" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 text-left">Your Course of Study (Major)<span className="text-red-500 ml-1">*</span></label>
                                    <input type="text" id="course" name="course" value={profile.course} onChange={handleProfileChange} placeholder={coursePlaceholder} className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-shadow bg-white dark:bg-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
                                </div>

                                <hr className="!my-8 border-slate-200 dark:border-slate-700" />
                                
                                {/* Personalization Details */}
                                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 text-left border-b border-slate-200 dark:border-slate-700 pb-3">Personalization Details<span className="text-red-500 ml-1">*</span></h2>
                                <div>
                                    <label htmlFor="lastQualification" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 text-left">Last Qualification<span className="text-red-500 ml-1">*</span></label>
                                    <input type="text" id="lastQualification" name="lastQualification" value={profile.lastQualification} onChange={handleProfileChange} placeholder={lastQualificationPlaceholder} className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-shadow bg-white dark:bg-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
                                </div>
                                <div>
                                    <label htmlFor="grade" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 text-left">Grade<span className="text-red-500 ml-1">*</span></label>
                                    <input type="text" id="grade" name="grade" value={profile.grade} onChange={handleProfileChange} placeholder={gradePlaceholder} className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-shadow bg-white dark:bg-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
                                </div>
                                <div>
                                    <label htmlFor="indianUniversity" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 text-left">
                                        {showIndianUniversitySearch ? 'Indian University' : 'Indian High School Name'}
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    {showIndianUniversitySearch ? (
                                        <IndianUniversityInput 
                                            value={profile.indianUniversity}
                                            onChange={(newValue) => setProfile(prev => ({ ...prev, indianUniversity: newValue }))}
                                        />
                                    ) : (
                                        <input 
                                            type="text" 
                                            id="indianUniversity" 
                                            name="indianUniversity" 
                                            value={profile.indianUniversity} 
                                            onChange={handleProfileChange} 
                                            placeholder="e.g., Delhi Public School, Bopal, Ahmedabad" 
                                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-shadow bg-white dark:bg-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                        />
                                    )}
                                </div>

                                <hr className="!my-8 border-slate-200 dark:border-slate-700" />
                                
                                {/* Work Experience */}
                                <WorkExperienceForm
                                    workExperience={profile.workExperience}
                                    onWorkExperienceChange={handleWorkExperienceChange}
                                />
                            
                                <hr className="!my-8 border-slate-200 dark:border-slate-700" />

                                {/* Sponsor Details */}
                                <SponsorDetailsForm
                                    sponsors={profile.sponsors}
                                    onSponsorsChange={handleSponsorsChange}
                                    showModal={showModal}
                                />

                                <hr className="!my-8 border-slate-200 dark:border-slate-700" />

                                {/* Career Goals */}
                                <CareerGoalsForm 
                                    careerGoals={profile.careerGoals}
                                    onCareerGoalChange={handleCareerGoalChange}
                                    showModal={showModal}
                                />

                                <hr className="!my-8 border-slate-200 dark:border-slate-700" />

                                {/* Standardized Test Scores */}
                                <div className="text-left">
                                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 text-left border-b border-slate-200 dark:border-slate-700 pb-3 mb-4">Standardized Test Scores (if any)</h2>
                                    <fieldset className="space-y-4 border border-slate-300 dark:border-slate-600 p-4 rounded-lg">
                                        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">English Proficiency</h3>
                                        <div className="space-y-2">
                                            <label className="flex items-center text-sm"><input type="checkbox" name="waiverIB" checked={profile.testScores.waiverIB} onChange={handleTestScoreChange} className="mr-2 h-4 w-4 accent-indigo-600 dark:accent-indigo-500"/>English Test Waiver (IB or Cambridge IGCSE)</label>
                                            <label className="flex items-center text-sm"><input type="checkbox" name="waiverIndianBoard" checked={profile.testScores.waiverIndianBoard} onChange={handleTestScoreChange} className="mr-2 h-4 w-4 accent-indigo-600 dark:accent-indigo-500"/>English Test Waiver (CBSE/ICSE/State Board)</label>
                                            <label className="flex items-center text-sm"><input type="checkbox" name="waiverUniversity" checked={profile.testScores.waiverUniversity} onChange={handleTestScoreChange} className="mr-2 h-4 w-4 accent-indigo-600 dark:accent-indigo-500"/>English Test Waiver by University</label>
                                        </div>
                                        <div className="pt-2 grid grid-cols-2 gap-x-6 gap-y-4">
                                            {[
                                                { name: 'ielts', label: 'IELTS', scale: '/ 9.0', max: 9, step: 0.5 },
                                                { name: 'toefl', label: 'TOEFL iBT', scale: '/ 120', max: 120, step: 1 },
                                                { name: 'pte', label: 'PTE Academic', scale: '/ 90', max: 90, step: 1 },
                                                { name: 'duolingo', label: 'Duolingo', scale: '/ 160', max: 160, step: 1 },
                                                { name: 'gre', label: 'GRE', scale: '/ 340', max: 340, step: 1 },
                                                { name: 'sat', label: 'Digital SAT', scale: '/ 1600', max: 1600, step: 1 },
                                                { name: 'gmat', label: 'GMAT', scale: '/ 800', max: 800, step: 1 },
                                            ].map(test => (
                                                <div key={test.name}>
                                                    <label htmlFor={test.name} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{test.label}</label>
                                                    <div className="relative">
                                                        <input type="number" id={test.name} name={test.name} value={(profile.testScores as any)[test.name]} onChange={handleTestScoreChange} min="0" max={test.max} step={test.step} className="w-full pl-3 pr-12 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-sm"/>
                                                        <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-500 dark:text-slate-400 pointer-events-none">{test.scale}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="pt-2 grid grid-cols-2 gap-x-4">
                                            <div>
                                                <label htmlFor="otherTestName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Other Test Name</label>
                                                <input type="text" id="otherTestName" name="otherTestName" value={profile.testScores.otherTestName} onChange={handleTestScoreChange} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-sm"/>
                                            </div>
                                            <div>
                                                <label htmlFor="otherTestScore" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Score</label>
                                                <input type="number" id="otherTestScore" name="otherTestScore" value={profile.testScores.otherTestScore} onChange={handleTestScoreChange} min="0" className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-sm"/>
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>

                                <hr className="!my-8 border-slate-200 dark:border-slate-700" />

                                {/* Immigration History */}
                                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 text-left border-b border-slate-200 dark:border-slate-700 pb-3">Your Immigration History</h2>
                                <div className="text-left space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Has your US Visa ever been refused?</label>
                                        <div className="flex items-center gap-x-6">
                                            <label className="flex items-center"><input type="radio" name="hasRefusal" value="no" checked={profile.hasRefusal === 'no'} onChange={handleRadioChange} className="mr-2 h-4 w-4 accent-indigo-600 dark:accent-indigo-500"/>No</label>
                                            <label className="flex items-center"><input type="radio" name="hasRefusal" value="yes" checked={profile.hasRefusal === 'yes'} onChange={handleRadioChange} className="mr-2 h-4 w-4 accent-indigo-600 dark:accent-indigo-500"/>Yes</label>
                                        </div>
                                        <div className={`space-y-3 transition-all duration-500 ease-in-out ${profile.hasRefusal === 'yes' ? 'max-h-[500px] mt-3' : 'max-h-0 overflow-hidden'}`}>
                                            <select name="refusalType" value={profile.refusalType} onChange={handleProfileChange} className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 dark:text-slate-100">
                                                <option value="">Select visa type...</option>
                                                <option value="F-1">Student (F-1)</option>
                                                <option value="B-2">Visitor (B-2)</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            <AutoResizeTextarea name="refusalReason" value={profile.refusalReason} onChange={handleProfileChange} placeholder="e.g., Under Section 214(b) due to insufficient ties to home country." className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 dark:text-slate-100" rows={2}></AutoResizeTextarea>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Have you traveled to the US before?</label>
                                        <div className="flex items-center gap-x-6">
                                            <label className="flex items-center"><input type="radio" name="hasTraveled" value="no" checked={profile.hasTraveled === 'no'} onChange={handleRadioChange} className="mr-2 h-4 w-4 accent-indigo-600 dark:accent-indigo-500"/>No</label>
                                            <label className="flex items-center"><input type="radio" name="hasTraveled" value="yes" checked={profile.hasTraveled === 'yes'} onChange={handleRadioChange} className="mr-2 h-4 w-4 accent-indigo-600 dark:accent-indigo-500"/>Yes</label>
                                        </div>
                                        <div className={`transition-all duration-500 ease-in-out ${profile.hasTraveled === 'yes' ? 'max-h-[500px] mt-3' : 'max-h-0 overflow-hidden'}`}>
                                            <AutoResizeTextarea name="travelDetails" value={profile.travelDetails} onChange={handleProfileChange} placeholder="e.g., 2019, B-2 visa, Tourism in New York & DC, 15 days." className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 dark:text-slate-100" rows={2}></AutoResizeTextarea>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Has an immigrant petition (e.g., for a Green Card) ever been filed on your behalf?</label>
                                        <div className="flex items-center gap-x-6">
                                            <label className="flex items-center"><input type="radio" name="hasPetition" value="no" checked={profile.hasPetition === 'no'} onChange={handleRadioChange} className="mr-2 h-4 w-4 accent-indigo-600 dark:accent-indigo-500"/>No</label>
                                            <label className="flex items-center"><input type="radio" name="hasPetition" value="yes" checked={profile.hasPetition === 'yes'} onChange={handleRadioChange} className="mr-2 h-4 w-4 accent-indigo-600 dark:accent-indigo-500"/>Yes</label>
                                        </div>
                                        <div className={`transition-all duration-500 ease-in-out ${profile.hasPetition === 'yes' ? 'max-h-[500px] mt-3' : 'max-h-0 overflow-hidden'}`}>
                                            <input type="text" name="petitionDetails" value={profile.petitionDetails} onChange={handleProfileChange} placeholder="e.g., My father filed an F4 petition (family-based) in 2015." className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"/>
                                        </div>
                                    </div>
                                </div>
                                
                                <hr className="!my-8 border-slate-200 dark:border-slate-700" />

                                {/* Additional Details */}
                                <div className="text-left">
                                    <label htmlFor="additionalDetails" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Optional Additional Details</label>
                                    <AutoResizeTextarea
                                        id="additionalDetails"
                                        name="additionalDetails"
                                        value={profile.additionalDetails}
                                        onChange={handleProfileChange}
                                        placeholder="e.g., Mention any accolades, awards, community involvement, key college projects, travel experiences, online courses (Coursera, edX), certifications (AWS, Google), contributions to GitHub, or personal projects like a YouTube channel. This helps build a stronger, more unique profile."
                                        className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                        rows={4}
                                    ></AutoResizeTextarea>
                                </div>
                                
                                <button onClick={handleGeneratePrep} disabled={isLoading} className="w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-[1.02] disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100 !mt-8">
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Generating...
                                        </span>
                                    ) : (
                                        'Generate Prep Plan'
                                    )}
                                </button>
                                <div className={`h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-4 transition-opacity duration-300 ${isLoading ? 'opacity-100' : 'opacity-0'}`}>
                                    <div className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {prepContent && (
                        <>


                                    <PracticeSection
                                    ref={interviewSectionRef}
                                    prepContent={prepContent}
                                    history={history}
                                    onGetFeedback={handleGetFeedback}
                                    onClearHistory={handleClearHistory}
                                />
                           
                        
                        </>
                    )}
                </main>

                <PillarContent />
                <MethodologySection />
                <KnowledgeHub />
                <div className="container mx-auto px-4  sm:px-6 lg:px-8  ">
                    <BranchLocator />
                </div>
                <footer className="md:ml-10 bg-slate-100 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {/* Logo Section */}
                            <div className="col-span-1 md:col-span-1">
                                <div className="flex items-center gap-3">
                                <img src="https://ai.eecglobal.com/assets/eeclogo.svg" alt="EEC" className="h-8" />
                                <span className="text-lg font-bold text-slate-800 dark:text-slate-200">
                                    USA F-1 Visa Prep
                                </span>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
                                Powered by EEC
                                </p>
                            </div>

                            {/* Quick Links + Company Side by Side on Mobile */}
                            <div className="col-span-1 md:col-span-2">
                                <div className="grid grid-cols-2 gap-6">
                                {/* Quick Links */}
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 tracking-wider uppercase">
                                    Quick Links
                                    </h3>
                                    <ul className="mt-4 space-y-2">
                                    <li>
                                        <a
                                        href="#setup"
                                        className="text-base text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                                        >
                                        Start
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                        href="#interview-flow"
                                        className="text-base text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                                        >
                                        Practice
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                        href="#knowledge-hub"
                                        className="text-base text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                                        >
                                        Resources
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                        href="#branches"
                                        className="text-base text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                                        >
                                        Our Branches
                                        </a>
                                    </li>
                                    </ul>
                                </div>

                                {/* Company */}
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 tracking-wider uppercase">
                                    Company
                                    </h3>
                                    <ul className="mt-4 space-y-2">
                                    <li>
                                        <a
                                        href="#faq"
                                        className="text-base text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                                        >
                                        FAQs
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                        href="#experts"
                                        className="text-base text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                                        >
                                        Our Experts
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                        href="/usavisaprep/llm.txt"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-base text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                                        >
                                        For LLMs
                                        </a>
                                    </li>
                                    </ul>
                                </div>
                                </div>
                            </div>

    <div>
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 tracking-wider uppercase">Follow Us</h3>
                                <div className="flex mt-4 space-x-4">
                                    <a href="https://www.instagram.com/eecglobal" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"/></svg>
                                    </a>
                                    <a href="https://www.facebook.com/eecglobal" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                                    </a>
                                    <a href="https://www.youtube.com/@eecgujarat" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19.802 5.378a2.49 2.49 0 00-1.758-1.757C16.532 3.12 12 3.12 12 3.12s-4.532 0-6.044.501a2.49 2.49 0 00-1.758 1.757C3.698 6.89 3.698 12 3.698 12s0 5.11 1.5 6.622a2.49 2.49 0 001.758 1.757C8.468 20.88 12 20.88 12 20.88s4.532 0 6.044-.501a2.49 2.49 0 001.758-1.757C20.302 17.11 20.302 12 20.302 12s0-5.11-1.5-6.622zM9.932 15.11V8.89l5.244 3.11-5.244 3.11z" clipRule="evenodd" /></svg>
                                    </a>
                                    <a href="https://www.linkedin.com/school/eecindia" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                    </a>
                                </div>
                            </div>
                        
                        </div>
                        <div className="mt-12 border-t border-slate-200 dark:border-slate-700 pt-8 text-center">
                            <p className="text-sm text-slate-500 dark:text-slate-400">&copy; {new Date().getFullYear()} EEC. All Rights Reserved.</p>
                        </div>
                    </div>
                </footer>

                <Modal modalState={modalState} onClose={() => setModalState({ isOpen: false, message: '' })} />
            </div>
        </>
    );
};

export default App;