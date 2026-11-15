import type { RegionId, RegionResponse, ZoneId, ZoneResponse } from '../../../features/location/api/types';
import type { ThemeSortOption } from '../../types/theme';

export interface FilterValues {
  people: number;
  sort: ThemeSortOption;
  region: string;
  zones: string[];
}

export interface FilterSelectionHandle<T> {
  reset: () => void;
  getValue: () => T | null;
}

export interface RegionFilterHandle {
  reset: () => void;
}

export type FilterZone = ZoneResponse & { regionId?: RegionId };

export interface RegionSelectionProps {
  regions: RegionResponse[];
  zones: FilterZone[];
  selectedRegion: string | null;
  selectedZones: string[];
  activeRegionId: RegionId;
  onTabClick: (regionId: RegionId) => void;
  onRegionSelect: (regionName: string) => void;
  onRegionAllClick: () => void;
  onTabAllClick: (regionId: RegionId, label: string) => void;
  onZoneSelect: (zoneName: string) => void;
  isAllZoneSelected: boolean;
}

export type RegionFilterDraft = Pick<RegionSelectionProps,
  'activeRegionId' | 'zones' | 'selectedRegion' | 'selectedZones' | 'isAllZoneSelected'
>;

export interface RegionFilterValues extends FilterValues {
  regionSelection: RegionFilterDraft;
}

export interface RegionFilterCompatibilityProps {
  selectedZone?: string | null;
  selectedPeople?: number;
  selectedSort?: ThemeSortOption;
  zoneList?: string[];
  regionId?: RegionId | null;
  zoneIdList?: ZoneId[] | null;
  isOpen?: boolean;
  onClose?: () => void;
  onApply?: (values: FilterValues) => void;
  onReset?: (values: FilterValues) => void;
  setHeadCount?: (value: number) => void;
  setSelectedSort?: (value: ThemeSortOption) => void;
  setSelectedRegion?: (value: string) => void;
}
