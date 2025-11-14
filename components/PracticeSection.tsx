import React, { useState, useEffect, useRef, forwardRef, useCallback, useMemo } from 'react';
import { PrepContent, HistoryItem, Question } from '../types';
import { translateText, transcribeAudio } from '../services/geminiService';
import AutoResizeTextarea from './AutoResizeTextarea';



// --- Custom Hook for Audio Recording ---
type RecordingState = 'idle' | 'recording' | 'recorded' | 'error';

const useAudioRecorder = () => {
    const [recordingState, setRecordingState] = useState<RecordingState>('idle');
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const isSupported = !!navigator.mediaDevices?.getUserMedia && !!window.MediaRecorder;

    const startRecording = useCallback(async () => {
        if (!isSupported) {
            setRecordingState('error');
            setError("Audio recording is not supported on this browser.");
            console.error("MediaRecorder or getUserMedia not supported.");
            return;
        }
        setAudioBlob(null);
        setError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                setRecordingState('recorded');
                audioChunksRef.current = [];
                // Stop all tracks to release the microphone
                stream.getTracks().forEach(track => track.stop());
            };
            
            mediaRecorderRef.current.onerror = (event) => {
                console.error("MediaRecorder error:", event);
                setError("A recording error occurred. Please check your microphone.");
                setRecordingState('error');
            };

            audioChunksRef.current = [];
            mediaRecorderRef.current.start();
            setRecordingState('recording');
        } catch (err) {
            console.error("Error starting recording:", err);
            if (err instanceof Error) {
                if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
                    setError("Microphone access was denied. Please enable it in your browser settings and refresh the page.");
                } else {
                    setError("Could not start recording. Please ensure your microphone is connected and working.");
                }
            }
            setRecordingState('error');
        }
    }, [isSupported]);
    
    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
    }, []);

    const reset = useCallback(() => {
        setAudioBlob(null);
        setRecordingState('idle');
        setError(null);
    }, []);

    return { recordingState, startRecording, stopRecording, audioBlob, reset, isSupported, error };
};


// --- Helper Components ---
const Spinner: React.FC<{className?: string}> = ({className = "h-4 w-4 text-indigo-600 dark:text-indigo-400"}) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

// --- TranslatableContent Component ---
interface TranslatableContentProps {
    contentId: string;
    htmlContent: string;
}

const TranslatableContent: React.FC<TranslatableContentProps> = ({ contentId, htmlContent }) => {
    const [translations, setTranslations] = useState<{ [key: string]: string }>({ en: htmlContent });
    const [currentLang, setCurrentLang] = useState<'en' | 'hi' | 'gu'>('en');
    const [isTranslating, setIsTranslating] = useState<string | null>(null);

    useEffect(() => {
        setTranslations({ en: htmlContent });
        setCurrentLang('en');
    }, [htmlContent]);

    const handleTranslate = async (lang: 'hi' | 'gu' | 'en') => {
        if (lang === 'en' || translations[lang]) {
            setCurrentLang(lang);
            return;
        }
        
        setIsTranslating(lang);
        try {
            const translated = await translateText(htmlContent, lang);
            if (translated) {
                setTranslations(prev => ({ ...prev, [lang]: translated }));
                setCurrentLang(lang);
            }
        } catch (error) {
            console.error("Translation failed", error);
        } finally {
            setIsTranslating(null);
        }
    };
    
    const getButtonClass = (lang: 'en' | 'hi' | 'gu') => {
        const base = 'text-xs font-semibold py-1 px-3 rounded-full transition-colors flex items-center justify-center min-w-[60px] h-6';
        if (currentLang === lang) {
            return `${base} bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400`;
        }
        return `${base} bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-wait`;
    };

    if (!htmlContent) return null;

    return (
        <>
            <div className="translation-controls flex items-center justify-end gap-2 mb-2" data-content-id={contentId}>
                <button onClick={() => handleTranslate('en')} className={getButtonClass('en')}>English</button>
                <button onClick={() => handleTranslate('hi')} disabled={isTranslating === 'hi'} className={getButtonClass('hi')}>
                    {isTranslating === 'hi' ? <Spinner /> : 'हिन्दी'}
                </button>
                <button onClick={() => handleTranslate('gu')} disabled={isTranslating === 'gu'} className={getButtonClass('gu')}>
                    {isTranslating === 'gu' ? <Spinner /> : 'ગુજરાતી'}
                </button>
            </div>
            <div dangerouslySetInnerHTML={{ __html: translations[currentLang] || htmlContent }} />
        </>
    );
}

interface QuestionWithSection extends Question {
    sectionTitle: string;
}

