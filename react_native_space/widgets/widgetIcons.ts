import type { ActivityId } from '../constants/activities';

const PINK = '#FF1F8E';
const BLACK = '#0D0D0D';

/** SVG versions of the in-app activity icons. Pass `mono` to draw the whole icon in one colour. */
export function activitySvg(id: ActivityId, mono?: string): string {
  const k = mono ?? BLACK;
  const p = mono ?? PINK;
  switch (id) {
    case 'swimming':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="22" viewBox="0 0 26 22" fill="none"><path d="M2 5c3-3 5-3 7 0s5 3 8 0 5-3 7 0M2 11c3-3 5-3 7 0s5 3 8 0 5-3 7 0M2 17c3-3 5-3 7 0s5 3 8 0 5-3 7 0" stroke="${p}" stroke-width="3" stroke-linecap="round"/></svg>`;
    case 'pilates':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="${k}" stroke-width="3.5"/></svg>`;
    case 'gym':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="16" viewBox="0 0 28 16"><circle cx="5" cy="8" r="5" fill="${k}"/><circle cx="23" cy="8" r="5" fill="${k}"/><rect x="5" y="6" width="18" height="4" rx="2" fill="${k}"/></svg>`;
    case 'yoga':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="20" viewBox="0 0 28 20"><path d="M14 1 L19 12 L9 12 Z" fill="${k}"/><path d="M2 7 C6 8 10 12 11 18 L2 18 Z" fill="${p}"/><path d="M26 7 C22 8 18 12 17 18 L26 18 Z" fill="${p}"/><rect x="9" y="15" width="10" height="3" fill="${k}"/></svg>`;
    case 'walk':
    default:
      return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="26" viewBox="0 0 24 26"><ellipse cx="7" cy="8" rx="4" ry="6" fill="${k}"/><circle cx="7" cy="17.5" r="2.5" fill="${k}"/><ellipse cx="17" cy="12" rx="4" ry="6" fill="${p}"/><circle cx="17" cy="21.5" r="2.5" fill="${p}"/></svg>`;
  }
}

/** Icon size in dp keeping each icon's own aspect ratio inside a square box. */
export function iconSize(id: ActivityId, box: number): { width: number; height: number } {
  const ratio: Record<ActivityId, number> = { swimming: 22 / 26, pilates: 1, gym: 16 / 28, yoga: 20 / 28, walk: 26 / 24 };
  const r = ratio[id] ?? 1;
  return r <= 1 ? { width: box, height: Math.round(box * r) } : { width: Math.round(box / r), height: box };
}
