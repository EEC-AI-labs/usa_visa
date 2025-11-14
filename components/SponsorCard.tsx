import React, { useState } from 'react';
import { Sponsor, SponsorType } from '../types';
import { getOccupationSuggestions } from '../services/geminiService';
import Tooltip from './Tooltip';

const Spinner: React.FC = () => (
    <svg className="animate-spin h-5 w-5 text-slate-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const OccupationAnalyzer: React.FC<{
    person: string;
    occupation: string;
    onOccupationChange: (value: string) => void;
    showModal: (message: string) => void;
}> = ({ person, occupation, onOccupationChange, showModal }) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);

    const handleAnalyze = async () => {
        if (!occupation.trim()) {
            showModal(`Please enter an occupation for ${person} to analyze.`);
            return;
        }
        setIsAnalyzing(true);
        setShowSuggestionsModal(true);
        try {
            const result = await getOccupationSuggestions(occupation);
            setSuggestions(result || []);
        } catch (error) {
            console.error(error);
            showModal(error instanceof Error ? error.message : "Failed to get suggestions.");
            setShowSuggestionsModal(false);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSelectSuggestion = (suggestion: string) => {
        onOccupationChange(suggestion);
        setShowSuggestionsModal(false);
        setSuggestions([]);
    };

    return (
        <div className="space-y-2">
            <label htmlFor={`${person}Occupation`} className="block text-sm font-medium text-slate-700 dark:text-slate-300">{person}'s Occupation</label>
            <div className="flex gap-2 items-stretch">
                <input
                    type="text"
                    id={`${person}Occupation`}
                    value={occupation}
                    onChange={(e) => onOccupationChange(e.target.value)}
                    placeholder="e.g., Diamond Merchant / Farming"
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-sm"
                />
                <button
                    type="button"
                    onClick={handleAnalyze}
                    className="bg-indigo-600 text-white font-semibold text-sm p-3 rounded-lg hover:bg-indigo-700 disabled:bg-slate-400 flex-shrink-0"
                    disabled={isAnalyzing}
                    title="AI Embellish"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                </button>
                 <Tooltip content="Let AI refine this job title into a professional, American-style description to make a stronger impression on the Visa Officer." />
            </div>
            {showSuggestionsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 modal-enter">
                    <div className="modal-dialog bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold mb-4 text-center">{isAnalyzing ? "Analyzing Occupation..." : "Select a Professional Title"}</h3>
                        {isAnalyzing ? (
                            <div className="flex justify-center items-center h-40"><Spinner /></div>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-sm text-slate-600 dark:text-slate-400 text-center pb-2">Using clear, American-friendly job titles helps the Visa Officer understand your sponsor's profile quickly.</p>
                                {suggestions.length > 0 ? (
                                    suggestions.map(s => (
                                        <button key={s} onClick={() => handleSelectSuggestion(s)} className="w-full text-left p-3 bg-slate-100 dark:bg-slate-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg text-sm font-medium">
                                            {s}
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500 py-4 text-center">No alternative suggestions found. You can close this and use the title you entered.</p>
                                )}
                                <div className="text-center">
                                    <button onClick={() => setShowSuggestionsModal(false)} className="mt-4 text-sm font-semibold text-indigo-600 dark:text-indigo-400">Close</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

interface SponsorCardProps {
    sponsor: Sponsor;
    onUpdate: (sponsor: Sponsor) => void;
    onRemove: () => void;
    showModal: (message: string) => void;
    isOnlySponsor: boolean;
}

const SponsorCard: React.FC<SponsorCardProps> = ({ sponsor, onUpdate, onRemove, showModal, isOnlySponsor }) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newDetails: Partial<Sponsor> & { [key: string]: any } = { [name]: value };

        // Reset income if mother is homemaker
        if (name === 'motherOccupation' && value.toLowerCase() === 'homemaker') {
            newDetails.motherAnnualIncomeUSD = '';
            newDetails.motherAnnualIncomeINR = '';
        }
        onUpdate({ ...sponsor, ...newDetails });
    };

    const handleIncomeChange = (
        amount: string,
        currency: 'INR' | 'USD',
        person: 'father' | 'mother' | 'other'
    ) => {
        const numericAmount = parseFloat(amount);

        const updates: Partial<Sponsor> = {};
        
        // Fix: Use a more specific type for the keys to avoid intersection with unrelated properties on Sponsor, which results in a `never` type.
        const inrField = `${person}AnnualIncomeINR` as 'fatherAnnualIncomeINR' | 'motherAnnualIncomeINR' | 'otherAnnualIncomeINR';
        const usdField = `${person}AnnualIncomeUSD` as 'fatherAnnualIncomeUSD' | 'motherAnnualIncomeUSD' | 'otherAnnualIncomeUSD';

        if (amount === '' || isNaN(numericAmount) || numericAmount < 0) {
            updates[inrField] = currency === 'INR' ? amount : '';
            updates[usdField] = currency === 'USD' ? amount : '';
            if (amount === '') {
                updates[inrField] = '';
                updates[usdField] = '';
            }
        } else if (currency === 'INR') {
            updates[inrField] = amount;
            const usd = (numericAmount * 100000) / 89;
            updates[usdField] = usd.toFixed(0);
        } else { // currency === 'USD'
            updates[usdField] = amount;
            const inrLakhs = (numericAmount * 89) / 100000;
            updates[inrField] = inrLakhs.toFixed(2);
        }
        
        onUpdate({ ...sponsor, ...updates });
    };
    
    const handleOccupationChange = (field: 'fatherOccupation' | 'motherOccupation' | 'otherOccupation', value: string) => {
        onUpdate({ ...sponsor, [field]: value });
    }

    const SPONSOR_OPTIONS: SponsorType[] = [
        "Parents", "Father", "Mother", "Other Family Member", "Corporate Sponsor", 
        "Government Sponsor", "University Scholarship", "Graduate Assistantship (TA/RA)", 
        "Out-of-state tuition waiver"
    ];

    const renderConditionalFields = () => {
        const commonInputClass = "w-full mt-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-sm disabled:bg-slate-100 dark:disabled:bg-slate-800 placeholder:text-slate-400 dark:placeholder:text-slate-500";
        
        switch (sponsor.type) {
            case 'Parents':
            case 'Father':
            case 'Mother':
                 const showFather = sponsor.type === 'Parents' || sponsor.type === 'Father';
                 const showMother = sponsor.type === 'Parents' || sponsor.type === 'Mother';
                 const isMotherHomemaker = (sponsor.motherOccupation || '').toLowerCase() === 'homemaker';
                return (
                    <div className="space-y-4">
                         <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-500/30 rounded-lg text-left">
                            <p className="text-xs text-indigo-800 dark:text-indigo-300">
                                <strong>Why analyze?</strong> Visa Officers have limited time. Using clear, standard job titles (e.g., "Retail Proprietor" instead of "shop owner") helps them understand your sponsor's profile quickly and favorably.
                            </p>
                        </div>
                        {showFather && (
                            <div className="space-y-2">
                                <OccupationAnalyzer person="Father" occupation={sponsor.fatherOccupation || ''} onOccupationChange={(v) => handleOccupationChange('fatherOccupation', v)} showModal={showModal}/>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Father's Annual Income</label>
                                    <div className="grid grid-cols-2 gap-2 mt-1">
                                        <div>
                                            <div className="relative"><input type="text" value={sponsor.fatherAnnualIncomeINR || ''} onChange={(e) => handleIncomeChange(e.target.value, 'INR', 'father')} placeholder="e.g., 27" className="w-full pl-4 pr-14 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-sm"/><span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-500 pointer-events-none">INR Lakhs</span></div>
                                        </div>
                                        <div>
                                            <div className="relative"><input type="text" value={sponsor.fatherAnnualIncomeUSD || ''} onChange={(e) => handleIncomeChange(e.target.value, 'USD', 'father')} placeholder="e.g., 30000" className="w-full pl-4 pr-10 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-sm"/><span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-500 pointer-events-none">USD</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                         {showMother && (
                            <div className="space-y-2">
                                <OccupationAnalyzer person="Mother" occupation={sponsor.motherOccupation || ''} onOccupationChange={(v) => handleOccupationChange('motherOccupation', v)} showModal={showModal}/>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Mother's Annual Income</label>
                                    <div className="grid grid-cols-2 gap-2 mt-1">
                                        <div>
                                            <div className="relative"><input type="text" value={sponsor.motherAnnualIncomeINR || ''} onChange={(e) => handleIncomeChange(e.target.value, 'INR', 'mother')} placeholder="e.g., 18" disabled={isMotherHomemaker} className="w-full pl-4 pr-14 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-sm disabled:bg-slate-100 dark:disabled:bg-slate-800"/><span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-500 pointer-events-none">INR Lakhs</span></div>
                                        </div>
                                        <div>
                                            <div className="relative"><input type="text" value={sponsor.motherAnnualIncomeUSD || ''} onChange={(e) => handleIncomeChange(e.target.value, 'USD', 'mother')} placeholder="e.g., 20000" disabled={isMotherHomemaker} className="w-full pl-4 pr-10 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-sm disabled:bg-slate-100 dark:disabled:bg-slate-800"/><span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-500 pointer-events-none">USD</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'Other Family Member':
                return (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="otherRelationship" className="block text-sm font-medium">Relationship</label>
                            <input type="text" name="otherRelationship" value={sponsor.otherRelationship || ''} onChange={handleChange} className={commonInputClass} placeholder="e.g., Paternal Uncle"/>
                        </div>
                        <OccupationAnalyzer person="Family Member" occupation={sponsor.otherOccupation || ''} onOccupationChange={(v) => handleOccupationChange('otherOccupation', v)} showModal={showModal}/>
                        <div>
                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Annual Income</label>
                            <div className="grid grid-cols-2 gap-2 mt-1">
                                <div>
                                    <div className="relative"><input type="text" value={sponsor.otherAnnualIncomeINR || ''} onChange={(e) => handleIncomeChange(e.target.value, 'INR', 'other')} placeholder="e.g., 45" className="w-full pl-4 pr-14 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-sm"/><span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-500 pointer-events-none">INR Lakhs</span></div>
                                </div>
                                <div>
                                    <div className="relative"><input type="text" value={sponsor.otherAnnualIncomeUSD || ''} onChange={(e) => handleIncomeChange(e.target.value, 'USD', 'other')} placeholder="e.g., 50000" className="w-full pl-4 pr-10 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-sm"/><span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-500 pointer-events-none">USD</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'Corporate Sponsor':
            case 'Government Sponsor':
                return <div><label className="block text-sm">Sponsor Name</label><input type="text" name="sponsorName" value={sponsor.sponsorName || ''} onChange={handleChange} className={commonInputClass}/></div>;
            case 'University Scholarship':
                return (
                    <div className="space-y-4">
                        <select name="scholarshipType" value={sponsor.scholarshipType || 'Full'} onChange={handleChange} className={commonInputClass}>
                            <option value="Full">Full Scholarship</option><option value="Partial">Partial Scholarship</option>
                        </select>
                        {sponsor.scholarshipType === 'Partial' && <input type="text" name="scholarshipAmountUSD" value={sponsor.scholarshipAmountUSD || ''} onChange={handleChange} placeholder="e.g., 15000" className={commonInputClass}/>}
                    </div>
                );
            case 'Graduate Assistantship (TA/RA)':
                return (
                    <div className="space-y-4">
                        <select name="assistantshipDetails" value={sponsor.assistantshipDetails || ''} onChange={handleChange} className={commonInputClass}>
                             <option value="">Select Type</option><option value="TA">Teaching Assistantship (TA)</option><option value="RA">Research Assistantship (RA)</option>
                        </select>
                        <select name="assistantshipWaiver" value={sponsor.assistantshipWaiver || 'None'} onChange={handleChange} className={commonInputClass}>
                            <option value="None">No Tuition Waiver</option><option value="Full">Full Tuition Waiver</option><option value="Partial">Partial Tuition Waiver</option>
                        </select>
                        {sponsor.assistantshipWaiver === 'Partial' && <input type="text" name="assistantshipWaiverAmount" value={sponsor.assistantshipWaiverAmount || ''} onChange={handleChange} placeholder="e.g., 15000" className={commonInputClass}/>}
                        <select name="hasStipend" value={sponsor.hasStipend || 'No'} onChange={handleChange} className={commonInputClass}>
                            <option value="No">Without Stipend</option><option value="Yes">With Stipend</option>
                        </select>
                        {sponsor.hasStipend === 'Yes' && <input type="text" name="stipendAmount" value={sponsor.stipendAmount || ''} onChange={handleChange} placeholder="e.g., 15000" className={commonInputClass}/>}
                    </div>
                );
            case 'Out-of-state tuition waiver':
                 return <div><label className="block text-sm text-left mb-1">Waiver Amount (USD)</label><input type="text" name="waiverAmount" value={sponsor.waiverAmount || ''} onChange={handleChange} placeholder="e.g., 15000" className={commonInputClass}/></div>;
            default: return null;
        }
    }

    return (
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 relative">
            {!isOnlySponsor && (
                 <button onClick={onRemove} className="absolute -top-2 -right-2 bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-full p-1 hover:bg-red-200 dark:hover:bg-red-800 hover:text-red-700 dark:hover:text-red-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </button>
            )}
            <div className="space-y-3">
                <div>
                    <label htmlFor={`sponsor-type-${sponsor.id}`} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 text-left">Sponsor Type<span className="text-red-500 ml-1">*</span></label>
                    <select id={`sponsor-type-${sponsor.id}`} name="type" value={sponsor.type} onChange={handleChange} className="w-full mt-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-900 text-sm font-medium">
                        <option value="">-- Select a Sponsor Type --</option>
                        {SPONSOR_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                
                {sponsor.type && (
                     <div className="pt-3 border-t border-slate-200 dark:border-slate-700/50">
                        {renderConditionalFields()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SponsorCard;
