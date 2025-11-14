import React from 'react';
import { Sponsor } from '../types';
import SponsorCard from './SponsorCard';

interface SponsorDetailsFormProps {
    sponsors: Sponsor[];
    onSponsorsChange: (sponsors: Sponsor[]) => void;
    showModal: (message: string) => void;
}

const SponsorDetailsForm: React.FC<SponsorDetailsFormProps> = ({ sponsors, onSponsorsChange, showModal }) => {
    
    const addSponsor = () => {
        const newSponsor: Sponsor = {
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
        };
        onSponsorsChange([...sponsors, newSponsor]);
    };
    
    const updateSponsor = (updatedSponsor: Sponsor) => {
        onSponsorsChange(sponsors.map(s => s.id === updatedSponsor.id ? updatedSponsor : s));
    };

    const removeSponsor = (id: string) => {
        onSponsorsChange(sponsors.filter(s => s.id !== id));
    };

    return (
        <div className="text-left space-y-4 pt-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 text-left border-b border-slate-200 dark:border-slate-700 pb-3">Financial Sponsor Details<span className="text-red-500 ml-1">*</span></h2>
            
            <div className="space-y-6">
                {sponsors.map((sponsor, index) => (
                    <SponsorCard
                        key={sponsor.id}
                        sponsor={sponsor}
                        onUpdate={updateSponsor}
                        onRemove={() => removeSponsor(sponsor.id)}
                        showModal={showModal}
                        isOnlySponsor={sponsors.length === 1}
                    />
                ))}
            </div>

            <button
                type="button"
                onClick={addSponsor}
                className="w-full mt-4 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center justify-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add another sponsor
            </button>
        </div>
    );
};

export default SponsorDetailsForm;