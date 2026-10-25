import type { ComponentPropsWithRef } from 'react';
import type { IStyledComponent } from 'styled-components';

type DivStyle<Props extends object = object> = IStyledComponent<'web', ComponentPropsWithRef<'div'> & Props>;
type ImageStyle<Props extends object = object> = IStyledComponent<'web', ComponentPropsWithRef<'img'> & Props>;

export const Wrapper: DivStyle;
export const FilterContainer: DivStyle;
export const FilterTextWrapper: DivStyle;
export const FilterText: DivStyle;
export const FilterIcon: ImageStyle;
export const DropDownIcon: ImageStyle<{ $isRotated?: boolean; $isSelected?: boolean }>;
export const DropdownMenu: DivStyle<{ $isVisible?: boolean; $top?: number; $left?: number }>;
export const DropdownHeader: DivStyle;
export const DropdownItem: DivStyle<{ $isSelected?: boolean }>;
export const MenuWrapper: DivStyle;
