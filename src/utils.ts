import {
  GraduationCap, Scissors, ChefHat, Sprout, Baby, Hammer,
  Music, Languages, Briefcase, Sparkles, Wrench, Palette,
  type LucideIcon,
} from 'lucide-react';
import type { Category } from './types';

const ICONS: Record<string, LucideIcon> = {
  GraduationCap, Scissors, ChefHat, Sprout, Baby, Hammer,
  Music, Languages, Briefcase, Sparkles, Wrench, Palette,
};

export function getCategoryIcon(name: string): LucideIcon {
  return ICONS[name] ?? Sparkles;
}

export function formatPrice(n: number): string {
  return `₹${n}`;
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km} km`;
}
