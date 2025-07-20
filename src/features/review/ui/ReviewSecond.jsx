import { useEffect, useRef, useState } from 'react';
import styled from "styled-components";
import CircleInfo from "../../../shared/assets/icons/common/circleinfo.svg?react";
import UnselectedIcon from '../../../shared/assets/icons/common/filterIcon/unselected.svg';
import SelectedIcon from '../../../shared/assets/icons/common/filterIcon/selected.svg';
import { finishOption } from '../modal/reviewDataList.js';
import { specialIssues } from '../modal/reviewDataList.js';
import EscapeResultDetails from "./EscapeResultDetails.jsx";
import VisitDatePicker from './VisitDatePicker.jsx';
import { ToggleCheckbox } from './ToggleCheckBox.jsx';
import PlayerBoxSection from './PlayerBoxSection.jsx';
import FlexibleRangeSelector from './FlexibleRangeSelector.jsx';
import HintCounter from "./HintCounter.jsx";
import { Asterisk, GuideMsg, ImgSection, MsgWrapper, Scroll, ThemeImg, ThemeSubText, ThemeTitle, Wrap1, Wrap2, Wrap3 } from '../../../shared/styles/ReviewStyles.js';
import useDevice from '../../../shared/hooks/useDevice.js';
import InfoBox from '../../../shared/components/InfoBox.jsx';
import { useRecoilState } from 'recoil';
import { reviewState } from '../../themeDetail/model/reviewAtom.jsx';

