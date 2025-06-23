export type FastingPlan = '16:8' | '18:6' | '20:4' | '24:0' | 'OMAD' | '1dk';

export const FASTING_PLANS: Record<FastingPlan, number> = {
  '16:8': 16 * 60 * 60,
  '18:6': 18 * 60 * 60,
  '20:4': 20 * 60 * 60,
  '24:0': 24 * 60 * 60,
  OMAD: 24 * 60 * 60,
  '1dk': 60,
};
