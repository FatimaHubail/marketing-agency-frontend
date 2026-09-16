import { useEffect, useRef, useState } from 'react';
import './Select.css';

/**
 * Custom-styled dropdown, replacing the native <select>.
 *
 * options: array of either strings, or { value, label } objects.
 * onChange receives the raw value directly (not an event).
 */
const Select = ({
    id,
    label,
    value,
    onChange,
    options,
    placeholder = 'Select...',
    disabled = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = useRef(null);

    const normalized = options.map((opt) =>
        typeof opt === 'string' ? { value: opt, label: opt.replace(/_/g, ' ') } : opt
    );

    const selected = normalized.find((opt) => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (evt) => {
            if (rootRef.current && !rootRef.current.contains(evt.target)) {
                setIsOpen(false);
            }
        };
        const handleEscape = (evt) => {
            if (evt.key === 'Escape') setIsOpen(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    const handleToggle = () => {
        if (disabled) return;
        setIsOpen((prev) => !prev);
    };

    const handleSelect = (optValue) => {
        onChange(optValue);
        setIsOpen(false);
    };

    return (
        <div className="custom-select" ref={rootRef}>
            {label && <span className="custom-select-label">{label}</span>}

            <button
                type="button"
                id={id}
                className={`custom-select-trigger${disabled ? ' is-disabled' : ''}`}
                onClick={handleToggle}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className={selected ? '' : 'custom-select-placeholder'}>
                    {selected ? selected.label : placeholder}
                </span>
                <span className={`custom-select-chevron${isOpen ? ' is-open' : ''}`} />
            </button>

            {isOpen && (
                <ul className="custom-select-options" role="listbox">
                    {normalized.map((opt) => (
                        <li
                            key={opt.value}
                            role="option"
                            aria-selected={opt.value === value}
                            className={`custom-select-option${opt.value === value ? ' is-selected' : ''}`}
                            onClick={() => handleSelect(opt.value)}
                        >
                            {opt.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Select;
