

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { UNIVERSITIES } from '../data/universities';

interface UniversitySuggestion {
    name: string;
    url: string;
}

interface UniversityInputProps {
    value: string;
    onChange: (value: string) => void;
}

const UniversityInput: React.FC<UniversityInputProps> = ({ value, onChange }) => {
    const [searchTerm, setSearchTerm] = useState(value);
    const [suggestions, setSuggestions] = useState<UniversitySuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    
    // Effect to handle clicks outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    // Effect to sync parent value to local state
    useEffect(() => {
        setSearchTerm(value);
    }, [value]);
    
    // Debounced search effect using local data
    useEffect(() => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        
        if (searchTerm.length > 2 && searchTerm !== value) {
            debounceTimeoutRef.current = setTimeout(() => {
                const filtered = UNIVERSITIES.filter(uni => 
                    uni.name.toLowerCase().includes(searchTerm.toLowerCase())
                ).slice(0, 10);
                
                setSuggestions(filtered);
                setShowSuggestions(true);
                setActiveIndex(-1);
            }, 50); // Use a short debounce for a smooth UX
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }

        return () => {
            if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
        };
    }, [searchTerm, value]);

    const handleSelect = useCallback((universityName: string) => {
        setSearchTerm(universityName);
        onChange(universityName);
        setShowSuggestions(false);
        setSuggestions([]);
    }, [onChange]);
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showSuggestions) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(prev => (prev > 0 ? prev - 1 : 0));
        } else if (e.key === 'Enter' && activeIndex > -1) {
            e.preventDefault();
            handleSelect(suggestions[activeIndex].name);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };
    
    return (
        <div className="autocomplete-wrapper" ref={wrapperRef}>
            <div className="relative">
                 <input
                    type="text"
                    id="university"
                    name="university"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g., Arizona State University"
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-shadow bg-white dark:bg-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    autoComplete="off"
                />
            </div>

            {showSuggestions && suggestions.length > 0 && (
                <div className="autocomplete-suggestions">
                    {suggestions.map((uni, index) => (
                        <div
                            key={`${uni.name}-${index}`}
                            className={`suggestion-item ${index === activeIndex ? 'is-active' : ''}`}
                            onClick={() => handleSelect(uni.name)}
                            onMouseOver={() => setActiveIndex(index)}
                        >
                            {uni.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UniversityInput;
