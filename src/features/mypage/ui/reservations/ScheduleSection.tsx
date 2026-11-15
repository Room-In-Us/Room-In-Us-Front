import { useEffect, useLayoutEffect, useRef } from "react";
import styled from "styled-components";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { calendarMonthState, reservationListState } from "../../model/reservationAtom";
import { addMonths, format, subMonths } from "date-fns";
import { getMyReservationsAPI } from "../../api/reservationAPI";
import ReservedCard from "./ReservedCard";
import Pen from '../../../../shared/assets/icons/myPage/pen.svg?react';
import { scheduleModalState } from "../../../schedule/modal/scheduleAtom";
import ScheduleModal from "../../../schedule/ui/ScheduleModal";
import type { ThemeReservationResponse } from '../../api/types';

export default function ScheduleSection() {

  const currentMonth = useRecoilValue(calendarMonthState);
  const setReservationList = useSetRecoilState(reservationListState);
  const yearMonth = format(currentMonth, 'yyyy-MM');

  const reservationsMap = useRecoilValue(reservationListState);
  const reservations = reservationsMap[yearMonth] || [];

  const setScheduleWriteModal = useSetRecoilState(scheduleModalState);
  const modalState = useRecoilValue(scheduleModalState);
  const loadGeneration = useRef(0);

  useLayoutEffect(() => {
    // passive effect cleanup 전에도 이전 월 조회의 공유 캐시 쓰기를 막는다.
    loadGeneration.current += 1;
    return () => { loadGeneration.current += 1; };
  }, [currentMonth]);

  useEffect(() => {
    let active = true;
    const generation = loadGeneration.current;
    const isCurrent = () => active && generation === loadGeneration.current;
    const load = async () => {
      const prev = subMonths(currentMonth, 1);
      const next = addMonths(currentMonth, 1);

      const targets = [prev, currentMonth, next];

      for (const date of targets) {
        if (!isCurrent()) return;
        const y = format(date, "yyyy");
        const m = format(date, "MM");
        const ym = format(date, "yyyy-MM");

        const data = await getMyReservationsAPI(y, m);
        if (!isCurrent()) return;
        const allDates = data?.themeReservationList || {};
        const allReservations = Object.values(allDates).flat();

        setReservationList((prev) => isCurrent() ? ({
          ...prev,
          [ym]: allReservations,
        }) : prev);
      }
    };

    load().catch((error: unknown) => {
      if (isCurrent()) console.error("예약 목록 조회 실패:", error);
    });
    return () => { active = false; };
  }, [currentMonth, setReservationList]);

  const grouped = reservations.reduce<Record<string, ThemeReservationResponse[]>>((acc, item) => {
    const date = format(new Date(item.reservedAt), 'yyyy년 M월 d일');
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  return (
    <Wrapper>
      <HeaderWrapper>
        <MainText>{format(currentMonth, 'yyyy년 M월')}에 예약한 방탈출</MainText>
        <Btn onClick={() => {setScheduleWriteModal({ isOpen: true, mode: 'add', reservation: null });}}>
          <PenIcon />
          <BtnText>일정 관리하기</BtnText>
        </Btn>
      </HeaderWrapper>

      {/* 예약한 테마 영역 */}
      {reservations.length === 0 ? (
        <DateText>예약된 테마가 없습니다</DateText>
      ) : (
        Object.entries(grouped).map(([date, items]) => (
          <CardSection key={date}>
            <HrWrapper>
              <Line />
              <DateText>{date}</DateText>
              <Line />
            </HrWrapper>
            {items.map((r) => (
              <ReservedCard
                key={r.themeReservationId}
                data={r}
                isMyPage={true}
              />
            ))}
          </CardSection>
        ))
      )}

      
      {/* 일정 관리 모달 */}
      {modalState.isOpen && (
        <ModalBackdrop>
          <ScheduleModal />
        </ModalBackdrop>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25em;
  width: 100%;
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const MainText = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: Pretendard-Bold;
  font-size: 1em;

  @media (max-width: 768px) {
    font-size: 0.875em;
  }
`;

const Btn = styled.div`
  display: flex;
  padding: 0.375em 0.625em;
  align-items: center;
  gap: 0.375em;
  border-radius: 1.25em;
  background: var(--RIU_Primary-100, #718FF2);
  cursor: pointer;
`;

const BtnText = styled.div`
  color: var(--RIU_Primary-0, #E8EAFF);
  font-family: Pretendard-Medium;
  font-size: 0.875em;

  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;

const PenIcon = styled(Pen)`
  display: flex;
  width: 1.25em;
  height: 1.25em;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    width: 0.9375em;
    height: 0.9375em;
  }
`;

const CardSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.25em;

 @media (max-width: 768px) {
    width: 100%;
    align-items: center;
  }
`;

const HrWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.25em;
  width: 100%;
`;

const DateText = styled.div`
  color: var(--RIU_Monochrome-70, #B3B6C3);
  font-family: Pretendard-Medium;
  font-size: 0.875em;

  @media (max-width: 768px) {
    font-size: 0.625em;
  }
`;

const Line = styled.div`
  flex-grow: 1;
  height: 1px;
  border-bottom: 1px dashed var(--RIU_Monochrome-70, #B3B6C3);
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3500;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
`;
