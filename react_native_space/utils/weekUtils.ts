export function getCurrentMonday(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diff, 0, 0, 0, 0);
  return monday;
}

export function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getSundayFromMonday(mondayStr: string): string {
  const d = new Date(mondayStr + 'T00:00:00');
  d.setDate(d.getDate() + 6);
  return toDateString(d);
}

export function formatWeekRange(mondayStr: string, sundayStr: string): string {
  const mon = new Date(mondayStr + 'T00:00:00');
  const sun = new Date(sundayStr + 'T00:00:00');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const mMonth = months[mon.getMonth()] ?? 'Jan';
  const sMonth = months[sun.getMonth()] ?? 'Jan';
  return `${mMonth} ${mon.getDate()} \u2013 ${sMonth} ${sun.getDate()}`;
}

export function formatWeekOf(mondayStr: string): string {
  const d = new Date(mondayStr + 'T00:00:00');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `Week of ${months[d.getMonth()] ?? 'Jan'} ${d.getDate()}`;
}
