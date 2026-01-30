'use client';
import { useState, useRef, useEffect } from 'react';

interface Option {
    value: string;
    label: string;
}

interface SelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    animatedPlaceholders?: string[];
    className?: string;
}

export default function Select({ options, value, onChange, placeholder = 'Select', animatedPlaceholders, className = '' }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Animation Logic
    const [placeholderText, setPlaceholderText] = useState(placeholder);
    useEffect(() => {
        if (!animatedPlaceholders || animatedPlaceholders.length === 0 || value) {
            setPlaceholderText(placeholder);
            return;
        }

        let currentIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let timeoutId: NodeJS.Timeout;

        const type = () => {
            const currentString = animatedPlaceholders[currentIndex];

            if (isDeleting) {
                setPlaceholderText(currentString.substring(0, charIndex - 1));
                charIndex--;
            } else {
                setPlaceholderText(currentString.substring(0, charIndex + 1));
                charIndex++;
            }

            let typeSpeed = 100;

            if (isDeleting) typeSpeed /= 2;

            if (!isDeleting && charIndex === currentString.length) {
                isDeleting = true;
                typeSpeed = 2000; // Pause at end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                currentIndex = (currentIndex + 1) % animatedPlaceholders.length;
                typeSpeed = 500; // Pause before typing next
            }

            timeoutId = setTimeout(type, typeSpeed);
        };

        timeoutId = setTimeout(type, 100);

        return () => clearTimeout(timeoutId);
    }, [animatedPlaceholders, value, placeholder]);

    const selectedLabel = options.find(o => o.value === value)?.label || (value ? placeholder : placeholderText);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`} ref={containerRef} style={{ width: '100%', position: 'relative' }}>
            <div
                className="input"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    userSelect: 'none',
                    background: 'var(--background)'
                }}
            >
                <span style={{ color: value ? 'var(--primary-text)' : 'var(--secondary-text)', minHeight: '1.5em', display: 'inline-block' }}>
                    {selectedLabel || '\u00A0'}
                </span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            {isOpen && (
                <ul style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    background: 'var(--card-bg)', border: '1px solid var(--border)',
                    borderRadius: '6px', marginTop: '4px', zIndex: 100,
                    maxHeight: '250px', overflowY: 'auto', padding: 0, listStyle: 'none',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>

                    {options.map((opt) => (
                        <li
                            key={opt.value}
                            className="select-item"
                            onClick={() => { onChange(opt.value); setIsOpen(false); }}
                            style={{
                                padding: '0.75rem',
                                cursor: 'pointer',
                                borderTop: '1px solid rgba(0,0,0,0.05)',
                                background: opt.value === value ? 'rgba(65, 90, 119, 0.1)' : 'transparent',
                            }}
                        >
                            {opt.label}
                        </li>
                    ))}
                </ul>
            )}
            <style jsx global>{`
        .select-item:hover {
           background-color: var(--accent) !important;
           color: white !important;
        }
      `}</style>
        </div>
    );
}