export default function ReviewSecond({themeData}) {

  // 반응형
  const { isMobile } = useDevice();

  // 후기 데이터 상태
  const [review, setReview] = useRecoilState(reviewState);

  // 체크박스 상태
  const [checkedDate, setCheckedDate] = useState(false);
  const [checkedHint, setCheckedHint] = useState(false);
  const [checkedPeople, setCheckedPeople] = useState(false);

  // 플레이 인원 상태
  const players = review.participantList.map((p, i) => ({
    ...p,
    isOwner: i === 0,
  }));

  // info 팝업 상태
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const infoRef = useRef(null);

  // info 팝업 효과
  useEffect(() => {
    function handleClickOutside(e) {
      if (infoRef.current && !infoRef.current.contains(e.target)) {
        setIsInfoOpen(false);
      }
    }

    if (isInfoOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isInfoOpen]);

  // 특이사항 선택 기능
  const toggleIssue = (value) => {
    setReview(prev => {
      const current = prev.reviewTagList ?? [];
      const newList = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return {
        ...prev,
        reviewTagList: newList.length > 0 ? newList : null,
      };
    });
  };

  // 탈출 여부 선택 기능
  const handleEscapeSelect = (value) => {
    setReview(prev => ({
      ...prev,
      isEscaped: value,
    }))
  };

  // 플레이 인원 추가 기능
  const handleAddPlayer = () => {
    setReview(prev => ({
      ...prev,
      participantList: [...prev.participantList, {proficiency: '', remark: ''}],
    }));
  };

  // 플레이 인원 삭제 기능
  const handleRemovePlayer = (index) => {
    if (index === 0) return;
    const newList = review.participantList.filter((_, i) => i !== index);
    setReview(prev => ({...prev, participantList: newList }));
  };

  // 플레이 인원 숙련도 선택 기능
  const handleSkillChange = (index, value) => {
    const newList = review.participantList.map((participant, i) =>
      i === index
        ? { ...participant, proficiency: value }
        : participant
    );

    setReview(prev => ({
      ...prev,
      participantList: newList,
    }));
  };

  // 플레이 인원 특이 사항 입력 기능
  const handleNoteChange = (index, value) => {
    const newList = review.participantList.map((participant, i) =>
      i === index
        ? { ...participant, remark: value }
        : participant
    );

    setReview(prev => ({
      ...prev,
      participantList: newList,
    }));
  };

  // 추천 인원 기재 선택 핸들러
  const handleTogglePeople = () => {
    setCheckedPeople(prev => {
      const next = !prev;
      if (next) {
        setReview(prev => ({
          ...prev,
          minRecommendedHeadcount: null,
          maxRecommendedHeadcount: null,
        }));
      }
      return next;
    });
  };


  return (
    <Wrap1>
    
    {!isMobile &&(      
    <>
      <Wrap2>
        <ThemeTitle>{themeData?.themeName || '테마명'}</ThemeTitle>
        <ThemeSubText>객관식 후기 작성하기</ThemeSubText>
      </Wrap2>
    
      <Wrap3>
    
        <ImgSection>
          <ThemeImg src={themeData?.img || ''} />
          <MsgWrapper>
            <Asterisk>*</Asterisk>
            <GuideMsg>표는 필수 입력 사항입니다.</GuideMsg>
          </MsgWrapper>
        </ImgSection>

        <Scroll>

          <Wrapper>
            {/* 방문 일자 영역 */}
            <ItemSection>
              <Wrap>
                <ItemText>방문 일자</ItemText>
                <Asterisk2>*</Asterisk2>
              </Wrap>

              <DatePickerWrapper>
                <VisitDatePicker
                  selectedDate={review.playedAt}
                  onChange={(date) => {
                    setReview(prev => ({...prev, playedAt: date.toISOString().split('T')[0]}));
                  }}
                />
              </DatePickerWrapper>

              <ToggleCheckbox
                label='기억 안 남'
                checked={checkedDate}
                onToggle={()=>setCheckedDate(prev => !prev)}
              />
            </ItemSection>

            {/* 플레이 인원 영역 */}
            <ItemSection>
              <Wrap>
                <ItemText>플레이 인원</ItemText>
                <Asterisk2>*</Asterisk2>
                <IconWrapper
                  onMouseEnter={() => setIsInfoOpen(true)}
                  onMouseLeave={() => setIsInfoOpen(false)}
                >
                  <CircleInfoIcon />
                  <InfoPopup ref={infoRef} isInfoOpen={isInfoOpen}>
                    <InfoBox />
                  </InfoPopup>
                </IconWrapper>
              </Wrap>

              {players.map(({ proficiency, remark, isOwner }, index) => (
                <PlayerBoxSection
                  key={index}
                  skill={proficiency}
                  note={remark}
                  isOwner={isOwner}
                  onSkillChange={(value) => handleSkillChange(index, value)}
                  onNoteChange={(value) => handleNoteChange(index, value)}
                  onRemove={() => handleRemovePlayer(index)}
                />
              ))}
              <AddPeopleBtn onClick={handleAddPlayer}>
                <AddPeopleBtnText>인원 추가</AddPeopleBtnText>
              </AddPeopleBtn>
            </ItemSection>

            {/* 탈출 여부 영역 */}
            <ItemSection>
              <Wrap>
                <ItemText>탈출 여부</ItemText>
                <Asterisk2>*</Asterisk2>
              </Wrap>
              <Container2>
              {finishOption.map((option) => (
                <DropdownItem key={option.value} onClick={() => handleEscapeSelect(option.value)} $isSelected={review.isEscaped === option.value}>
                  <RadioIcon src={review.isEscaped === option.value ? SelectedIcon : UnselectedIcon} alt="radio-icon" />
                  <RadioLabel $isSelected={review.isEscaped === option.value}>{option.label}</RadioLabel>
                </DropdownItem>
              ))}
              </Container2>
              <EscapeResultDetails 
                disabled={review.isEscaped} 
                selected={review.isEscaped} 
                onUpdate={({ remainingTime, failReason, hasViewedEnding }) => {
                  setReview(prev => ({
                    ...prev,
                    remainingTime,
                    failReason,
                    hasViewedEnding,
                  }));
                }}
              />
            </ItemSection>

            {/* 사용 힌트 수 영역 */}
            <ItemSection2>
              <Wrap>
                <ItemText>사용 힌트 수</ItemText>
                <Asterisk2>*</Asterisk2>
              </Wrap>
              <HintCounter 
                disabled={checkedHint} 
                value={review.usedHint ?? 0}
                onChange={(value) =>
                  setReview(prev => ({
                    ...prev,
                    usedHint: checkedHint ? null : value
                  }))
                }
              />
              <ToggleCheckbox
                label='기재 안 함'
                checked={checkedHint}
                onToggle={()=>setCheckedHint(prev => !prev)}
              />
            </ItemSection2>

            {/* 추천 인원 영역 */}
            <ItemSection2>
              <Wrap>
                <ItemText>추천 인원</ItemText>
                <Asterisk2>*</Asterisk2>
              </Wrap>
              <FlexibleRangeSelector 
                disabled={checkedPeople}
                value={
                  review.minRecommendedHeadcount !== null
                    ? review.maxRecommendedHeadcount !== null &&
                      review.minRecommendedHeadcount !== review.maxRecommendedHeadcount
                      ? [review.minRecommendedHeadcount, review.maxRecommendedHeadcount]
                      : [review.minRecommendedHeadcount]
                    : []
                }
                onChange={(range) =>
                  setReview(prev => ({
                    ...prev,
                    minRecommendedHeadcount: checkedPeople || !range.length ? null : range[0],
                    maxRecommendedHeadcount: checkedPeople || !range.length
                      ? null
                      : range[1] ?? range[0],
                  }))
                }
              />
              <ToggleCheckbox
                label='기재 안 함'
                checked={checkedPeople}
                onToggle={handleTogglePeople}
              />
            </ItemSection2>

            {/* 특이사항 영역 */}
            <ItemSection>
              <ItemText>특이사항</ItemText>
              <BoxSection>
              {specialIssues.map(({ icon, label, value }) => (
                <ToggleCheckbox
                  key={value}
                  label={label}
                  checked={(review.reviewTagList ?? []).includes(value)}
                  onToggle={() => toggleIssue(value)}
                  icon={icon}
                  special
                />
              ))}
              </BoxSection>
            </ItemSection>
          </Wrapper>
        </Scroll>
      </Wrap3>
      </>
    )}

    {isMobile && (
      <Scroll $isSecond={true}>
        <Wrapper>

          <ImgSection>
        
            <ThemeImg src={themeData?.img || ''} />
        
            <Wrap2>
              <ThemeTitle>{themeData?.themeName || '테마명'}</ThemeTitle>
              <ThemeSubText>객관식 후기 작성하기</ThemeSubText>
            </Wrap2>
        
            <MsgWrapper>
              <Asterisk>*</Asterisk>
              <GuideMsg>표는 필수 입력 사항입니다.</GuideMsg>
            </MsgWrapper>
        
          </ImgSection>

          {/* 방문 일자 영역 */}
          <ItemSection>
            <Wrap>
              <ItemText>방문 일자</ItemText>
              <Asterisk2>*</Asterisk2>
            </Wrap>
            <DatePickerWrapper>
              <VisitDatePicker
                disabled={checkedDate}
                selectedDate={review.playedAt}
                onChange={(date) => {
                  setReview(prev => ({...prev, playedAt: date.toISOString().split('T')[0]}));
                }}
             />
            </DatePickerWrapper>

            <ToggleCheckbox
              label='기억 안 남'
              checked={checkedDate}
              onToggle={()=>setCheckedDate(prev => !prev)}
            />
          </ItemSection>

          {/* 플레이 인원 영역 */}
          <ItemSection>
            <Wrap>
              <ItemText>플레이 인원</ItemText>
              <Asterisk2>*</Asterisk2>
              <IconWrapper>
                <CircleInfoIcon onClick={() => setIsInfoOpen(prev => !prev)} />
                {isInfoOpen && (
                  <InfoPopup ref={infoRef}>
                    <InfoBox />
                  </InfoPopup>
                )}
              </IconWrapper>
            </Wrap>
            {players.map(({ proficiency, remark, isOwner }, index) => (
              <PlayerBoxSection
                key={index}
                skill={proficiency}
                note={remark}
                isOwner={isOwner}
                onSkillChange={(value) => handleSkillChange(index, value)}
                onNoteChange={(value) => handleNoteChange(index, value)}
                onRemove={() => handleRemovePlayer(index)}
              />
            ))}
            <AddPeopleBtn onClick={handleAddPlayer}>
              <AddPeopleBtnText>인원 추가</AddPeopleBtnText>
            </AddPeopleBtn>
          </ItemSection>

          {/* 탈출 여부 영역 */}
          <ItemSection>
            <Wrap>
              <ItemText>탈출 여부</ItemText>
              <Asterisk2>*</Asterisk2>
            </Wrap>
            <Container2>
            {finishOption.map((option) => (
              <DropdownItem key={option.value} onClick={() => handleEscapeSelect(option.value)} $isSelected={review.isEscaped === option.value}>
                <RadioIcon src={review.isEscaped === option.value ? SelectedIcon : UnselectedIcon} alt="radio-icon" />
                <RadioLabel $isSelected={review.isEscaped === option.value}>{option.label}</RadioLabel>
              </DropdownItem>
            ))}
            </Container2>
            <EscapeResultDetails
              disabled={review.isEscaped} 
              selected={review.isEscaped} 
              onUpdate={({ remainingTime, failReason, hasViewedEnding }) => {
                setReview(prev => ({
                  ...prev,
                  remainingTime,
                  failReason,
                  hasViewedEnding,
                }));
              }}              
            />
          </ItemSection>

          {/* 사용 힌트 수 영역 */}
          <ItemSection2>
            <Wrap>
              <ItemText>사용 힌트 수</ItemText>
              <Asterisk2>*</Asterisk2>
            </Wrap>
            <HintCounter
              disabled={checkedHint} 
              value={review.usedHint ?? 0}
              onChange={(value) =>
                setReview(prev => ({
                  ...prev,
                  usedHint: checkedHint ? null : value
                }))
              }
            />
            <ToggleCheckbox
              label='기재 안 함'
              checked={checkedHint}
              onToggle={()=>setCheckedHint(prev => !prev)}
            />
          </ItemSection2>

          {/* 추천 인원 영역 */}
          <ItemSection2>
            <Wrap>
              <ItemText>추천 인원</ItemText>
              <Asterisk2>*</Asterisk2>
            </Wrap>
            <FlexibleRangeSelector
              disabled={checkedPeople}
              value={
                review.minRecommendedHeadcount !== null
                  ? review.maxRecommendedHeadcount !== null &&
                    review.minRecommendedHeadcount !== review.maxRecommendedHeadcount
                    ? [review.minRecommendedHeadcount, review.maxRecommendedHeadcount]
                    : [review.minRecommendedHeadcount]
                  : []
              }
              onChange={(range) =>
                setReview(prev => ({
                  ...prev,
                  minRecommendedHeadcount: checkedPeople || !range.length ? null : range[0],
                  maxRecommendedHeadcount: checkedPeople || !range.length
                    ? null
                    : range[1] ?? range[0],
                }))
              }
            />
            <ToggleCheckbox
              label='기재 안 함'
              checked={checkedPeople}
              onToggle={handleTogglePeople}
            />
          </ItemSection2>

          {/* 특이사항 영역 */}
          <ItemSection>
            <ItemText>특이사항</ItemText>
            <BoxSection>
            {specialIssues.map(({ icon, label, value }) => (
              <ToggleCheckbox
                key={value}
                label={label}
                checked={(review.reviewTagList ?? []).includes(value)}
                onToggle={() => toggleIssue(value)}
                icon={icon}
                special
              />
            ))}
            </BoxSection>
          </ItemSection>
        </Wrapper>
      </Scroll>
    )}
    </Wrap1>
  )
}

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 1.875em 1.25em;
  flex-wrap: wrap;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    gap: 1.25em;
  }
