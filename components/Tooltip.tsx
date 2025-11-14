import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import ReactDOM from 'react-dom';

interface TooltipProps {
    content: string;
}

const TooltipPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mountNode, setMountNode] = useState<Element | null>(null);
    
    useLayoutEffect(() => {
        setMountNode(document.body);
    }, []);

    return mountNode ? ReactDOM.createPortal(children, mountNode) : null;
};

const Tooltip: React.FC<TooltipProps> = ({ content }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLButtonElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (isVisible && triggerRef.current && tooltipRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect();
            const tooltipRect = tooltipRef.current.getBoundingClientRect();
            
            const spaceAbove = triggerRect.top;
            const spaceBelow = window.innerHeight - triggerRect.bottom;
            const margin = 8;

            let top: number;
            // Position below if there's more space below, otherwise position above.
            if (spaceAbove < tooltipRect.height + margin && spaceBelow > spaceAbove) {
                top = triggerRect.bottom + margin;
            } else {
                top = triggerRect.top - tooltipRect.height - margin;
            }
            
            let left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);

            if (left < margin) {
                left = margin;
            }
            if (left + tooltipRect.width > window.innerWidth - margin) {
                left = window.innerWidth - tooltipRect.width - margin;
            }

            setPosition({ top, left });
        }
    }, [isVisible]);
    
    useEffect(() => {
        if (!isVisible) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (
                tooltipRef.current && !tooltipRef.current.contains(event.target as Node) &&
                triggerRef.current && !triggerRef.current.contains(event.target as Node)
            ) {
                setIsVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isVisible]);


    return (
        <>
            <button 
                ref={triggerRef}
                type="button"
                onClick={() => setIsVisible(v => !v)}
                className="p-3 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
                aria-label="Show information"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
            </button>
            <TooltipPortal>
                <div
                    ref={tooltipRef}
                    className={`
                        fixed z-50 px-3 py-2 
                        text-sm font-medium text-white bg-slate-800 dark:bg-slate-900 
                        rounded-lg shadow-lg 
                        w-max max-w-xs
                        transition-opacity duration-200 ease-in-out
                        ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                    `}
                    style={{ ...position }}
                    role="tooltip"
                >
                    {content}
                </div>
            </TooltipPortal>
        </>
    );
};

export default Tooltip;
