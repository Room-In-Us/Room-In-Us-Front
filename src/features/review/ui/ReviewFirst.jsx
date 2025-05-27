import { useState } from "react";
import styled from "styled-components";
import StarRating from "./StarRating";
import ReviewDropdown from "./ReviewDropdown";
import { overallOptions } from "../modal/reviewDataList";
import { GuideMsg, ImgSection, MsgWrapper, Scroll, ThemeImg, ThemeSubText, ThemeTitle, Wrap1, Wrap2, Wrap3, Wrap5 } from "../../../shared/components/ReviewStyle";
import useDevice from '../../../shared/hooks/useDevice.js';

export default function ReviewFirst() {

  const { isDesktop, isTablet, isMobile } = useDevice();
  const [text, setText] = useState("");

  const handleChange = (e) => {
    if (e.target.value.length <= 500) {
      setText(e.target.value);
    }
  };

  const [selectedOverall, setSelectedOverall] = useState('');

  return (
    <Wrap1>

      {!isMobile && (
      <>
        <Wrap2>
          <ThemeTitle>테마명</ThemeTitle>
          <ThemeSubText>테마에 만족하셨나요?</ThemeSubText>
        </Wrap2>

        <Wrap3>

          <ImgSection>
            <ThemeImg />
            <MsgWrapper>
              <Asterisk>*</Asterisk>
              <GuideMsg>는 필수 입력 사항입니다.</GuideMsg>
            </MsgWrapper>
          </ImgSection>
          
          <Scroll>
            <ReviewSection>
              <StarRating />
              <OverallSection>
                <Wrap4>
                  <ItemText>총평</ItemText>
                  <Asterisk>*</Asterisk>
                </Wrap4>
                <ReviewDropdown
                  placeholder='총평 선택'
                  options={overallOptions}
                  selected={selectedOverall}
                  onSelect={setSelectedOverall}
                  variant='overall'
                />
              </OverallSection>
              <ThoughtSection>
                <ItemText>테마 체험 소감을 간단히 적어주세요!</ItemText>
                <InputWrapper>
                  <ThoughtInput value={text} onChange={handleChange} />
                  <CharCount>
                    <CountText>{text.length} / 500</CountText>
                  </CharCount>
                </InputWrapper>
              </ThoughtSection>
            </ReviewSection>
          </Scroll>

        </Wrap3>
      </>
      )}

      {isMobile && (
        <Scroll>
          <Wrapper>

            <ThemeImg />

            <Wrap5>
              <Wrap2>
                <ThemeTitle>테마명</ThemeTitle>
                <ThemeSubText>테마에 만족하셨나요?</ThemeSubText>
              </Wrap2>

              <StarRating />
            </Wrap5>

          </Wrapper>

          <ReviewSection>
            <OverallSection>
              <Wrap4>
                <ItemText>총평</ItemText>
                <Asterisk>*</Asterisk>
              </Wrap4>
              <ReviewDropdown
                placeholder='총평 선택'
                options={overallOptions}
                selected={selectedOverall}
                onSelect={setSelectedOverall}
                variant='overall'
              />
            </OverallSection>
            <ThoughtSection>
              <ItemText>테마 체험 소감을 간단히 적어주세요!</ItemText>
              <InputWrapper>
                <ThoughtInput value={text} onChange={handleChange} />
                <CharCount>
                  <CountText>{text.length} / 500</CountText>
                </CharCount>
              </InputWrapper>
            </ThoughtSection>
          </ReviewSection>
        </Scroll>
      )}

    </Wrap1>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.875em;
`;

const ReviewSection = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 1em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    width: 100%;
    gap: 1.875em;
  }
`;

const OverallSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625em;
`;

const Wrap4 = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25em;
`;

const ItemText = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: Pretendard-Bold;
  font-size: 0.875em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;

const Asterisk = styled.div`
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

const ThoughtSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625em;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 8.125em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    height: 7.5em;
  }
`;

const ThoughtInput = styled.textarea`
  display: flex;
  padding: 0.625em 0.875em;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: flex-start;

  border-radius: 0.3125em;
  border: 1px solid var(--RIU_Monochrome-60, #C4C6D1);
  box-sizing: border-box;

  outline: none;
  &:focus {
    border: 1px solid var(--RIU_Monochrome-60, #C4C6D1);
    box-shadow: none;
  }

  color: var(--RIU_Monochrome-100, #818496);
  font-family: Pretendard-Medium;
  font-size: 0.75em;
  background: none;
  resize: none;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.625em;
  }
`;

const CharCount = styled.div`
  position: absolute;
  bottom: 0.625em;
  right: 0.875em;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const CountText = styled.div`
  font-size: 0.625em;
  color: var(--RIU_Monochrome-500, #515467);
  font-family: Pretendard-Regular;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.5em;
  }
`;