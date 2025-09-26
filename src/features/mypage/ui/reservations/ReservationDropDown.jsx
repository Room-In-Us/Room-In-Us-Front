import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components'
import More from '../../../../shared/assets/icons/common/more.svg?react';
import Write from '../../../../shared/assets/icons/myPage/write.svg?react';
import Thumb from '../../../../shared/assets/icons/myPage/thumbsup.svg?react';
import Trash from '../../../../shared/assets/icons/myPage/trash.svg?react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { calendarMonthState, reservationListState } from '../../model/reservationAtom';
import { deleteReservationAPI, getMyReservationsAPI } from '../../api/reservationAPI';
import { format } from 'date-fns';
import PopUpModal from '../../../../shared/components/PopUpModal';

export default function ReservationDropDown({onReviewClick, reservation}) {

  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const currentMonth = useRecoilValue(calendarMonthState);
  const setReservationList = useSetRecoilState(reservationListState);

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDelete = async () => {
    if (!window.confirm("정말 예약을 삭제하시겠습니까?")) return;

    try {
      await deleteReservationAPI(reservation.themeId, reservation.themeReservationId);

      const year = format(currentMonth, "yyyy");
      const month = format(currentMonth, "MM");
      const data = await getMyReservationsAPI(year, month);

      const allDates = data?.themeReservationList || {};
      const allReservations = Object.values(allDates).flat();

      setReservationList(prev => ({
        ...prev,
        [`${year}-${month}`]: allReservations,
      }));

      alert("예약이 삭제되었습니다.");
    } catch (error) {
      alert("예약 삭제에 실패했습니다.");
      console.error(error);
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <Wrapper ref={dropdownRef}>
      <MoreIcon
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(prev => !prev);
        }}
      />

       {isOpen && (
        <DropDownMenu>
          <DropDownItem
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onReviewClick();
            }}
          >
            <ThumbIcon/>
            <DropDownText>후기 작성</DropDownText>
          </DropDownItem>
          <DropDownItem
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <WriteIcon/>
            <DropDownText>예약 일정 변경</DropDownText>
          </DropDownItem>
          <DropDownItem
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              setIsDeleteModalOpen(true);
            }}
          >
            <TrashIcon/>
            <DropDownText>예약 내역 삭제</DropDownText>
          </DropDownItem>
        </DropDownMenu>
      )}
      

      <PopUpModal
        isOpen={isDeleteModalOpen}
        title="예약 삭제"
        message="정말 이 예약을 삭제하시겠습니까?"
        subMessage="삭제한 예약 정보는 일정 캘린더에서도 삭제됩니다."
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
`;

const MoreIcon = styled(More)`
  display: flex;
  width: 1.3125em;
  height: 1.3125em;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  color: #717486;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 1em;
    height: 1em;
  }
`;

const DropDownMenu = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: calc(100% + 0.5em); 
  right: 0;
  z-index: 1000;
  cursor: pointer;
`;

const DropDownItem = styled.div`
  display: flex;
  width: 11.875em;
  height: 2.5em;
  padding: 0em 1.25em;
  align-items: center;
  gap: 0.625em;
  border-bottom: 1px solid var(--RIU_Monochrome-50, #D6D6DF);
  background: var(--RIU_Monochrome-20, #F0F0F4);
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: 9.375em;
    height: 2.25em;
  }
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
  width: 0.9375em;
  height: 0.9375em;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    width: 0.875em;
    height: 0.875em;
  }
`;

const ThumbIcon = styled(Thumb)`
  display: flex;
  width: 0.9375em;
  height: 0.9375em;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    width: 0.875em;
    height: 0.875em;
  }
`;

const TrashIcon = styled(Trash)`
  display: flex;
  width: 0.9375em;
  height: 0.9375em;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    width: 0.875em;
    height: 0.875em;
  }
`;