// --- Main PracticeSection Component ---
interface PracticeSectionProps {
    prepContent: PrepContent | null;
    history: HistoryItem[];
    onGetFeedback: (question: string, transcript: string) => Promise<HistoryItem | null>;
    onClearHistory: () => void;
}

const PracticeSection = forwardRef<HTMLElement, PracticeSectionProps>(({ prepContent, history, onGetFeedback, onClearHistory }, ref) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [activeTab, setActiveTab] = useState<'guidance' | 'practice'>('guidance');
    const [latestFeedback, setLatestFeedback] = useState<HistoryItem | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [timer, setTimer] = useState(0);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
            

    const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const { recordingState, startRecording, stopRecording, audioBlob, reset: resetRecorder, isSupported, error: recorderError } = useAudioRecorder();
    const isRecording = recordingState === 'recording';

    const allQuestions = useMemo(() => {
        if (!prepContent) return [];
        return prepContent.sections.flatMap(s => s.questions.map(q => ({ ...q, sectionTitle: s.title })));
    }, [prepContent]);


    useEffect(() => {
        setCurrentQuestionIndex(0);
        setLatestFeedback(null);
        setActiveTab('guidance');
    }, [prepContent]);

    useEffect(() => {
        if (!allQuestions.length) return;
        const currentQuestionText = allQuestions[currentQuestionIndex].question;
        const historyItem = history.find(h => h.question === currentQuestionText) || null;
        setLatestFeedback(historyItem);
        setTranscript(historyItem?.transcript || '');
        resetRecorder();
        setIsTranscribing(false);
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        setTimer(0);
    }, [currentQuestionIndex, allQuestions, history, resetRecorder]);

    useEffect(() => {
        if (!audioBlob) {
            setAudioUrl(prev => {
                if (prev) URL.revokeObjectURL(prev);
                return null;
            });
            return;
        }

        const newUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(prev => {
            if (prev) URL.revokeObjectURL(prev);
            return newUrl;
        });

        return () => {
            URL.revokeObjectURL(newUrl);
        };
    }, [audioBlob]);

    useEffect(() => {
        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
        };
    }, []);

    const beginRecordingSession = () => {
        setLatestFeedback(null);
        setTranscript('');
        setTimer(0);
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = setInterval(() => setTimer(t => t + 1), 1000);
        setAudioUrl(prev => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
        });
        resetRecorder();
        startRecording();
    };

    const handleRecordClick = () => {
        if (!isRecording) {
            beginRecordingSession();
        } else {
            stopRecording();
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        }
    };

    const handleStartRecording = () => {
        if (!isRecording) {
            beginRecordingSession();
        }
    };
    
    const handleTranscribe = async () => {
        if (!audioBlob) return;
        setIsTranscribing(true);
        try {
            const result = await transcribeAudio(audioBlob);
            setTranscript(result || "Could not transcribe audio. Please try again.");
        } catch (error) {
            console.error(error);
            const message = error instanceof Error ? error.message : "An unknown error occurred during transcription.";
            setTranscript(`Error: ${message}`);
        } finally {
            setIsTranscribing(false);
        }
    };

    const handleSubmitForFeedback = async () => {
        setIsAnalyzing(true);
        const question = allQuestions[currentQuestionIndex]?.question;
        if (question && transcript) {
            const feedback = await onGetFeedback(question, transcript.trim());
            if (feedback) {
                setLatestFeedback(feedback);
            }
        }
        setIsAnalyzing(false);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    if (!prepContent) return null;

    const currentQuestion = allQuestions[currentQuestionIndex];
    const prevQuestion = allQuestions[currentQuestionIndex - 1];
    const showSectionTitle = !prevQuestion || currentQuestion.sectionTitle !== prevQuestion.sectionTitle;

    const score = latestFeedback?.score;
    const scoreColor = score !== undefined ? (score >= 8 ? 'text-green-600 bg-green-100 dark:bg-green-500/10 dark:text-green-400' : score >= 5 ? 'text-yellow-600 bg-yellow-100 dark:bg-yellow-500/10 dark:text-yellow-400' : 'text-red-600 bg-red-100 dark:bg-red-500/10 dark:text-red-400') : '';
    const isBusy = isRecording || isAnalyzing || isTranscribing;

    return (
        <>
            <section id="interview-flow" ref={ref} className="mb-16 fade-in">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-12">
                        <TranslatableContent contentId="key-talking-points" htmlContent={prepContent.keyTalkingPoints} />
                    </div>
                    
                    {showSectionTitle && (
                        <div className="mb-6 text-center">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 border-b-2 border-indigo-500 dark:border-indigo-400 inline-block pb-2 px-4">
                                {currentQuestion.sectionTitle}
                            </h2>
                        </div>
                    )}
                    
                    <div className="bg-white dark:bg-slate-800/50 p-6 sm:p-8 rounded-2xl shadow-lg dark:shadow-2xl border border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">Question {currentQuestionIndex + 1} of {allQuestions.length}</h3>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setCurrentQuestionIndex(i => i - 1)} disabled={currentQuestionIndex === 0} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                                </button>
                                <button onClick={() => setCurrentQuestionIndex(i => i + 1)} disabled={currentQuestionIndex === allQuestions.length - 1} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                                </button>
                            </div>
                        </div>
                        
                        <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">{currentQuestion.question}</p>

                        <div className="border-b border-slate-200 dark:border-slate-700 my-6">
                            <nav className="-mb-px flex space-x-4">
                                <button onClick={() => setActiveTab('guidance')} className={`py-2 px-1 border-b-2 text-sm sm:text-base transition-colors ${activeTab === 'guidance' ? 'border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 font-semibold' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'}`}>Model Answer & Guidance</button>
                                <button onClick={() => setActiveTab('practice')} className={`py-2 px-1 border-b-2 text-sm sm:text-base transition-colors ${activeTab === 'practice' ? 'border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 font-semibold' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'}`}>Practice Your Answer</button>
                            </nav>
                        </div>

                        <div>
                            {activeTab === 'guidance' && (
                                <div className="prose prose-slate max-w-none dark:prose-invert">
                                    <TranslatableContent contentId={`guidance-${currentQuestionIndex}`} htmlContent={`<h4>Model Answer</h4>${currentQuestion.modelAnswer}<h4>Guidance</h4>${currentQuestion.guidance}`} />
                                </div>
                            )}
                            {activeTab === 'practice' && (
                                <div>
                                    <div className="flex flex-col sm:flex-row items-center gap-3 justify-evenly">
                                        <div className="flex flex-col items-center">
                                            <img src="https://ai.eecglobal.com/assets/form.jpeg" alt="EEC" className="w-full sm:w-2/3 md:w-1/2  lg:w-1/2 rounded-xl object-cover shadow-md transition-shadow duration-200 hover:shadow-xl cursor-pointer  max-[680px]:w-4/5 max-[640px]:w-[85%]" />   <p className="mt-4 text-base text-slate-700 dark:text-slate-300 text-center">Real US Consulate India Visa Interview Counter/Window </p>
                                        </div>
                                    <div className="text-center py-4">

                                        <button onClick={handleRecordClick} disabled={!isSupported || isAnalyzing || isTranscribing} className={`relative bg-red-600 text-white font-semibold py-4 px-8 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all transform hover:scale-105 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center mx-auto gap-3 min-w-[12rem] ${isRecording ? 'recording-pulse' : ''}`}>
                                            <span className="flex items-center justify-center gap-3">
                                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C15.3137 2 18 4.68629 18 8V12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12V8C6 4.68629 8.68629 2 12 2Z M12 4C9.79086 4 8 5.79086 8 8V12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12V8C16 5.79086 14.2091 4 12 4Z M20 12V13C20 17.4183 16.4183 21 12 21C7.58172 21 4 17.4183 4 13V12H2V13C2 17.968 5.84581 22 10.5 22V24H13.5V22C18.1542 22 22 17.968 22 13V12H20Z"></path></svg>
                                                <span>
                                                    {isRecording ? 'Stop Recording' : 
                                                    recordingState === 'error' ? 'Recording Error' : 
                                                    'Start New Recording'}
                                                </span>
                                            </span>
                                        </button>

                                        
                                        <div className="h-6 mt-4">
                                            {recorderError ? (
                                                <p className="text-red-500 dark:text-red-400 text-sm font-semibold">{recorderError}</p>
                                            ) : (
                                                <p className="text-slate-500 dark:text-slate-400 font-mono">
                                                    {isRecording ? formatTime(timer) : 
                                                    recordingState === 'recorded' ? 'Recording complete.' : 
                                                    'Ready to record.'}
                                                </p>
                                            )}
                                        </div>
                                        </div>
                                    </div>





                                    {!isRecording && audioUrl && !transcript && (
                                        <div className="mt-4 text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border dark:border-slate-600">
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Recording complete. Ready to transcribe.</p>
                                            <audio controls src={audioUrl} className="w-full"></audio>
                                            <div className="flex flex-col sm:flex-row gap-4 mt-4">
                                                <button onClick={handleStartRecording} disabled={isBusy} className="flex-1 bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500 disabled:opacity-50">
                                                    Record Again
                                                </button>
                                                <button onClick={handleTranscribe} disabled={isTranscribing || isAnalyzing} className="flex-1 bg-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-500 disabled:bg-slate-400 dark:disabled:bg-slate-600">
                                                    {isTranscribing ? 'Transcribing...' : 'Transcribe Audio'}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {transcript && (
                                    <div className="mt-4">
                                        <label htmlFor="transcript-textarea" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Your Answer Transcript:</label>
                                        <AutoResizeTextarea id="transcript-textarea" value={transcript} onChange={(e) => setTranscript(e.target.value)} disabled={isRecording || isTranscribing} className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-shadow disabled:bg-slate-100 dark:disabled:bg-slate-800" rows={3}></AutoResizeTextarea>
                                        
                                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <button onClick={handleStartRecording}  disabled={isBusy} className="w-full bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-slate-700 dark:hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all transform disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50">
                                            Record Again
                                            </button>
                                            <button onClick={handleSubmitForFeedback} disabled={!transcript || isAnalyzing || isTranscribing || isRecording} className="w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed">
                                                {isAnalyzing ? 'Analyzing...' : 'Submit for Feedback'}
                                            </button>
                                        </div>
                                    </div>
                                    )}

                                    {latestFeedback && (
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700/80 mt-6 fade-in">
                                            <div>
                                                <div className="flex justify-between items-start gap-4">
                                                    <div>
                                                        <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Your Feedback</h4>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(latestFeedback.timestamp).toLocaleString()}</p>
                                                    </div>
                                                    <div className="text-center ml-4 flex-shrink-0">
                                                        <div className={`w-24 h-24 rounded-full flex items-center justify-center ${scoreColor}`}>
                                                            <p className="text-4xl font-extrabold">{latestFeedback.score}<span className="text-2xl font-semibold opacity-60">/10</span></p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 prose prose-slate max-w-none prose-sm dark:prose-invert">
                                                    <TranslatableContent contentId={`feedback-${latestFeedback.id}`} htmlContent={latestFeedback.feedback} />
                                                </div>
                                                <h5 className="font-semibold mt-6 mb-2 text-slate-700 dark:text-slate-300 text-sm">Your Answer Transcript:</h5>
                                                <p className="text-sm p-3 bg-white dark:bg-slate-900/70 rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">{latestFeedback.transcript}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            
            {history.length > 0 && (
                <section id="history" className="mb-16 fade-in">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-center border-b-2 border-slate-200 dark:border-slate-700 pb-3 mb-8">
                           <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-200">Practice History</h2>
                           <button onClick={onClearHistory} className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-500 transition-colors flex items-center gap-1">
                                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                                Clear History
                           </button>
                       </div>
                       <div className="space-y-4">
                           {history.map(item => {
                               const itemScoreColor = item.score >= 8 ? 'bg-green-100 dark:bg-green-500/10 text-green-800 dark:text-green-300' : item.score >= 5 ? 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-800 dark:text-yellow-300' : 'bg-red-100 dark:bg-red-500/10 text-red-800 dark:text-red-300';
                               return (
                                   <details key={item.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden border border-slate-200 dark:border-slate-700">
                                       <summary className="flex justify-between items-center p-4 cursor-pointer">
                                           <div className="flex-grow pr-4">
                                               <p className="font-semibold text-slate-700 dark:text-slate-300">{item.question}</p>
                                               <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(item.timestamp).toLocaleString()}</p>
                                           </div>
                                           <div className="ml-4 flex items-center space-x-4 flex-shrink-0">
                                              <span className={`text-sm font-bold px-3 py-1 rounded-full ${itemScoreColor}`}>{item.score}/10</span>
                                              <svg className="w-5 h-5 text-slate-500 dark:text-slate-400 chevron" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                           </div>
                                       </summary>
                                       <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50">
                                            <div className="prose prose-sm prose-slate max-w-none dark:prose-invert">
                                                <h5 className="font-semibold mt-0 mb-1 text-xs text-slate-600 dark:text-slate-400 uppercase">Content Feedback</h5>
                                                <TranslatableContent contentId={`history-feedback-${item.id}`} htmlContent={item.feedback} />
                                            </div>

                                            <div className="mt-4">
                                                <h5 className="font-semibold mb-1 text-xs text-slate-600 dark:text-slate-400 uppercase">Your Answer:</h5>
                                                <p className="text-sm text-slate-600 dark:text-slate-300 !mt-1">{item.transcript}</p>
                                            </div>
                                       </div>
                                   </details>
                               );
                           })}
                       </div>
                    </div>
                </section>
            )}
        </>
    );
});

export default PracticeSection;