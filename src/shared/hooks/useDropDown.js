import { useEffect, useRef, useState } from "react";

export default function useDropdown({
    initialWidth = 190,
    responsive = true,
    defaultValue = null,
    onSelect: externalOnSelect = () => {},
}) {
  const [selected, setSelected] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [dropdownWidth, setDropdownWidth] = useState(initialWidth);
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

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
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
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

  const handleSelect = (value) => {
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
