import { useEffect, useRef } from "react";
import styled from "styled-components";
import Write from '../../../../shared/assets/icons/myPage/write.svg?react';
import Trash from '../../../../shared/assets/icons/myPage/trash.svg?react';
import Share from '../../../../shared/assets/icons/themeDetail/shareIcon.svg?react';
import type { RefObject } from 'react';

type ReviewActionDropDownProps = {
  isOpen: boolean;
  anchorRef: RefObject<HTMLDivElement>;
  onShare: () => void | Promise<void>;
  onEdit: () => void | Promise<void>;
  onDelete: () => void;
  onClose: () => void;
};

export default function ReviewActionDropDown({
  isOpen,
  anchorRef,
  onShare,
  onEdit,
  onDelete,
  onClose,
}: ReviewActionDropDownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        // document mousedown의 대상은 DOM Node 또는 null이다.
        !dropdownRef.current.contains(e.target as Node | null) &&
        anchorRef?.current &&
        !anchorRef.current.contains(e.target as Node | null)
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
      <DropDownItem onClick={onShare}>
        <ShareIcon />
        <DropDownText>후기 공유</DropDownText>
      </DropDownItem>
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

const ShareIcon = styled(Share)`
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
