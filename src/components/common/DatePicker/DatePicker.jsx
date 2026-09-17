import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './DatePicker.css';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

const toISO = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');

    return `${y}-${m}-${d}`;
};

const parseISO = (iso) => {
    if (!iso) return null;

    const [y, m, d] = iso.split('-').map(Number);

    return new Date(y, m - 1, d);
};

const isSameDay = (a, b) =>
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

const DatePicker = ({
    id,
    label,
    value,
    onChange,
    placeholder = 'Select a date',
    disabled = false,
    min,
    max,
}) => {
    const selectedDate = parseISO(value);
    const minDate = parseISO(min);
    const maxDate = parseISO(max);

    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(
        selectedDate || new Date()
    );

    const [position, setPosition] = useState({
        top: 0,
        left: 0,
    });

    const rootRef = useRef(null);
    const triggerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (evt) => {
            if (
                rootRef.current &&
                !rootRef.current.contains(evt.target) &&
                !evt.target.closest('.custom-datepicker-panel')
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
            top: rect.bottom + window.scrollY + 8,
            left: rect.left + window.scrollX,
        });
    };

    useEffect(() => {
        if (!isOpen) return;

        updatePosition();

        window.addEventListener('resize', updatePosition);
        window.addEventListener(
            'scroll',
            updatePosition,
            true
        );

        return () => {
            window.removeEventListener(
                'resize',
                updatePosition
            );

            window.removeEventListener(
                'scroll',
                updatePosition,
                true
            );
        };
    }, [isOpen]);

    const handleToggle = () => {
        if (disabled) return;

        setViewDate(selectedDate || new Date());

        updatePosition();

        setIsOpen((prev) => !prev);
    };

    const changeMonth = (delta) => {
        setViewDate(
            (prev) =>
                new Date(
                    prev.getFullYear(),
                    prev.getMonth() + delta,
                    1
                )
        );
    };

    const handlePick = (date) => {
        onChange(toISO(date));
        setIsOpen(false);
    };

    const buildGrid = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();

        const firstOfMonth = new Date(year, month, 1);
        const startOffset = firstOfMonth.getDay();

        const daysInMonth = new Date(
            year,
            month + 1,
            0
        ).getDate();

        const cells = [];

        for (let i = 0; i < startOffset; i++) {
            cells.push(null);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            cells.push(new Date(year, month, d));
        }

        return cells;
    };

    const today = new Date();

    const displayLabel = selectedDate
        ? selectedDate.toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
          })
        : placeholder;

    return (
        <div
            className="custom-datepicker"
            ref={rootRef}
        >
            {label && (
                <span className="custom-datepicker-label">
                    {label}
                </span>
            )}

            <button
                ref={triggerRef}
                type="button"
                id={id}
                className={`custom-datepicker-trigger${
                    disabled ? ' is-disabled' : ''
                }`}
                onClick={handleToggle}
                disabled={disabled}
                aria-haspopup="dialog"
                aria-expanded={isOpen}
            >
                <span
                    className={
                        selectedDate
                            ? ''
                            : 'custom-datepicker-placeholder'
                    }
                >
                    {displayLabel}
                </span>

                <span
                    className="custom-datepicker-icon"
                    aria-hidden="true"
                />
            </button>

            {isOpen &&
                createPortal(
                    <div
                        className="custom-datepicker-panel"
                        role="dialog"
                        style={{
                            position: 'absolute',
                            top: `${position.top}px`,
                            left: `${position.left}px`,
                            zIndex: 999999,
                        }}
                    >
                        <div className="custom-datepicker-nav">
                            <button
                                type="button"
                                onClick={() =>
                                    changeMonth(-1)
                                }
                            >
                                ‹
                            </button>

                            <span>
                                {
                                    MONTH_NAMES[
                                        viewDate.getMonth()
                                    ]
                                }{' '}
                                {viewDate.getFullYear()}
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    changeMonth(1)
                                }
                            >
                                ›
                            </button>
                        </div>

                        <div className="custom-datepicker-weekdays">
                            {WEEKDAYS.map((day) => (
                                <span key={day}>
                                    {day}
                                </span>
                            ))}
                        </div>

                        <div className="custom-datepicker-grid">
                            {buildGrid().map((date, index) => {
                                if (!date) {
                                    return (
                                        <span
                                            key={`blank-${index}`}
                                            className="custom-datepicker-cell is-empty"
                                        />
                                    );
                                }

                                const isDisabled =
                                    (minDate &&
                                        date < minDate) ||
                                    (maxDate &&
                                        date > maxDate);

                                const isSelected =
                                    isSameDay(
                                        date,
                                        selectedDate
                                    );

                                const isToday =
                                    isSameDay(
                                        date,
                                        today
                                    );

                                return (
                                    <button
                                        type="button"
                                        key={date.toISOString()}
                                        className={`custom-datepicker-cell${
                                            isSelected
                                                ? ' is-selected'
                                                : ''
                                        }${
                                            isToday
                                                ? ' is-today'
                                                : ''
                                        }`}
                                        disabled={isDisabled}
                                        onClick={() =>
                                            handlePick(date)
                                        }
                                    >
                                        {date.getDate()}
                                    </button>
                                );
                            })}
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
};

export default DatePicker;