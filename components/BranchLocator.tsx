import React, { useState, useMemo, useEffect } from 'react';
import { BRANCH_DATA, Branch } from '../branches';

type GroupedBranches = Record<string, Branch[]>;

// Icons as functional components
const MapPinIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);
const WhatsAppIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
);
const PhoneIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);

const normalizeCityName = (branch: Branch): string => {
    // This mapping handles legacy data where city was part of the name
    const cityMap: Record<string, string> = { 'EEC Vallabh Vidyanagar Anand': 'Anand' };
    if (branch.address.addressLocality && branch.address.addressLocality !== 'Nan' && branch.address.addressLocality.trim() !== '') {
        return branch.address.addressLocality;
    }
    return cityMap[branch.name] || 'Other';
}

const BranchCard: React.FC<{ branch: Branch }> = ({ branch }) => {
    const baseButtonClasses = "inline-flex items-center justify-center space-x-2 text-base font-semibold px-4 py-2 rounded-md bg-slate-100 dark:bg-gray-700/50 text-slate-700 dark:text-gray-300 transition-colors";

    return (
        <div className="bg-white dark:bg-slate-900/60 p-5 rounded-lg border border-slate-200 dark:border-slate-700 transform transition-all duration-300 hover:border-blue-500 dark:hover:border-blue-500/50 hover:scale-[1.02] shadow-lg hover:shadow-xl dark:shadow-[0_0_20px_theme(colors.blue.900/50%)] dark:hover:shadow-[0_0_30px_theme(colors.blue.600/50%)]">
            <h4 className="font-bold text-lg text-blue-600 dark:text-blue-300">{branch.name.replace('EEC ', '')} Branch</h4>
            <p className="text-base text-slate-500 dark:text-slate-300 mt-2 leading-relaxed">{branch.address.streetAddress}</p>
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-3">
                <a href={branch.hasMap} target="_blank" rel="noopener noreferrer" className={`${baseButtonClasses} hover:bg-teal-100 hover:text-teal-700 dark:hover:bg-teal-500/20 dark:hover:text-teal-300`} aria-label={`Get directions to ${branch.name}`}>
                    <MapPinIcon /> <span>View on Map</span>
                </a>
                {branch.contactPoint.map((contact, index) => (
                     <React.Fragment key={index}>
                        {contact.url && !contact.url.endsWith('nan') && (
                            <a href={contact.url} target="_blank" rel="noopener noreferrer" className={`${baseButtonClasses} hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-500/20 dark:hover:text-green-300`} aria-label={`WhatsApp ${branch.name}`}>
                                <WhatsAppIcon /> <span>WhatsApp</span>
                            </a>
                        )}
                        {contact.telephone && (
                             <a href={`tel:${contact.telephone}`} className={`${baseButtonClasses} hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-500/20 dark:hover:text-blue-300`} aria-label={`Call ${branch.name}`}>
                                <PhoneIcon /> <span>Call</span>
                            </a>
                        )}
                     </React.Fragment>
                ))}
            </div>
        </div>
    );
};


export const BranchLocator: React.FC = () => {
    const [selectedCity, setSelectedCity] = useState<string | null>(null);

    const groupedBranches = useMemo((): GroupedBranches => {
        const groups: GroupedBranches = {};
        BRANCH_DATA.forEach(branch => {
            const city = normalizeCityName(branch);
            if (!groups[city]) {
                groups[city] = [];
            }
            groups[city].push(branch);
        });
        return Object.keys(groups).reduce((acc, key) => {
            acc[key] = groups[key];
            return acc;
        }, {} as GroupedBranches);
    }, []);

    const cities = useMemo(() => Object.keys(groupedBranches), [groupedBranches]);

    useEffect(() => {
        // Set the first city as selected by default on mount, but only if no city is already selected.
        // This prevents overriding user selection on re-renders.
        if (cities.length > 0 && !selectedCity) {
            setSelectedCity(cities[0]);
        }
    }, [cities, selectedCity]);


    return (
        <section className="mt-16 py-12 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="max-w-6xl mx-auto px-4">
                <header className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Connect with EEC Branches</h2>
                    <p className="text-center text-lg text-slate-600 dark:text-slate-300 mt-2 max-w-2xl mx-auto">Our network of excellence across Gujarat is ready to provide expert guidance on your journey.</p>
                </header>
                
                <div className="grid md:grid-cols-12 gap-8 min-h-[60vh]">
                    <aside className="md:col-span-4 lg:col-span-3">
                         <div className="p-3 bg-slate-200/60 dark:bg-slate-800/50 rounded-lg border border-slate-300/60 dark:border-slate-700 sticky top-6">
                            <h3 className="font-semibold p-2 text-slate-800 dark:text-slate-200 text-base">Our Locations</h3>
                             <ul className="space-y-1">
                                {cities.map(city => (
                                    <li key={city}>
                                        <button 
                                            onClick={() => setSelectedCity(city)}
                                            className={`w-full text-left font-semibold px-3 py-2 rounded-md transition-colors text-base flex justify-between items-center ${selectedCity === city ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700/50'}`}
                                            aria-current={selectedCity === city ? 'page' : undefined}
                                        >
                                            <span>{city}</span>
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${selectedCity === city ? 'bg-blue-200 dark:bg-blue-500/50 text-blue-700 dark:text-blue-200' : 'bg-slate-300/80 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                                                {groupedBranches[city].length}
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>
                    <main className="md:col-span-8 lg:col-span-9">
                        {selectedCity && (
                             <div className="space-y-6">
                                {groupedBranches[selectedCity].map(branch => (
                                    <BranchCard key={branch.identifier} branch={branch} />
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </section>
    );
};