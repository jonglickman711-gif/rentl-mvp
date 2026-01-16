import React, { useState, useMemo } from 'react';
import theme from '../styles/themes';

/**
 * AvailabilityCalendar - A reusable calendar component for selecting date ranges
 * 
 * @param {Array} availabilityRanges - Array of { start: Date, end: Date } objects representing available date ranges
 * @param {Date} value.startDate - Currently selected start date (controlled)
 * @param {Date} value.endDate - Currently selected end date (controlled)
 * @param {Function} onChange - Callback called with { startDate, endDate } when selection changes
 * @param {Date} minDate - Minimum selectable date (defaults to today)
 * @param {Date} maxDate - Maximum selectable date (optional)
 * @param {Date} initialMonth - Initial month to display (defaults to current month)
 */
const AvailabilityCalendar = ({
  availabilityRanges = [],
  value = { startDate: null, endDate: null },
  onChange,
  minDate = new Date(),
  maxDate = null,
  initialMonth = new Date(),
}) => {
  const [currentMonth, setCurrentMonth] = useState(
    new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1)
  );
  const [hoverDate, setHoverDate] = useState(null);

  // Normalize dates to start of day for comparison
  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // Check if a date is within any availability range
  const isDateAvailable = (date) => {
    if (!availabilityRanges || availabilityRanges.length === 0) {
      return true; // If no ranges provided, all dates are available
    }

    const normalizedDate = normalizeDate(date);
    return availabilityRanges.some((range) => {
      const start = normalizeDate(range.start);
      const end = normalizeDate(range.end);
      return normalizedDate >= start && normalizedDate <= end;
    });
  };

  // Check if a date is selectable (available and within min/max bounds)
  const isDateSelectable = (date) => {
    const normalizedDate = normalizeDate(date);
    const normalizedMin = normalizeDate(minDate);
    const normalizedMax = maxDate ? normalizeDate(maxDate) : null;

    if (normalizedDate < normalizedMin) return false;
    if (normalizedMax && normalizedDate > normalizedMax) return false;
    return isDateAvailable(date);
  };

  // Check if a date is in the selected range
  const isInSelectedRange = (date) => {
    if (!value.startDate || !value.endDate) return false;
    const normalizedDate = normalizeDate(date);
    const start = normalizeDate(value.startDate);
    const end = normalizeDate(value.endDate);
    return normalizedDate >= start && normalizedDate <= end;
  };

  // Check if a date is the start or end of selection
  const isSelectionEdge = (date) => {
    if (!value.startDate && !value.endDate) return false;
    const normalizedDate = normalizeDate(date);
    if (value.startDate && normalizedDate.getTime() === normalizeDate(value.startDate).getTime()) {
      return 'start';
    }
    if (value.endDate && normalizedDate.getTime() === normalizeDate(value.endDate).getTime()) {
      return 'end';
    }
    return false;
  };

  // Get calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();
    
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    // Add days from previous month to fill the first week
    const prevMonth = new Date(year, month, 0);
    const daysInPrevMonth = prevMonth.getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, daysInPrevMonth - i),
        isCurrentMonth: false,
      });
    }
    
    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true,
      });
    }
    
    // Add days from next month to fill the last week (42 days total for 6 weeks)
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false,
      });
    }
    
    return days;
  }, [currentMonth]);

  // Handle date click
  const handleDateClick = (date) => {
    if (!isDateSelectable(date)) return;

    const normalizedDate = normalizeDate(date);

    // If no start date, set start
    if (!value.startDate) {
      onChange?.({ startDate: normalizedDate, endDate: null });
      return;
    }

    // If start date exists but no end date
    if (value.startDate && !value.endDate) {
      const start = normalizeDate(value.startDate);
      
      // If clicked date is before start, make it the new start
      if (normalizedDate < start) {
        onChange?.({ startDate: normalizedDate, endDate: start });
        return;
      }

      // Check if all dates in range are available
      let allAvailable = true;
      for (let d = new Date(start); d <= normalizedDate; d.setDate(d.getDate() + 1)) {
        if (!isDateSelectable(d)) {
          allAvailable = false;
          break;
        }
      }

      if (allAvailable) {
        onChange?.({ startDate: start, endDate: normalizedDate });
      } else {
        // If range is invalid, start a new selection
        onChange?.({ startDate: normalizedDate, endDate: null });
      }
      return;
    }

    // If both dates exist, start a new selection
    onChange?.({ startDate: normalizedDate, endDate: null });
  };

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Get month/year string
  const monthYearString = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Weekday headers
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Check if date should be highlighted in range preview (hover state)
  const isInHoverRange = (date) => {
    if (!value.startDate || value.endDate || !hoverDate) return false;
    const normalizedDate = normalizeDate(date);
    const start = normalizeDate(value.startDate);
    const hover = normalizeDate(hoverDate);
    
    if (hover < start) {
      return normalizedDate >= hover && normalizedDate <= start;
    }
    return normalizedDate >= start && normalizedDate <= hover;
  };

  // Check if date would be valid in hover range
  const isValidInHoverRange = (date) => {
    if (!value.startDate || value.endDate || !hoverDate) return false;
    const normalizedDate = normalizeDate(date);
    const start = normalizeDate(value.startDate);
    const hover = normalizeDate(hoverDate);
    
    const rangeStart = hover < start ? hover : start;
    const rangeEnd = hover < start ? start : hover;
    
    return normalizedDate >= rangeStart && normalizedDate <= rangeEnd;
  };

  const styles = {
    container: {
      width: '100%',
      maxWidth: '400px',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      border: `1px solid ${theme.colors.border}`,
      padding: theme.spacing[6],
      fontFamily: theme.typography.fonts.primary,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing[4],
    },
    monthYear: {
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.text,
    },
    navButton: {
      background: 'transparent',
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.radius.sm,
      padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
      cursor: 'pointer',
      color: theme.colors.text,
      fontSize: theme.typography.sizes.base,
      transition: `all ${theme.motion.normal} ${theme.motion.easing}`,
    },
    navButtonHover: {
      backgroundColor: theme.colors.surfaceHover,
      borderColor: theme.colors.borderStrong,
    },
    weekdays: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: theme.spacing[1],
      marginBottom: theme.spacing[2],
    },
    weekday: {
      textAlign: 'center',
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.medium,
      color: theme.colors.textSubtle,
      padding: theme.spacing[2],
    },
    daysGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: theme.spacing[1],
    },
    day: {
      aspectRatio: '1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radius.sm,
      fontSize: theme.typography.sizes.base,
      cursor: 'pointer',
      transition: `all ${theme.motion.fast} ${theme.motion.easing}`,
      position: 'relative',
      border: 'none',
      background: 'transparent',
    },
    dayCurrentMonth: {
      color: theme.colors.text,
    },
    dayOtherMonth: {
      color: theme.colors.textMuted,
    },
    dayAvailable: {
      backgroundColor: theme.colors.surface,
      '&:hover': {
        backgroundColor: theme.colors.surfaceHover,
      },
    },
    dayUnavailable: {
      backgroundColor: theme.colors.bgSubtle,
      color: theme.colors.textMuted,
      cursor: 'not-allowed',
      opacity: 0.5,
      textDecoration: 'line-through',
    },
    dayInRange: {
      backgroundColor: theme.colors.primarySoft,
      color: theme.colors.text,
    },
    daySelectionStart: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.textOnDark,
      fontWeight: theme.typography.weights.semibold,
      borderRadius: `${theme.radius.sm} 0 0 ${theme.radius.sm}`,
    },
    daySelectionEnd: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.textOnDark,
      fontWeight: theme.typography.weights.semibold,
      borderRadius: `0 ${theme.radius.sm} ${theme.radius.sm} 0`,
    },
    daySelectionSingle: {
      borderRadius: theme.radius.sm,
    },
    dayHoverRange: {
      backgroundColor: theme.colors.primarySoft,
    },
  };

  return (
    <div style={styles.container}>
      {/* Header with month navigation */}
      <div style={styles.header}>
        <button
          type="button"
          onClick={goToPreviousMonth}
          style={styles.navButton}
          onMouseEnter={(e) => {
            Object.assign(e.target.style, styles.navButtonHover);
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.borderColor = theme.colors.border;
          }}
          aria-label="Previous month"
        >
          ←
        </button>
        <div style={styles.monthYear}>{monthYearString}</div>
        <button
          type="button"
          onClick={goToNextMonth}
          style={styles.navButton}
          onMouseEnter={(e) => {
            Object.assign(e.target.style, styles.navButtonHover);
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.borderColor = theme.colors.border;
          }}
          aria-label="Next month"
        >
          →
        </button>
      </div>

      {/* Weekday headers */}
      <div style={styles.weekdays}>
        {weekdays.map((day) => (
          <div key={day} style={styles.weekday}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={styles.daysGrid}>
        {calendarDays.map((dayObj, index) => {
          const { date, isCurrentMonth: isCurrent } = dayObj;
          const selectable = isDateSelectable(date);
          const available = isDateAvailable(date);
          const inRange = isInSelectedRange(date);
          const edge = isSelectionEdge(date);
          const inHoverRange = isInHoverRange(date);
          const isValidHover = isValidInHoverRange(date);

          // Determine if this is a single-day selection
          const isSingleSelection =
            value.startDate &&
            value.endDate &&
            normalizeDate(value.startDate).getTime() === normalizeDate(value.endDate).getTime() &&
            edge;

          let dayStyle = {
            ...styles.day,
            ...(isCurrent ? styles.dayCurrentMonth : styles.dayOtherMonth),
          };

          // Apply styles based on state
          if (!selectable || !available) {
            dayStyle = { ...dayStyle, ...styles.dayUnavailable };
          } else if (edge) {
            dayStyle = {
              ...dayStyle,
              ...(edge === 'start' ? styles.daySelectionStart : styles.daySelectionEnd),
              ...(isSingleSelection ? styles.daySelectionSingle : {}),
            };
          } else if (inRange) {
            dayStyle = { ...dayStyle, ...styles.dayInRange };
          } else if (inHoverRange && isValidHover) {
            dayStyle = { ...dayStyle, ...styles.dayHoverRange };
          } else if (selectable && available) {
            dayStyle = { ...dayStyle, ...styles.dayAvailable };
          }

          return (
            <button
              key={`${date.getTime()}-${index}`}
              type="button"
              style={dayStyle}
              onClick={() => handleDateClick(date)}
              onMouseEnter={() => {
                if (selectable && value.startDate && !value.endDate) {
                  setHoverDate(date);
                }
              }}
              onMouseLeave={() => {
                if (value.startDate && !value.endDate) {
                  setHoverDate(null);
                }
              }}
              disabled={!selectable}
              aria-label={`${date.toLocaleDateString()}${!selectable ? ' (unavailable)' : ''}`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AvailabilityCalendar;

