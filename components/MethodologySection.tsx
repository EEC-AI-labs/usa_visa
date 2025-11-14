import React from 'react';

const MethodologySection: React.FC = () => {
    return (
        <section id="methodology" className="">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Methodology */}
                    <div className="bg-white dark:bg-slate-800/60 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-xl text-indigo-700 dark:text-indigo-400 mb-3">Our AI's 'Secret Sauce'</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                            Our platform is powered by a proprietary system trained on a massive dataset of over 10,000 anonymized mock interviews and quarterly consular trend reports. This allows us to predict questions with high accuracy.
                        </p>
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500">
                             <h4 className="font-semibold text-sm text-indigo-800 dark:text-indigo-300">Proprietary Algorithm:</h4>
                             <p className="text-xs text-indigo-700 dark:text-indigo-400">
                                At its core is our **Non-Immigrant Intent Scoring (NIIS v3.0)**, an algorithm that analyzes your answers for key markers of "strong ties" to your home country.
                             </p>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="bg-white dark:bg-slate-800/60 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 text-center">
                        <h3 className="font-bold text-xl text-indigo-700 dark:text-indigo-400 mb-4">By the Numbers: Our Impact</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-200">92%</p>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">User Confidence Boost</p>
                            </div>
                            <div>
                                <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-200">5+</p>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Profile-Specific Weak Points Identified on Average</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Glossary */}
                <div id="glossary" className="mt-20 bg-white dark:bg-slate-800/60 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 scroll-mt-20">
                    <h3 className="font-bold text-xl text-indigo-700 dark:text-indigo-400 mb-4 text-center">F-1 Visa Glossary</h3>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                        <div>
                            <dt className="font-semibold text-slate-800 dark:text-slate-200">214(b)</dt>
                            <dd className="mt-1 text-slate-600 dark:text-slate-400">A section of U.S. immigration law stating that all visa applicants are considered intending immigrants until they prove otherwise. This is the most common reason for F-1 visa refusal.</dd>
                        </div>
                         <div>
                            <dt className="font-semibold text-slate-800 dark:text-slate-200">I-20 Form</dt>
                            <dd className="mt-1 text-slate-600 dark:text-slate-400">The "Certificate of Eligibility for Nonimmigrant Student Status" issued by your university. It's a mandatory document for your interview.</dd>
                        </div>
                         <div>
                            <dt className="font-semibold text-slate-800 dark:text-slate-200">SEVIS Fee</dt>
                            <dd className="mt-1 text-slate-600 dark:text-slate-400">A mandatory fee for the Student and Exchange Visitor Information System, a database that tracks international students in the U.S. Must be paid before the interview.</dd>
                        </div>
                         <div>
                            <dt className="font-semibold text-slate-800 dark:text-slate-200">Non-Immigrant Intent</dt>
                            <dd className="mt-1 text-slate-600 dark:text-slate-400">The crucial requirement to prove you have strong ties (financial, family, professional) to your home country and intend to return after completing your studies.</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </section>
    );
};

export default MethodologySection;