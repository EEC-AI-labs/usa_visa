import React, { useRef, useEffect, TextareaHTMLAttributes } from 'react';

type AutoResizeTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

const AutoResizeTextarea: React.FC<AutoResizeTextareaProps> = (props) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // This effect handles resizing the textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto'; // Reset height to recalculate
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [props.value]); // Dependency on `value` ensures it runs when content changes

    return (
        <textarea
            ref={textareaRef}
            {...props}
            style={{ ...props.style, overflow: 'hidden' }} // Hide scrollbar to prevent flickering
        />
    );
};

export default AutoResizeTextarea;
