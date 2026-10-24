/**
 * Format 24-hour integer (0-23) into 12-hour format with AM/PM
 * @param {number} hour
 * @returns {string} e.g. "09:00 AM", "02:00 PM"
 */
export function formatHour(hour) {
  if (hour === undefined || hour === null || isNaN(hour)) return '--:--';
  const h = Number(hour) % 24;
  const period = h >= 12 ? 'PM' : 'AM';
  const displayHour = h % 12 === 0 ? 12 : h % 12;
  const paddedHour = displayHour < 10 ? `0${displayHour}` : `${displayHour}`;
  return `${paddedHour}:00 ${period}`;
}

/**
 * Format waiting minutes into hours + minutes
 * @param {number} minutes
 * @returns {string} e.g. "25 mins" or "1 hr 15 mins"
 */
export function formatMinutes(minutes) {
  if (minutes === undefined || minutes === null || isNaN(minutes)) return '-- mins';
  const rounded = Math.round(Number(minutes));
  if (rounded < 60) {
    return `${rounded} min${rounded === 1 ? '' : 's'}`;
  }
  const hrs = Math.floor(rounded / 60);
  const remainingMins = rounded % 60;
  if (remainingMins === 0) {
    return `${hrs} hr${hrs === 1 ? '' : 's'}`;
  }
  return `${hrs} hr${hrs === 1 ? '' : 's'} ${remainingMins} min${remainingMins === 1 ? '' : 's'}`;
}

/**
 * Classify wait time into severity level for visual cues
 * @param {number} minutes
 * @returns {{ label: string, color: string, bg: string, border: string, badgeBg: string }}
 */
export function getWaitSeverity(minutes) {
  const mins = Number(minutes);
  if (mins < 20) {
    return {
      level: 'low',
      label: 'Short Wait',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      cardBg: 'from-emerald-500/10 to-teal-500/5',
      textAccent: 'text-emerald-700',
      description: 'Queue moving smoothly. Expected consultation shortly.',
    };
  }
  if (mins <= 45) {
    return {
      level: 'moderate',
      label: 'Moderate Wait',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      cardBg: 'from-amber-500/10 to-orange-500/5',
      textAccent: 'text-amber-700',
      description: 'Typical queue flow during standard outpatient hours.',
    };
  }
  return {
    level: 'high',
    label: 'Extended Wait',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    cardBg: 'from-rose-500/10 to-red-500/5',
    textAccent: 'text-rose-700',
    description: 'High volume surge or constrained staff capacity detected.',
  };
}

/**
 * Map staff count to categorical tier and description
 * @param {number} count
 * @returns {{ tier: string, label: string, badge: string }}
 */
export function getStaffAvailabilityTier(count) {
  const n = Number(count);
  if (n <= 2) {
    return { tier: 'Low', label: 'Limited Staffing (1-2 on duty)', badge: 'bg-rose-50 text-rose-700' };
  }
  if (n <= 5) {
    return { tier: 'Medium', label: 'Moderate Staffing (3-5 on duty)', badge: 'bg-blue-50 text-blue-700' };
  }
  return { tier: 'High', label: 'Optimal Staffing (6+ on duty)', badge: 'bg-teal-50 text-teal-700' };
}
