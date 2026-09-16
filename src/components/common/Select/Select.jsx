import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './Select.css';

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
    const [position, setPosition] = useState({
        top: 0,
        left: 0,
        width: 0,
    });

    const rootRef = useRef(null);
    const triggerRef = useRef(null);

    const normalized = options.map((opt) =>
        typeof opt === 'string'
            ? {
                  value: opt,
                  label: opt.replace(/_/g, ' '),
              }
            : opt
    );

    const selected = normalized.find(
        (opt) => opt.value === value
    );

    useEffect(() => {
        const handleClickOutside = (evt) => {
            if (
                rootRef.current &&
                !rootRef.current.contains(evt.target) &&
                !evt.target.closest('.custom-select-options')
            ) {
                setIsOpen(false);
            }
        };

        const handleEscape = (evt) => {
            if (evt.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener(
                'mousedown',
                handleClickOutside
            );

            document.removeEventListener(
                'keydown',
                handleEscape
            );
        };
    }, []);

    const updatePosition = () => {
        if (!triggerRef.current) return;

        const rect = triggerRef.current.getBoundingClientRect();

        setPosition({
            top: rect.bottom + window.scrollY + 6,
            left: rect.left + window.scrollX,
            width: rect.width,
        });
    };

    useEffect(() => {
        if (!isOpen) return;

        updatePosition();

        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener(
                'scroll',
                updatePosition,
                true
            );
        };
    }, [isOpen]);

    const handleToggle = () => {
        if (disabled) return;

        updatePosition();
        setIsOpen((prev) => !prev);
    };

    const handleSelect = (optValue) => {
        onChange(optValue);
        setIsOpen(false);
    };

    return (
        <div className="custom-select" ref={rootRef}>
            {label && (
                <span className="custom-select-label">
                    {label}
                </span>
            )}

            <button
                ref={triggerRef}
                type="button"
                id={id}
                className={`custom-select-trigger${
                    disabled ? ' is-disabled' : ''
                }`}
                onClick={handleToggle}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span
                    className={
                        selected
                            ? ''
                            : 'custom-select-placeholder'
                    }
                >
                    {selected ? selected.label : placeholder}
                </span>

                <span
                    className={`custom-select-chevron${
                        isOpen ? ' is-open' : ''
                    }`}
                />
            </button>

            {isOpen &&
                createPortal(
                    <ul
                        className="custom-select-options"
                        role="listbox"
                        style={{
                            position: 'absolute',
                            top: `${position.top}px`,
                            left: `${position.left}px`,
                            width: `${position.width}px`,
                            zIndex: 999999,
                        }}
                    >
                        {normalized.map((opt) => (
                            <li
                                key={opt.value}
                                role="option"
                                aria-selected={
                                    opt.value === value
                                }
                                className={`custom-select-option${
                                    opt.value === value
                                        ? ' is-selected'
                                        : ''
                                }`}
                                onClick={() =>
                                    handleSelect(opt.value)
                                }
                            >
                                {opt.label}
                            </li>
                        ))}
                    </ul>,
                    document.body
                )}
        </div>
    );
};

export default Select;