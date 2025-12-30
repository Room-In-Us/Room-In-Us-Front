import { useEffect, useRef } from "react";
import styled from "styled-components";
import Write from '../../../../shared/assets/icons/myPage/write.svg?react';
import Trash from '../../../../shared/assets/icons/myPage/trash.svg?react';

export default function ReviewActionDropDown({
  isOpen,
  anchorRef,
  onEdit,
  onDelete,
  onClose,
}) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        anchorRef?.current &&
        !anchorRef.current.contains(e.target)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, anchorRef]);

  if (!isOpen) return null;

  return (
    <DropDownMenu ref={dropdownRef}>
      <DropDownItem onClick={onEdit}>
        <WriteIcon />
        <DropDownText>후기 수정</DropDownText>
      </DropDownItem>
      <DropDownItem onClick={onDelete}>
        <TrashIcon />
        <DropDownText>후기 삭제</DropDownText>
      </DropDownItem>
    </DropDownMenu>
  );
}

const DropDownMenu = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: calc(100% + 0.625em);
  right: 0;
  z-index: 1000;
  cursor: pointer;
`;

const DropDownItem = styled.div`
  width: 9.375em;
  height: 2.25em;
  padding: 0 1.25em;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  background: var(--RIU_Monochrome-20, #f0f0f4);
  border-bottom: 1px solid var(--RIU_Monochrome-50, #d6d6df);
  cursor: pointer;
`;

const DropDownText = styled.div`
  color: var(--RIU_Monochrome-200, #717486);
  font-family: Pretendard-Medium;
  font-size: 0.875em;

  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;

const WriteIcon = styled(Write)`
  display: flex;
  width: 0.875rem;
  height: 0.875rem;
  justify-content: center;
  align-items: center;
`;

const TrashIcon = styled(Trash)`
  display: flex;
  width: 0.875rem;
  height: 0.875rem;
  justify-content: center;
  align-items: center;
`;