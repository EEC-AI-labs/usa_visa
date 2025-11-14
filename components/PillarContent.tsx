import React, { useState }  from 'react';
import { Testimonial, Expert } from '../types';
import expert1 from '../images/expert1.png';
import expert2 from '../images/expert2.jpeg';
import expert3 from '../images/expert3.jpeg';



const ExpertImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => { 
     const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative h-24 w-24 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center">
      {!imageError && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
      {(!imageLoaded || imageError) && (
        <svg
          className="absolute h-24 w-24 text-slate-400 dark:text-slate-500"
          viewBox="0 0 100 100"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M50 48C58.2843 48 65 41.2843 65 33C65 24.7157 58.2843 18 50 18C41.7157 18 35 24.7157 35 33C35 41.2843 41.7157 48 50 48Z" />
          <path d="M50 54C35.0721 54 23 66.0721 23 81H77C77 66.0721 64.9279 54 50 54Z" />
        </svg>
      )}
    </div>
  );
};





const testimonials: Testimonial[] = [
    { name: "Rohan P.", university: "MS in CS, Arizona State University", quote: "My first visa was rejected. This tool's questions on my refusal were tougher than the real officer's! It forced me to prepare perfectly and I got my visa the second time.", focus: "Previous Refusal" },
    { name: "Anjali M.", university: "BS in Business, UIUC", quote: "The AI helped me turn my dad's 'kirana store' into a 'retail business' and explained my role in its future growth. The VO was really impressed with my clarity.", focus: "Family Business Background" },
    { name: "Vikram S.", university: "PhD in AI, Carnegie Mellon", quote: "I had a full scholarship but was nervous about proving ties. The career goal embellisher helped me create a powerful statement about starting an AI research lab in India. It was a game-changer.", focus: "Strong Ties & Career Goals" }
];

const experts: Expert[] = [
    { name: "Aarav Sharma", title: "Senior Visa Counselor (15+ Yrs Exp)", bio: "Aarav has guided over 5,000 students to F-1 visa success. He is a master at handling complex cases, including 214(b) refusals and petitions, ensuring every student presents their strongest possible case.", image: <ExpertImage src="https://ai.eecglobal.com/assets/expert1.png" alt="Aarav Sharma" /> },
    { name: "Priya Singh", title: "Lead AI Content Strategist", bio: "Priya leads the team that analyzes the latest consular interview trends. Her work ensures our AI asks the most relevant questions and provides guidance that is up-to-date for interviews happening right now.", image: <ExpertImage src="https://ai.eecglobal.com/assets/expert2.jpeg" alt="Priya Singh" /> }
];

