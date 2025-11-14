import React from 'react';
import youtubeThumbnail from '../images/youtube-img.jpeg';

const KnowledgeHub: React.FC = () => {
    return (
        <section id="knowledge-hub" className="pt-16 bg-slate-100/70 dark:bg-slate-900/50 scroll-mt-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">F-1 Visa Knowledge Hub</h2>
                    <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">Expert insights and resources for your interview preparation.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Article: Trends */}
                    <div className="bg-white dark:bg-slate-800/60 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-lg text-indigo-700 dark:text-indigo-400 mb-2">Decoding 2025-26 Interview Trends</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Based on our latest data from November 2025, consular officers are intensely focusing on your specific reasons for choosing a particular university and course. Vague answers are a major red flag. They are also probing deeper into financial plans beyond the first year. Our AI is tuned to grill you on these exact points, ensuring you're prepared for the questions that matter most right now.
                        </p>
                    </div>

                    {/* Article: State Spotlight */}
                     <div className="bg-white dark:bg-slate-800/60 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-lg text-indigo-700 dark:text-indigo-400 mb-2">Spotlight: Top US States</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            <strong>California:</strong> Be prepared to discuss high living costs and your specific budget.
                            <br/>
                            <strong>Texas:</strong> Emphasize how your degree connects to the booming tech and energy sectors in India.
                            <br/>
                            <strong>New York:</strong> Justify choosing a university in a competitive, high-density environment.
                        </p>
                    </div>

                    {/* Resource: Checklist */}
                     <div className="bg-white dark:bg-slate-800/60 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 md:col-span-2">
                        <h3 className="font-bold text-lg text-indigo-700 dark:text-indigo-400 mb-3">Financial Documentation Checklist</h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
                            <li className="flex items-start"><span className="text-indigo-500 mr-2 mt-1">&#10003;</span>Sponsor's Bank Statements (6 months)</li>
                            <li className="flex items-start"><span className="text-indigo-500 mr-2 mt-1">&#10003;</span>Loan Approval Letter (if applicable)</li>
                            <li className="flex items-start"><span className="text-indigo-500 mr-2 mt-1">&#10003;</span>Sponsor's Income Tax Returns (3 years)</li>
                            <li className="flex items-start"><span className="text-indigo-500 mr-2 mt-1">&#10003;</span>Affidavit of Support (Form I-134)</li>
                            <li className="flex items-start"><span className="text-indigo-500 mr-2 mt-1">&#10003;</span>Proof of Assets (Property, FDs, etc.)</li>
                             <li className="flex items-start"><span className="text-indigo-500 mr-2 mt-1">&#10003;</span>Scholarship/Assistantship Letter</li>
                        </ul>
                    </div>

                    {/* Video Embed Placeholder */}
                    <div className="bg-white dark:bg-slate-800/60 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 md:col-span-2">
                        <h3 className="font-bold text-lg text-indigo-700 dark:text-indigo-400 mb-4">Watch: Acing Your F-1 Interview</h3>
                         <div className="aspect-w-16 aspect-h-9 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden flex  items-center justify-center">
                                <div className="relative aspect-w-16 aspect-h-9 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden">
                                        <img
                                            src="https://ai.eecglobal.com/assets/youtube-img.jpeg"
                                            alt="Video Guide Preview"
                                            className="object-cover w-full h-full"
                                        />
                                        <p className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-slate-100 bg-black/40 dark:bg-black/50">
                                            Video Guide Coming Soon
                                        </p>
                                </div>
                         </div>

                    </div>

                </div>
            </div>
        </section>
    );
};

export default KnowledgeHub;
