import React, { useState, useEffect, useLayoutEffect } from 'react';



type Theme = 'light' | 'dark';

const SunIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
const MoonIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;

const ThemeSwitcher: React.FC = () => {
    const [theme, setTheme] = useState<Theme>(() => {
        const storedTheme = localStorage.getItem('f1-visa-theme');
        if (storedTheme === 'light' || storedTheme === 'dark') {
            return storedTheme;
        }
        // Fallback for old 'system' value or no value
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    useLayoutEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            localStorage.setItem('f1-visa-theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('f1-visa-theme', 'light');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full transition-colors text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? MoonIcon : SunIcon}
        </button>
    );
};


const Header: React.FC = () => {
    return (
        <header id="header" className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-lg sticky top-0 z-40 shadow-sm border-b border-slate-200 dark:border-slate-800">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                <img src="https://ai.eecglobal.com/assets/eeclogo.svg" alt="EEC" className="h-8" />
                        <span className="text-xl font-bold text-slate-800 dark:text-slate-200">USA F-1 Visa Prep</span>
                    </div>
                    <div className="flex items-center space-x-4 md:space-x-8">
                    
                        <ThemeSwitcher />
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;