const PillarContent: React.FC = () => {
    return (
        <section id="pillar-content" className="min-h-screen my-16 md:my-24 scroll-mt-20">
            <div className="max-w-4xl mx-auto space-y-16">
                
                {/* Introduction */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight sm:text-4xl">Your Authoritative Guide to F-1 Visa Success</h2>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Master the interview with expert knowledge, AI-driven insights, and proven strategies.</p>
                </div>

                {/* What is Non-Immigrant Intent? */}
                <div id="non-immigrant-intent" className="bg-white dark:bg-slate-800/50 p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 text-center">Understanding "Non-Immigrant Intent" & Section 214(b)</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                        Section 214(b) of U.S. immigration law presumes that every visa applicant intends to immigrate. To get an F-1 visa, you must overcome this presumption by proving you are a bona fide non-immigrant. This means you have strong, compelling ties to your home country and a clear plan to return after your studies. Our AI is specifically trained to help you demonstrate this.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-500/30">
                            <h4 className="font-semibold text-green-800 dark:text-green-300">✓ Strong Ties Include:</h4>
                            <ul className="mt-2 list-disc list-inside text-green-700 dark:text-green-400 space-y-1">
                                <li><strong>Family & Social Bonds:</strong> Immediate family, responsibilities at home.</li>
                                <li><strong>Economic Ties:</strong> Job offers, family businesses, property, investments.</li>
                                <li><strong>Future Career Plans:</strong> A specific, ambitious career path in India.</li>
                            </ul>
                        </div>
                         <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-500/30">
                            <h4 className="font-semibold text-red-800 dark:text-red-300">✗ Weak Ties or Red Flags:</h4>
                            <ul className="mt-2 list-disc list-inside text-red-700 dark:text-red-400 space-y-1">
                                <li>Vague post-graduation plans ("I'll see what happens").</li>
                                <li>Having many close relatives already in the U.S.</li>
                                <li>Choosing a course with no clear career path in India.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Comparison Table */}
                <div id="comparison" className="">
                     <h3 className="text-2xl font-bold text-slate-800  dark:text-slate-200 mb-6 text-center">Preparation Methods Compared</h3>
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="bg-slate-100 dark:bg-slate-800">
                                <tr>
                                    <th className="p-4 font-semibold">Feature</th>
                                    <th className="p-4 font-semibold text-center text-white bg-indigo-600 dark:bg-indigo-500">AI Prep Tool (This App)</th>
                                    <th className="p-4 font-semibold text-center">Traditional Agent</th>
                                    <th className="p-4 font-semibold text-center">Self-Study (Online Lists)</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-800/50">
                                <tr className="border-b border-slate-200 dark:border-slate-700"><td className="p-3 font-medium">Personalized Questions</td><td className="p-3 text-center text-green-600 dark:text-green-400 font-bold">✓ Hyper-Personalized</td><td className="p-3 text-center">General Advice</td><td className="p-3 text-center">Generic Only</td></tr>
                                <tr className="border-b border-slate-200 dark:border-slate-700"><td className="p-3 font-medium">Instant Feedback</td><td className="p-3 text-center text-green-600 dark:text-green-400 font-bold">✓ 24/7</td><td className="p-3 text-center text-red-600 dark:text-red-400">✗ Delayed</td><td className="p-3 text-center text-red-600 dark:text-red-400">✗ None</td></tr>
                                <tr className="border-b border-slate-200 dark:border-slate-700"><td className="p-3 font-medium">Practice Sessions</td><td className="p-3 text-center text-green-600 dark:text-green-400 font-bold">Unlimited</td><td className="p-3 text-center">1-2 Mock Interviews</td><td className="p-3 text-center">Self-directed</td></tr>
                                <tr className="border-b border-slate-200 dark:border-slate-700"><td className="p-3 font-medium">Handles Complex Cases</td><td className="p-3 text-center text-green-600 dark:text-green-400 font-bold">✓ Specialized Logic</td><td className="p-3 text-center">Varies by Agent</td><td className="p-3 text-center text-red-600 dark:text-red-400">✗ No Guidance</td></tr>
                                <tr><td className="p-3 font-medium">Cost-Effectiveness</td><td className="p-3 text-center text-green-600 dark:text-green-400 font-bold">High</td><td className="p-3 text-center">Low</td><td className="p-3 text-center">High (but ineffective)</td></tr>
                            </tbody>
                        </table>
                     </div>
                </div>

                {/* Success Stories */}
                <div id="success-stories">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6 text-center">Real Stories, Real Success</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col">
                                <span className="text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 px-2 py-1 rounded-full self-start mb-4">{t.focus}</span>
                                <p className="text-slate-600 dark:text-slate-300 flex-grow">"{t.quote}"</p>
                                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <p className="font-semibold text-slate-900 dark:text-slate-200">{t.name}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{t.university}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Meet the Experts */}
                <div id="experts" className="scroll-mt-20">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-8 text-center">Meet Our Visa Experts</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {experts.map((expert, i) => (
                             <div key={i} className="bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center text-center sm:text-left gap-6">
                                <div className="flex-shrink-0">{expert.image}</div>
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-200">{expert.name}</h4>
                                    <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-2">{expert.title}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{expert.bio}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Existing FAQ Section, now integrated */}
                <div id="faq" className="bg-white dark:bg-slate-800/50 p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6 text-center">Frequently Asked Questions</h3>
                    <div className="space-y-4">
                        <details className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border dark:border-slate-700">
                            <summary className="font-semibold text-slate-800 dark:text-slate-200 cursor-pointer flex justify-between items-center">How does this AI differ from generic lists online?<svg className="w-5 h-5 text-slate-500 dark:text-slate-400 chevron" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg></summary>
                            <div className="mt-3 text-slate-600 dark:text-slate-400 text-sm">Generic lists are static. Our AI creates a dynamic interview simulation just for you, analyzing your specific profile to generate 25-30 questions a real Visa Officer is likely to ask *you*.</div>
                        </details>
                        <details className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border dark:border-slate-700">
                            <summary className="font-semibold text-slate-800 dark:text-slate-200 cursor-pointer flex justify-between items-center">My visa was refused once. Can this help?<svg className="w-5 h-5 text-slate-500 dark:text-slate-400 chevron" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg></summary>
                            <div className="mt-3 text-slate-600 dark:text-slate-400 text-sm">Absolutely. The app is specifically designed to handle complex cases, generating tough follow-up questions about your refusal and what has changed in your profile.</div>
                        </details>
                         <details className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border dark:border-slate-700">
                            <summary className="font-semibold text-slate-800 dark:text-slate-200 cursor-pointer flex justify-between items-center">Is the AI's feedback aware of an Indian context?<svg className="w-5 h-5 text-slate-500 dark:text-slate-400 chevron" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg></summary>
                            <div className="mt-3 text-slate-600 dark:text-slate-400 text-sm">Yes. Developed by EEC, it's trained on data from thousands of Indian student interviews and understands nuances like family sponsorships and Indian academic qualifications.</div>
                        </details>
                         <details className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border dark:border-slate-700">
                            <summary className="font-semibold text-slate-800 dark:text-slate-200 cursor-pointer flex justify-between items-center">How is the app kept up-to-date?<svg className="w-5 h-5 text-slate-500 dark:text-slate-400 chevron" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg></summary>
                            <div className="mt-3 text-slate-600 dark:text-slate-400 text-sm">Our AI models and content are updated quarterly by EEC's senior visa counseling experts to reflect the latest consular interview trends and policy changes for late 2025 and beyond.</div>
                        </details>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PillarContent;