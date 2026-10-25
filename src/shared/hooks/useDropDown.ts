import { useEffect, useRef, useState } from "react";
import type { Dispatch, RefObject, SetStateAction } from "react";

type DropdownOptions<T> = {
  initialWidth?: number;
  responsive?: boolean;
  defaultValue?: T | null;
  onSelect?: (value: T) => void;
};

type DropdownPosition = {
  top: number;
  left: number;
};

type DropdownState<T> = {
  isOpen: boolean;
  toggleDropdown: () => void;
  handleSelect: (value: T) => void;
  position: DropdownPosition;
  dropdownWidth: number;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  triggerRef: RefObject<HTMLDivElement>;
  dropdownRef: RefObject<HTMLDivElement>;
  selected: T | null;
  reset: () => void;
};

export default function useDropdown<T = string | number>({
    initialWidth = 190,
    responsive = true,
    defaultValue = null,
    onSelect: externalOnSelect = () => {},
}: DropdownOptions<T>): DropdownState<T> {
  const [selected, setSelected] = useState<T | null>(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<DropdownPosition>({ top: 0, left: 0 });
  const [dropdownWidth, setDropdownWidth] = useState(initialWidth);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(prev => !prev);

  // 위치 계산
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right + window.scrollX - dropdownWidth,
      });
    }
  }, [isOpen, dropdownWidth]);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        // document의 mousedown 대상은 DOM Node 또는 null이다.
        !dropdownRef.current.contains(event.target as Node | null) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node | null)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // 너비 조정
  useEffect(() => {
    if (!responsive) return;

    const updateDropdownWidth = () => {
      const width = window.innerWidth <= 1024 ? initialWidth * 0.75 : initialWidth;
      setDropdownWidth(width);
    };

    updateDropdownWidth();
    window.addEventListener("resize", updateDropdownWidth);
    return () => window.removeEventListener("resize", updateDropdownWidth);
  }, [initialWidth, responsive]);

  const handleSelect = (value: T) => {
    console.log("선택된 값:", value);
    setSelected(value);
    externalOnSelect(value);
    setIsOpen(false);
  };

  const reset = () => {
    setSelected(defaultValue);
    setIsOpen(false);
  };

  useEffect(() => {
    setSelected(defaultValue);
  }, [defaultValue]);

  return {
    isOpen,
    toggleDropdown,
    handleSelect,
    position,
    dropdownWidth,
    setIsOpen,
    triggerRef,
    dropdownRef,
    selected,
    reset
  };
}
