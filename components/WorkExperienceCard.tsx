import React from 'react';
import { WorkExperienceItem } from '../types';
import AutoResizeTextarea from './AutoResizeTextarea';

interface WorkExperienceCardProps {
    experience: WorkExperienceItem;
    onUpdate: (experience: WorkExperienceItem) => void;
    onRemove: () => void;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const YEARS = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

const WorkExperienceCard: React.FC<WorkExperienceCardProps> = ({ experience, onUpdate, onRemove }) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            const updates: Partial<WorkExperienceItem> = { isCurrent: checked };
            if (checked) {
                updates.endMonth = '';
                updates.endYear = '';
            }
            onUpdate({ ...experience, ...updates });
        } else {
            onUpdate({ ...experience, [name]: value });
        }
    };

    const commonInputClass = "w-full mt-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 disabled:bg-slate-100 dark:disabled:bg-slate-800";

    return (
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 relative">
             <button onClick={onRemove} className="absolute -top-2 -right-2 bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-full p-1 hover:bg-red-200 dark:hover:bg-red-800 hover:text-red-700 dark:hover:text-red-300 z-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
            <div className="space-y-3">
                <div>
                    <label className="block font-medium mb-1">Type</label>
                    <select name="type" value={experience.type} onChange={handleChange} className={commonInputClass}>
                        <option value="">-- Select Type --</option>
                        <option value="Paid">Paid</option>
                        <option value="Volunteer">Volunteer</option>
                        <option value="Community Work">Community Work</option>
                    </select>
                </div>

                <div>
                    <label className="block font-medium mb-1">Company / Organization</label>
                    <input type="text" name="company" value={experience.company} onChange={handleChange} placeholder="e.g., Tata Consultancy Services" className={commonInputClass}/>
                </div>

                <div>
                    <label className="block font-medium mb-1">Position / Title</label>
                    <input type="text" name="position" value={experience.position} onChange={handleChange} placeholder="e.g., Software Development Intern" className={commonInputClass}/>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium mb-1">Start Date</label>
                        <div className="flex gap-2">
                            <select name="startMonth" value={experience.startMonth} onChange={handleChange} className={`w-1/2 ${commonInputClass}`}><option value="">Mon</option>{MONTHS.map(m => <option key={m} value={m}>{m}</option>)}</select>
                            <select name="startYear" value={experience.startYear} onChange={handleChange} className={`w-1/2 ${commonInputClass}`}><option value="">Year</option>{YEARS.map(y => <option key={y} value={y}>{y}</option>)}</select>
                        </div>
                    </div>
                    <div>
                        <label className="block font-medium mb-1">End Date</label>
                        <div className="flex gap-2">
                            <select name="endMonth" value={experience.endMonth} onChange={handleChange} disabled={experience.isCurrent} className={`w-1/2 ${commonInputClass}`}><option value="">Mon</option>{MONTHS.map(m => <option key={m} value={m}>{m}</option>)}</select>
                            <select name="endYear" value={experience.endYear} onChange={handleChange} disabled={experience.isCurrent} className={`w-1/2 ${commonInputClass}`}><option value="">Year</option>{YEARS.map(y => <option key={y} value={y}>{y}</option>)}</select>
                        </div>
                    </div>
                </div>

                <div className="flex items-center pt-2">
                    <input type="checkbox" name="isCurrent" id={`isCurrent-${experience.id}`} checked={experience.isCurrent} onChange={handleChange} className="h-4 w-4 mr-2 accent-indigo-600"/>
                    <label htmlFor={`isCurrent-${experience.id}`} className="font-medium">I currently work here</label>
                </div>
                
                 <div>
                    <label className="block font-medium mb-1">Salary (Optional)</label>
                    <input type="text" name="salary" value={experience.salary} onChange={handleChange} placeholder="e.g., 5 Lakhs INR per annum" className={commonInputClass}/>
                </div>

                <div>
                    <label className="block font-medium mb-1">Description (Optional)</label>
                    <AutoResizeTextarea name="description" value={experience.description} onChange={handleChange} placeholder="Briefly describe your responsibilities and achievements." rows={2} className={`${commonInputClass} text-sm`}></AutoResizeTextarea>
                </div>

            </div>
        </div>
    );
};

export default WorkExperienceCard;