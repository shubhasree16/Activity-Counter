export type ActivityId = 'swimming' | 'pilates' | 'gym' | 'yoga' | 'walk';

export interface ActivityDef {
  id: ActivityId;
  name: string;
  target: number;
  iconType: 'swimming' | 'pilates' | 'gym' | 'yoga' | 'walk';
}

export const ACTIVITIES: ActivityDef[] = [
  { id: 'swimming', name: 'Swimming', target: 1, iconType: 'swimming' },
  { id: 'pilates', name: 'Pilates', target: 2, iconType: 'pilates' },
  { id: 'gym', name: 'Gym', target: 2, iconType: 'gym' },
  { id: 'yoga', name: 'Yoga', target: 1, iconType: 'yoga' },
  { id: 'walk', name: 'Walk', target: 1, iconType: 'walk' },
];

export const TOTAL_SESSIONS = ACTIVITIES.reduce((sum, a) => sum + a.target, 0);
