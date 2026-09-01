const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Dates are formatted explicitly rather than with toLocaleDateString so the
 * server and the browser always produce the same string — otherwise React
 * flags a hydration mismatch whenever the two run in different locales.
 * Every helper below follows the same rule, including the match date/time
 * ones added for Match scheduling.
 */
export function formatDate(date: Date): string {
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

export function formatDay(date: Date): string {
  return DAYS[date.getUTCDay()];
}

export function formatShortDate(date: Date): string {
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/** "6:30 PM" — for match kick-off times on the admin table and public site. */
export function formatTime(date: Date): string {
  let hours = date.getUTCHours();
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const suffix = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${suffix}`;
}

/**
 * The value a <input type="date"> needs, derived from a Date the server
 * already holds in UTC — pairs with combineDateAndTime below.
 */
export function toDateInputValue(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** The value a <input type="time"> needs — "18:30". */
export function toTimeInputValue(date: Date): string {
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

/**
 * Combines a "YYYY-MM-DD" date input and "HH:MM" time input into one Date,
 * treating what the admin typed as the value to store rather than converting
 * through the browser's local timezone — the inverse of toDateInputValue and
 * toTimeInputValue above, so a scheduled match reads back exactly as entered.
 */
export function combineDateAndTime(dateValue: string, timeValue: string): Date {
  const [year, month, day] = dateValue.split("-").map(Number);
  const [hours, minutes] = timeValue.split(":").map(Number);
  return new Date(Date.UTC(year, month - 1, day, hours, minutes));
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

export function signed(value: number): string {
  return value > 0 ? `+${value}` : String(value);
}
