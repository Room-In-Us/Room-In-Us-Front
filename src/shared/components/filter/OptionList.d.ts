import type { ComponentType, SVGProps } from 'react';
import type { ThemeSortOption } from '../../types/theme';

export const peopleOptions: { value: number; label: string }[];
export const sortOptions: {
  value: ThemeSortOption;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement> & { title?: string }>;
}[];
