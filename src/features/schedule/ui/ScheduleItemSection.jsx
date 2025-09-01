import styled, { css } from "styled-components";
import useDevice from "../../../shared/hooks/useDevice";
import Search from '../../../shared/assets/icons/common/searchIcon.svg?react';
import { useCallback, useEffect, useState } from "react";
import { getThemesAPI } from '../../../features/search/api/getSearchAPI';
import NoResultFace from '../../../shared/assets/icons/myPage/noresultface.svg?react';
import ReservedCard from "../../mypage/ui/reservations/ReservedCard";
import VisitDatePicker from "../../review/ui/VisitDatePicker";
import TimePicker from "./TimePicker";

export default function ScheduleItemSection({ isModal, onStateChange }) {

  // 반응형
  const { isMobile } = useDevice();

  const [searchValue, setSearchValue] = useState("");
  const [themes, setThemes] = useState([]);
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);

  const handleSearch = useCallback(async () => {
    try {
      const data = await getThemesAPI({ keyword: searchValue, page: 1, size: 10000 });
      setThemes(data.contents || []);
    } catch (error) {
      console.error('검색 실패:', error);
      setThemes([]);
    }
  }, [searchValue]); 

  useEffect(() => {
    if (searchValue.trim() !== '') {
      handleSearch();
    } else {
      setThemes([]);
    }
  }, [searchValue, handleSearch]);

  const handleItemClick = useCallback((theme) => {
    const unifiedData = {
        ...theme,
        themeImg: theme.img || theme.themeImg,
      };
    setSelectedTheme(unifiedData);
    setSelectedThemeId(theme.themeId);
  }, []);

  const [visitDate, setVisitDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState({ hour: '10', minute: '00' }); // 초기값 설정

  // 날짜 선택 핸들러
  const handleDateChange = useCallback((date) => {
    setVisitDate(date);
  }, []);

  // 시간 선택 핸들러
  const handleTimeChange = useCallback((newTime) => {
    setSelectedTime(prev => ({ ...prev, ...newTime }));
  }, []);

  // API 호출 시 사용할 최종 `reservedAt` 값 구성
  const reservedAt = (() => {
    if (!visitDate) return null;
    const year = visitDate.getFullYear();
    const month = String(visitDate.getMonth() + 1).padStart(2, '0');
    const day = String(visitDate.getDate()).padStart(2, '0');
    const { hour, minute } = selectedTime;
    return `${year}-${month}-${day}T${hour}:${minute}:00`;
  })();

  const isSubmitEnabled = !!selectedThemeId && !!visitDate;

  useEffect(() => {
    console.log('--- ScheduleItemSection 상태 업데이트 ---');
    console.log('선택된 테마 ID:', selectedThemeId);
    console.log('선택된 날짜:', visitDate);
    console.log('버튼 활성화 여부:', isSubmitEnabled);
    console.log('------------------------------------');

    if (onStateChange) {
      onStateChange({
        selectedThemeId,
        visitDate,
        selectedTime,
        isSubmitEnabled,
        reservedAt,
      });
    }
  }, [selectedThemeId, visitDate, selectedTime, isSubmitEnabled, reservedAt, onStateChange]);

  return (
    <Wrapper>
      <SearchSection>
        <InputBoxWrapper>
          <SearchTextWrapper>
            <SearchIcon onClick={handleSearch} />
            <SearchInput
              type="text"
              placeholder="내가 예약한 테마는?"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </SearchTextWrapper>
        </InputBoxWrapper>
        
        <ResultBox>
        {searchValue.trim() === '' && themes.length === 0 ? (
          // 초기 상태: 검색어가 없을 때
          <ResultBox2>
            <SearchIcon2 />
            <InfoText>검색 결과가 표시됩니다.</InfoText>
          </ResultBox2>
        ) : themes.length === 0 ? (
          // 검색 결과 없음
          <ResultBox2>
            <NoResultFaceIcon />
            <InfoText>검색 결과가 없습니다.</InfoText>
          </ResultBox2>
        ) : (
          themes.map((theme) => (
            <ResultItem
              key={theme.themeId}
              data={theme}
              onClick={() => handleItemClick(theme)}
              $isSelected={theme.themeId === selectedThemeId}
            >
              <ResultSubText>{theme.storeName}</ResultSubText>
              <ResultTitle>{theme.themeName}</ResultTitle>
            </ResultItem>
          )))}
        </ResultBox>
      </SearchSection>
      <DropDownWrapper>

        {/* 임시 */}
        <VisitDatePicker onChange={handleDateChange} />
        <TimePicker onTimeChange={handleTimeChange} />
      
      </DropDownWrapper>

      {selectedTheme ? (
        <ReservedCard 
          isModal={isModal} 
          data={selectedTheme}
          setSelectedTheme={setSelectedTheme} 
          setSelectedThemeId={setSelectedThemeId}
        />
      ) : (
        <ReservedCard 
          isModal={isModal} 
          data={null} 
          setSelectedTheme={setSelectedTheme}
          setSelectedThemeId={setSelectedThemeId}
        />
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.875em;
  width: 100%;
`;

const SearchSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.625em;
`;

const SearchIcon = styled(Search)`
  display: flex;
  width: 1.3125em;
  height: 1.3125em;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const SearchIcon2 = styled(Search)`
  display: flex;
  width: 2.5em;
  height: 2.5em;
  justify-content: center;
  align-items: center;
`;

const NoResultFaceIcon = styled(NoResultFace)`
  display: flex;
  width: 2.5em;
  height: 2.5em;
  justify-content: center;
  align-items: center;
`;

const InputBoxWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 2.625em;
  padding: 0.4375em 0.5em;
  align-items: center;
  gap: 0.4375em;
  border-radius: 1.75em;
  border: 1px solid var(--RIU_Monochrome-60, #C4C6D1);
  background: var(--RIU_Monochrome-10, #F9F9FB);
  box-sizing: border-box;
`;

const SearchTextWrapper =  styled.text`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 0.4375em;
`;

const SearchInput = styled.input`
  flex-grow: 1;
  border: none;
  background: transparent;
  outline: none;
  color: var(--RIU_Monochrome-100, #818496);
  font-family: Pretendard-Medium;
  font-size: 0.75em;

  &::placeholder {
    color: var(--RIU_Monochrome-100, #818496);
  }
`;

const ResultBox = styled.div`
  width: 100%;
  height: 15.625em;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  border-radius: 0.625em;
  border: 1px solid var(--RIU_Monochrome-60, #C4C6D1);
  background: var(--RIU_Monochrome-10, #F9F9FB);
  box-sizing: border-box;
  cursor: pointer;
  flex-shrink: 0;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background: none;
  }
  &:hover::-webkit-scrollbar-thumb {
    border-radius: 30px;
    background-color: #8DA3FF;
  }
`;

const ResultBox2 = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 1em;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1em;
  box-sizing: border-box;
`;

const ResultItem = styled.div`
  display: flex;
  height: 3.125em;
  padding: 0.5em 1em;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.625em;
  align-self: stretch;

  &:hover {
    background: var(--RIU_Primary-0, #E8EAFF);
  }

  ${props => props.$isSelected && css`
    background: var(--RIU_Primary-0, #E8EAFF);
    &:hover {
      background: var(--RIU_Primary-0, #E8EAFF);
    }
  `}
`;

const ResultTitle = styled.div`
  color: var(--RIU_Primary-600, #303281);
  font-family: Pretendard-ExtraBold;
  font-size: 0.875em;
`;

const ResultSubText = styled.div`
  color: var(--RIU_Primary-80, #8DA3FF);
  font-family: Pretendard-Bold;
  font-size: 0.625em;
`;

const DropDownWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.875em;

  .date-picker-wrapper {
    width: 17.1875em;
    height: 2.625em;

    .react-datepicker__input-container {
      width: 100%;
      height: 100%;
    }
  }
`;

const InfoText = styled.div`
  color: var(--RIU_Monochrome-70, #B3B6C3);
  text-align: center;
  font-family: Pretendard-Medium;
  font-size: 0.875em;
`;