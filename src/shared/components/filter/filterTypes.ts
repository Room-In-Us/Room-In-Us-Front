import type { Dispatch, ForwardedRef, MutableRefObject, SetStateAction } from 'react';
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
  currentValue?: T;
}

// 기존 코드는 ref.current와 ref 객체 자체에 각각 currentValue를 기록한다.
export type FilterSelectionRef<T> = MutableRefObject<FilterSelectionHandle<T> | null | undefined> & {
  currentValue?: T;
};

export interface RegionFilterHandle {
  reset: () => void;
}

export type RegionFilterRef = ForwardedRef<RegionFilterHandle | undefined> & { currentValue?: string };

export type FilterZone = ZoneResponse & { regionId?: RegionId };

// 적용 callback은 구역 이름을 저장하지만 시트는 기존 zoneName 접근을 유지한다.
export type FilterZoneListItem = FilterZone | (string & { readonly zoneName?: undefined });

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
  // 기존 데스크톱 소비처는 boolean 대신 setter를 전달하기도 한다.
  isAllZoneSelected: boolean | Dispatch<SetStateAction<boolean>>;
}

export interface RegionFilterCompatibilityProps {
  selectedZone?: string | null;
  selectedPeople?: number;
  selectedSort?: ThemeSortOption;
  zoneList?: FilterZoneListItem[];
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
