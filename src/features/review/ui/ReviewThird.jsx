import { useState } from "react";
import styled from 'styled-components'
import RangeItem from './RangeItem.jsx';
import { ToggleCheckbox } from "./ToggleCheckBox.jsx";
import { Asterisk, GuideMsg, ImgSection, MsgWrapper, Scroll, ThemeImg, ThemeSubText, ThemeTitle, Wrap1, Wrap2, Wrap3 } from "../../../shared/components/ReviewStyle.js";
import InputBox from "./InputBox.jsx";
import useDevice from "../../../shared/hooks/useDevice.js";

export default function ReviewThird() {

  const { isDesktop, isTablet, isMobile } = useDevice();

  const [levelText, setLevelText] = useState('');
  const [horrorText, setHorrorText] = useState('');
  const [activeText, setActiveText] = useState('');
  const [storyText, setStoryText] = useState('');
  const [interiorText, setInteriorText] = useState('');
  
  const [checkedRange, setCheckedRange] = useState(false);

  const [selected, setSelected] = useState('pants');

  const handleSelect = (value) => {
    setSelected(value);
  };

  return (
    <Wrap1>
        
      {!isMobile && (
        <>
          <Wrap2>
            <ThemeTitle>테마명</ThemeTitle>
            <ThemeSubText>주관식 후기 작성하기</ThemeSubText>
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

              <Wrapper>
                <ItemSection>
                  <Wrap>
                    <ItemText>장치/자물쇠 비율</ItemText>
                    <ToggleCheckbox
                      label='기재 안 함'
                      checked={checkedRange}
                      onToggle={()=>setCheckedRange(prev => !prev)}
                    />
                  </Wrap>

                  <RangeItem disabled={checkedRange} />

                </ItemSection>

                <InputBox
                  label="난이도"
                  placeholder="문제 구성, 지문 이해도 등에 대한 느낌을 자유롭게 적어주세요. (선택)"
                  value={levelText}
                  onChange={(e) => {
                    if (e.target.value.length <= 200) setLevelText(e.target.value);
                  }}
                />

                <InputBox
                  label="공포도"
                  placeholder="창조 공포, 조도, 갑툭튀 등 공포 요소에 대한 느낌을 자유롭게 적어주세요. (선택)"
                  value={horrorText}
                  onChange={(e) => {
                    if (e.target.value.length <= 200) setHorrorText(e.target.value);
                  }}
                />

                <InputBox
                  label='활동성'
                  placeholder="수직/수평 이동, 복장 관련 등 활동성에 대한 느낌을 자유롭게 적어주세요. (선택)"
                  value={activeText}
                  onChange={(e) => {
                    if (e.target.value.length <= 200) setActiveText(e.target.value);
                  }}
                  active
                  selected={selected}
                  handleSelect={handleSelect}
                />


                <InputBox
                  label='스토리'
                  placeholder="몰입도, 전개 방식, 신박함 등 스토리에 대한 느낌을 자유롭게 적어주세요. (선택)"
                  value={storyText}
                  onChange={(e) => {
                    if (e.target.value.length <= 200) setStoryText(e.target.value);
                  }}
                />

                <InputBox
                  label='인테리어'
                  placeholder="공간의 볼륨, 소품의 디테일, 테마 구현도 등 인테리어에 대한 느낌을 자유롭게 적어주세요. (선택)"
                  value={interiorText}
                  onChange={(e) => {
                    if (e.target.value.length <= 200) setInteriorText(e.target.value);
                  }}
                />

              </Wrapper>
            </Scroll>
          </Wrap3>
          
        </>
      )}

      {isMobile && (
        <Scroll>
          
          <ImgSection>
                  
            <ThemeImg />
                  
            <Wrap2>
              <ThemeTitle>테마명</ThemeTitle>
              <ThemeSubText>주관식 후기 작성하기</ThemeSubText>
            </Wrap2>
                  
            <MsgWrapper>
              <Asterisk>별점</Asterisk>
              <GuideMsg>은 필수 입력 사항입니다.</GuideMsg>
            </MsgWrapper>
                  
          </ImgSection>

          <Wrapper>
            <ItemSection>
              <Wrap>
                <ItemText>장치/자물쇠 비율</ItemText>
                <ToggleCheckbox
                  label='기재 안 함'
                  checked={checkedRange}
                  onToggle={()=>setCheckedRange(prev => !prev)}
                />
              </Wrap>

              <RangeItem disabled={checkedRange} />

            </ItemSection>

            <InputBox
              label="난이도"
              placeholder="문제 구성, 지문 이해도 등에 대한 느낌을 자유롭게 적어주세요. (선택)"
              value={levelText}
              onChange={(e) => {
                if (e.target.value.length <= 200) setLevelText(e.target.value);
              }}
            />

            <InputBox
              label="공포도"
              placeholder="창조 공포, 조도, 갑툭튀 등 공포 요소에 대한 느낌을 자유롭게 적어주세요. (선택)"
              value={horrorText}
              onChange={(e) => {
                if (e.target.value.length <= 200) setHorrorText(e.target.value);
              }}
            />

            <InputBox
              label='활동성'
              placeholder="수직/수평 이동, 복장 관련 등 활동성에 대한 느낌을 자유롭게 적어주세요. (선택)"
              value={activeText}
              onChange={(e) => {
                if (e.target.value.length <= 200) setActiveText(e.target.value);
              }}
              active
              selected={selected}
              handleSelect={handleSelect}
            />


            <InputBox
              label='스토리'
              placeholder="몰입도, 전개 방식, 신박함 등 스토리에 대한 느낌을 자유롭게 적어주세요. (선택)"
              value={storyText}
              onChange={(e) => {
                if (e.target.value.length <= 200) setStoryText(e.target.value);
              }}
            />

            <InputBox
              label='인테리어'
              placeholder="공간의 볼륨, 소품의 디테일, 테마 구현도 등 인테리어에 대한 느낌을 자유롭게 적어주세요. (선택)"
              value={interiorText}
              onChange={(e) => {
                if (e.target.value.length <= 200) setInteriorText(e.target.value);
              }}
            />

          </Wrapper>
        </Scroll>
      )}
    </Wrap1>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 1.25em;
  flex: 1 0 0;
`;

const ItemSection = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 0.625em;
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

const Wrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ItemText2 = styled.div`
  color: var(--RIU_Primary-100, #718FF2);
  text-align: center;
  font-family: Pretendard-Bold;
  font-size: 0.75em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.625em;
  }
`;