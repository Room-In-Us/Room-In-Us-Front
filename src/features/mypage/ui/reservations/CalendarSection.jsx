import styled from 'styled-components'
import LeftArrow from '../../../../shared/assets/icons/common/arrow/leftArrow.svg?react'
import RightArrow from '../../../../shared/assets/icons/common/arrow/rightArrow.svg?react'
import Logo from '../../../../shared/assets/icons/common/logo.svg?react'
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, format } from 'date-fns';
import { useRecoilState, useRecoilValue } from 'recoil';
import { calendarMonthState, reservationListState } from '../../model/reservationAtom';

export default function CalendarSection() {
  const [currentMonth, setCurrentMonth] = useRecoilState(calendarMonthState);
  const reservationMap = useRecoilValue(reservationListState);

  const renderHeader = () => (
    <HeaderWrapper>
      <LeftArrowIcon onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} />
      <DateText>{format(currentMonth, "yyyy년 M월")}</DateText>
      <RightArrowIcon onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} />
    </HeaderWrapper>
  );

  const renderDays = () => {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return (
      <WeekHeader>
        {days.map((day) => (
          <Weekday key={day}>
            <WeekdayText>{day}</WeekdayText>
          </Weekday>
        ))}
      </WeekHeader>
    );
  };

  const renderDates = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    const dateCountMap = Object.values(reservationMap)
    .flat()
    .reduce((acc, r) => {
      const date = r.reservedAt?.split(' ')[0];
      if (!date) return acc;
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {

        const cloneDay = day;
        const dateStr = format(cloneDay, 'yyyy.MM.dd');
        const count = dateCountMap[dateStr] || 0;
        
        days.push(
          <DateCell
            key={format(cloneDay, 'yyyy.MM.dd')}
            isCurrentMonth={isSameMonth(cloneDay, monthStart)}
          >
            <DateNumber hasEvent={count > 0}>{format(cloneDay, 'd')}</DateNumber>
            {count > 0 && (
              <EventInfo>
                <LogoIcon />
                <EventText>{count}건</EventText>
              </EventInfo>
            )}
          </DateCell>
        );
        day = addDays(day, 1);
      }
      rows.push(<WeekRow key={day}>{days}</WeekRow>);
      days = [];
    }

    return (
    <DateGrid key={JSON.stringify(dateCountMap)}>
      {rows}
    </DateGrid>
    );
  };

  return (
    <Wrapper>
      {renderHeader()}
      <DateBox>
        {renderDays()}
        {renderDates()}
      </DateBox>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  padding: 1.25em;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25em;
  width: 100%;
  border-radius: 0.625em;
  background: var(--RIU_Monochrome-10, #F9F9FB);
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 0.875em;
    gap: 0.875em;
    align-self: stretch;
  }
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2.5em;
  width: 100%;
`;

const DateText = styled.div`
  color: var(--RIU_Monochrome-200, #717486);
  font-family: Pretendard-Bold;
  font-size: 1em;

  @media (max-width: 768px) {
    font-size: 0.875em;
  }
`;

const LeftArrowIcon = styled(LeftArrow)`
  display: flex;
  width: 1.25em;
  height: 1.25em;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  path {
    fill: var(--RIU_Primary-100, #718FF2);
  }

  @media (max-width: 768px) {
    width: 0.9375em;
    height: 0.9375em;
  }
`;

const RightArrowIcon = styled(RightArrow)`
  display: flex;
  width: 1.25em;
  height: 1.25em;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  path {
    fill: var(--RIU_Primary-100, #718FF2);
  }

  @media (max-width: 768px) {
    width: 0.9375em;
    height: 0.9375em;
  }
`;

const DateBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25em;
  width: 100%;
`;

const WeekHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Weekday = styled.div`
  width: 4.5em;
  padding: 0.5em 0.375em;

  @media (max-width: 768px) {
    width: 2.5em;
    padding: 0.5em 0em;
  }
`;

const WeekdayText = styled.div`
  color: var(--RIU_Primary-100, #718FF2);
  font-family: Pretendard-Bold;
  font-size: 0.875em;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 0.625em;
  }
`;

const DateGrid = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  gap: 0.25em;
`;

const WeekRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const DateCell = styled.div`
  display: flex;
  width: 4.5em;
  height: 6.25em;
  padding: 0.375em;
  gap: 0.375em;
  flex-direction: column;
  align-items: flex-start;
  box-sizing: border-box;
  opacity: ${({ isCurrentMonth }) => (isCurrentMonth ? 1 : 0.3)};

  @media (max-width: 768px) {
    width: 2.5em;
    height: 4.375em;
    padding: 0.375em 0em;
  }
`;

const DateNumber = styled.div`
  color: ${({ hasEvent }) =>
    hasEvent ? 'var(--RIU_Primary-300, #5B6ACC)' : 'var(--RIU_Monochrome-100, #818496)'};
  font-family: ${({ hasEvent }) =>
    hasEvent ? 'Pretendard-Bold' : 'Pretendard-Medium'};
  text-align: center;
  font-size: 0.875em;

  @media (max-width: 768px) {
    font-size: 0.625em;
  }
`;

const EventInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.3125em;
  width: 100%;
`;

const LogoIcon = styled(Logo)`
  width: 2.5em;
  height: 2.5em;

  @media (max-width: 768px) {
    width: 1.5625em;
    height: 1.5625em;
  }
`;

const EventText = styled.div`
  color: var(--RIU_Primary-300, #5B6ACC);
  font-family: Pretendard-Medium;
  font-size: 0.75em;

  @media (max-width: 768px) {
    font-size: 0.5em;
  }
`;