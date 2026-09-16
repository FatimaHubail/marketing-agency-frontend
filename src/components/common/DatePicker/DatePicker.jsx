import { useEffect, useRef, useState } from 'react';
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
    a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/**
 * Custom-styled date picker, replacing the native <input type="date">.
 * value / onChange use plain 'YYYY-MM-DD' strings.
 */
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
    const [viewDate, setViewDate] = useState(selectedDate || new Date());
    const rootRef = useRef(null);

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
        setViewDate(selectedDate || new Date());
        setIsOpen((prev) => !prev);
    };

    const changeMonth = (delta) => {
        setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
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
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const cells = [];
        for (let i = 0; i < startOffset; i++) cells.push(null);
        for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
        return cells;
    };

    const today = new Date();
    const displayLabel = selectedDate
        ? selectedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
        : placeholder;

    return (
        <div className="custom-datepicker" ref={rootRef}>
            {label && <span className="custom-datepicker-label">{label}</span>}

            <button
                type="button"
                id={id}
                className={`custom-datepicker-trigger${disabled ? ' is-disabled' : ''}`}
                onClick={handleToggle}
                disabled={disabled}
                aria-haspopup="dialog"
                aria-expanded={isOpen}
            >
                <span className={selectedDate ? '' : 'custom-datepicker-placeholder'}>{displayLabel}</span>
                <span className="custom-datepicker-icon" aria-hidden="true" />
            </button>

            {isOpen && (
                <div className="custom-datepicker-panel" role="dialog">
                    <div className="custom-datepicker-nav">
                        <button type="button" onClick={() => changeMonth(-1)} aria-label="Previous month">‹</button>
                        <span>{MONTH_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
                        <button type="button" onClick={() => changeMonth(1)} aria-label="Next month">›</button>
                    </div>

                    <div className="custom-datepicker-weekdays">
                        {WEEKDAYS.map((w) => <span key={w}>{w}</span>)}
                    </div>

                    <div className="custom-datepicker-grid">
                        {buildGrid().map((date, i) => {
                            if (!date) return <span key={`blank-${i}`} className="custom-datepicker-cell is-empty" />;

                            const isDisabled = (minDate && date < minDate) || (maxDate && date > maxDate);
                            const isSelected = isSameDay(date, selectedDate);
                            const isToday = isSameDay(date, today);

                            return (
                                <button
                                    type="button"
                                    key={date.toISOString()}
                                    className={`custom-datepicker-cell${isSelected ? ' is-selected' : ''}${isToday ? ' is-today' : ''}`}
                                    disabled={isDisabled}
                                    onClick={() => handlePick(date)}
                                >
                                    {date.getDate()}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DatePicker;