`;

const ItemSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.625em;
`;

const DatePickerWrapper = styled.div`
  width: 100%;
  display: block;
`;

const Wrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3125em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    gap: 0.25em;
  }
`;

const ItemText = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  text-align: center;
  font-family: Pretendard-Bold;
  font-size: 0.875em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;

const Asterisk2 = styled.div`
  color: var(--RIU_Primary-100, #718FF2);
  text-align: center;
  font-family: Pretendard-Bold;
  font-size: 0.875em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;

const IconWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const InfoPopup = styled.div`
  visibility: ${({ isInfoOpen }) => (isInfoOpen ? 'visible' : 'hidden')};
  opacity: ${({ isInfoOpen }) => (isInfoOpen ? '1' : '0')};
  transition: all 0.2s ease-in-out;
  position: absolute;
  bottom: 0;
  left: 150%;
  z-index: 999;
`;

const CircleInfoIcon = styled(CircleInfo)`
  display: flex;
  width: 0.9375em;
  height: 0.9375em;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;

  path {
    fill: var(--RIU_Primary-80, #8DA3FF);
  }

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    width: 0.625em;
    height: 0.625em;
  }
`;

const BoxSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.625em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
    gap: 0em;
  }
`;

const AddPeopleBtn = styled.div`
  display: flex;
  width: 100%;
  height: 2.5em;
  padding: 0.625em 0.875em;
  justify-content: center;
  align-items: center;
  border-radius: 0.3125em;
  border: 1px solid var(--RIU_Primary-100, #718FF2);
  box-sizing: border-box;
  cursor: pointer;

  &:hover {
    background: var(--RIU_Primary-20, #D0D8FF);
  }

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    height: 1.875em;
  }
`;

const AddPeopleBtnText = styled.div`
  color: var(--RIU_Primary-100, #718FF2);
  font-family: Pretendard-Bold;
  font-size: 0.75em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.625em;
  }
`;

const Container2 = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625em;
`;

const DropdownItem = styled.div`
  color: var(--RIU_Monochrome-200, #717486);
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25em;
`;

export const RadioIcon = styled.img`
  display: flex;
  width: 0.9375em;
  height: 0.9375em;
  justify-content: center;
  align-items: center;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    width: 0.625em;
    height: 0.625em;
  }
`;

export const RadioLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--RIU_Monochrome-300, #696C7E);
  font-family: Pretendard-Medium;
  font-size: 0.75em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.6875em;
  }
`;

const ItemSection2 = styled.div`
  display: flex;
  width: calc(50% - 0.625em);
  flex-direction: column;
  align-items: flex-start;
  gap: 0.625em;
`;