import React from 'react';
import { WorkExperienceItem } from '../types';
import WorkExperienceCard from './WorkExperienceCard';

interface WorkExperienceFormProps {
    workExperience: WorkExperienceItem[];
    onWorkExperienceChange: (experience: WorkExperienceItem[]) => void;
}

const WorkExperienceForm: React.FC<WorkExperienceFormProps> = ({ workExperience, onWorkExperienceChange }) => {
    
    const addExperience = () => {
        const newExperience: WorkExperienceItem = {
            id: Date.now().toString(),
            type: '',
            company: '',
            position: '',
            startMonth: '',
            startYear: '',
            endMonth: '',
            endYear: '',
            isCurrent: false,
            salary: '',
            description: '',
        };
        onWorkExperienceChange([...workExperience, newExperience]);
    };
    
    const updateExperience = (updatedExperience: WorkExperienceItem) => {
        onWorkExperienceChange(workExperience.map(exp => exp.id === updatedExperience.id ? updatedExperience : exp));
    };

    const removeExperience = (id: string) => {
        onWorkExperienceChange(workExperience.filter(exp => exp.id !== id));
    };

    return (
        <div className="text-left space-y-4 pt-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 text-left border-b border-slate-200 dark:border-slate-700 pb-3">Work / Volunteer / Community Experience (Optional)</h2>
            
            <div className="space-y-6">
                {workExperience.map((exp, index) => (
                    <WorkExperienceCard
                        key={exp.id}
                        experience={exp}
                        onUpdate={updateExperience}
                        onRemove={() => removeExperience(exp.id)}
                    />
                ))}
            </div>

            <button
                type="button"
                onClick={addExperience}
                className="w-full mt-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center justify-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Experience
            </button>
        </div>
    );
};

export default WorkExperienceForm;