import React, { useState } from 'react';
import { CareerGoalDetails, CareerGoalOption } from '../types';
import { embellishCareerGoal } from '../services/geminiService';
import AutoResizeTextarea from './AutoResizeTextarea';
import Tooltip from './Tooltip';

const GOAL_OPTIONS: { id: CareerGoalOption, label: string }[] = [
    { id: 'Join Family Business', label: 'Join Family Business' },
    { id: 'Start My Own Company', label: 'Start my Own Company / Start-up' },
    { id: 'Join MNC in India', label: 'Join an MNC in India' },
    { id: 'Work Globally', label: 'Work for a Global Company (in India or remotely)' },
    { id: 'Government Job in India', label: 'Apply for a Government Job in India' },
    { id: 'Other', label: 'Other' },
];

const GOAL_PROMPTS: Record<CareerGoalOption, string> = {
    'Join Family Business': 'What is this business?',
    'Start My Own Company': 'What will your company do?',
    'Join MNC in India': 'Which companies are you targeting?',
    'Work Globally': 'What kind of roles or companies interest you?',
    'Government Job in India': 'Which department or area are you interested in?',
    'Other': 'What are your career goals?',
};

const GOAL_PLACEHOLDERS: Record<CareerGoalOption, string> = {
    'Join Family Business': "e.g., To expand my family's textile business into international markets using supply chain management skills.",
    'Start My Own Company': "e.g., To launch an AgriTech startup in Ahmedabad to improve access to quality farm equipment.",
    'Join MNC in India': "e.g., Aiming for a Data Scientist role at Google or Microsoft in their Bengaluru or Hyderabad offices.",
    'Work Globally': "e.g., To secure a remote software engineering role with a top US tech firm while being based in my hometown, Surat.",
    'Government Job in India': "e.g., To join the Gujarat State Administrative Service to work on urban development projects.",
    'Other': "e.g., To lead the R&D department at a major Indian pharmaceutical company like Sun Pharma or Zydus.",
};

const Spinner: React.FC = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

interface CareerGoalsFormProps {
    careerGoals: CareerGoalDetails;
    onCareerGoalChange: (newCareerGoals: CareerGoalDetails) => void;
    showModal: (message: string) => void;
}

const CareerGoalsForm: React.FC<CareerGoalsFormProps> = ({ careerGoals, onCareerGoalChange, showModal }) => {
    const [isEmbellishing, setIsEmbellishing] = useState(false);

    const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onCareerGoalChange({
            goal: e.target.value as CareerGoalOption,
            details: '', // Reset details when goal changes
        });
    };
    
    const handleDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onCareerGoalChange({
            ...careerGoals,
            details: e.target.value,
        });
    };
    
    const handleEmbellish = async () => {
        if (!careerGoals.details.trim()) {
            showModal('Please provide some details about your goal before embellishing.');
            return;
        }
        setIsEmbellishing(true);
        try {
            const embellishedText = await embellishCareerGoal(careerGoals.goal, careerGoals.details);
            if (embellishedText) {
                onCareerGoalChange({ ...careerGoals, details: embellishedText });
            } else {
                showModal('The AI could not generate a suggestion. Please try rephrasing your goal.');
            }
        } catch (error) {
             showModal(error instanceof Error ? error.message : "An unknown error occurred while getting suggestions.");
        } finally {
            setIsEmbellishing(false);
        }
    };

    return (
        <div className="text-left space-y-4 pt-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 text-left border-b border-slate-200 dark:border-slate-700 pb-3">Future Career Goals in India<span className="text-red-500 ml-1">*</span></h2>
             <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-500/30 rounded-lg text-left flex gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                <p className="text-xs text-indigo-800 dark:text-indigo-300">
                    <strong>Pro Tip:</strong> Your post-graduation plans are crucial for demonstrating "non-immigrant intent." Be specific about your goals in India to show the Visa Officer you have a clear and compelling reason to return home.
                </p>
            </div>
            <fieldset>
                <legend className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">What is your primary career goal after completing your studies?<span className="text-red-500 ml-1">*</span></legend>
                <div className="space-y-3">
                    {GOAL_OPTIONS.map(({ id, label }) => (
                        <label key={id} className="flex items-center text-sm font-medium">
                            <input
                                type="radio"
                                name="careerGoal"
                                value={id}
                                checked={careerGoals.goal === id}
                                onChange={handleGoalChange}
                                className="h-4 w-4 mr-3 accent-indigo-600 dark:accent-indigo-500"
                            />
                            {label}
                        </label>
                    ))}
                </div>
            </fieldset>

            <div className={`transition-all duration-500 ease-in-out ${careerGoals.goal ? 'max-h-[500px] mt-4' : 'max-h-0 overflow-hidden'}`}>
                 <label htmlFor="careerDetails" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {careerGoals.goal ? GOAL_PROMPTS[careerGoals.goal] : ''}
                    <span className="text-red-500 ml-1">*</span>
                 </label>
                 <div className="flex gap-2 items-stretch">
                    <AutoResizeTextarea
                        id="careerDetails"
                        name="careerDetails"
                        value={careerGoals.details}
                        onChange={handleDetailsChange}
                        placeholder={careerGoals.goal ? GOAL_PLACEHOLDERS[careerGoals.goal] : 'Be specific...'}
                        className="min-h-12 w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-shadow bg-white dark:bg-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        rows={4}
                    />
                    <button
                        type="button"
                        onClick={handleEmbellish}
                        className="bg-indigo-600 text-white font-semibold text-sm p-3 rounded-lg hover:bg-indigo-700 disabled:bg-slate-400 flex-shrink-0"
                        disabled={isEmbellishing}
                        title="AI Embellish"
                    >
                        {isEmbellishing ? <Spinner /> : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        )}
                    </button>
                    <Tooltip content="Let AI rewrite your goal into a single, ambitious sentence using professional jargon, highlighting your strong ties to India." />
                 </div>
            </div>
        </div>
    );
};

export default CareerGoalsForm;
