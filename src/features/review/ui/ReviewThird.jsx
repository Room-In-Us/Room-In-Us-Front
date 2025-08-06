import { useState } from "react";
import styled from 'styled-components'
import RangeItem from './RangeItem.jsx';
import { ToggleCheckbox } from "./ToggleCheckBox.jsx";
import { GuideMsg, ImgSection, MsgWrapper, Scroll, ThemeImg, ThemeSubText, ThemeTitle, Wrap1, Wrap2, Wrap3 } from "../../../shared/styles/ReviewStyles.js";
import InputBox from "./InputBox.jsx";
import useDevice from "../../../shared/hooks/useDevice.js";
import { useRecoilState } from 'recoil';
import { reviewStateFamily } from '../../themeDetail/model/reviewAtom.jsx';

export default function ReviewThird({themeData}) {

  // 반응형
  const { isMobile } = useDevice();
  
  // 후기 데이터 상태
  const [review, setReview] = useRecoilState(reviewStateFamily(themeData.themeId));
  
  // 체크박스 상태
  const [checkedRange, setCheckedRange] = useState(false);

  // 복장 추천 선택 핸들러러
  const handleSelect = (value) => {
    setReview(prev => ({
      ...prev,
      recommendedCloth: value,
    }));
  };

  return (
    <Wrap1>
        
      {!isMobile && (
        <>
          <Wrap2>
            <ThemeTitle>{themeData?.themeName || '테마명'}</ThemeTitle>
            <ThemeSubText>주관식 후기 작성하기</ThemeSubText>
          </Wrap2>
            
          <Wrap3>
            
            <ImgSection >
              <ThemeImg src={themeData?.img || ''} />
              <MsgWrapper>
                <Asterisk3>별점</Asterisk3>
                <GuideMsg>은 필수 입력 사항입니다.</GuideMsg>
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
                      onToggle={() => {
                        setCheckedRange(prev => {
                          const next = !prev;
                          if (next) {
                            setReview(prev => ({ ...prev, lockRatio: null }));
                          }
                          return next;
                        });
                      }}
                    />
                  </Wrap>

                  <RangeItem 
                    disabled={checkedRange}
                    onChange={(value) => {
                      setReview(prev => ({
                        ...prev,
                        lockRatio: checkedRange ? null : Math.round(value / 10),
                      }))
                    }}
                    value={(review.lockRatio ?? 0) * 10}
                  />

                </ItemSection>

                <InputBox
                  rateValue={review.level}
                  rateOnChange={(val) =>
                    setReview(prev => ({ ...prev, level: val }))
                  }
                  label="난이도"
                  placeholder="문제 구성, 지문 이해도 등에 대한 느낌을 자유롭게 적어주세요. (선택)"
                  value={review.levelComment}
                  onChange={(e) => {
                    if (e.target.value.length <= 200) {
                      setReview(prev => ({ ...prev, levelComment: e.target.value }));
                    }
                  }}
                />

                <InputBox
                  rateValue={review.horrorLevel}
                  rateOnChange={(val) =>
                    setReview(prev => ({ ...prev, horrorLevel: val }))
                  }
                  label="공포도"
                  placeholder="창조 공포, 조도, 갑툭튀 등 공포 요소에 대한 느낌을 자유롭게 적어주세요. (선택)"
                  value={review.horrorComment}
                  onChange={(e) => {
                    if (e.target.value.length <= 200) {
                      setReview(prev => ({ ...prev, horrorComment: e.target.value }));
                    }
                  }}
                />

                <InputBox
                  rateValue={review.activityLevel}
                  rateOnChange={(val) =>
                    setReview(prev => ({ ...prev, activityLevel: val }))
                  }
                  label='활동성'
                  placeholder="수직/수평 이동, 복장 관련 등 활동성에 대한 느낌을 자유롭게 적어주세요. (선택)"
                  value={review.activityComment}
                  onChange={(e) => {
                    if (e.target.value.length <= 200) {
                      setReview(prev => ({ ...prev, activityComment: e.target.value }));
                    }
                  }}
                  active
                  selected={review.recommendedCloth}
                  handleSelect={handleSelect}
                />


                <InputBox
                  rateValue={review.storyLevel}
                  rateOnChange={(val) =>
                    setReview(prev => ({ ...prev, storyLevel: val }))
                  }
                  label='스토리'
                  placeholder="몰입도, 전개 방식, 신박함 등 스토리에 대한 느낌을 자유롭게 적어주세요. (선택)"
                  value={review.storyComment}
                  onChange={(e) => {
                    if (e.target.value.length <= 200) {
                      setReview(prev => ({ ...prev, storyComment: e.target.value }));
                    }
                  }}
                />

                <InputBox
                  rateValue={review.interiorLevel}
                  rateOnChange={(val) =>
                    setReview(prev => ({ ...prev, interiorLevel: val }))
                  }
                  label='인테리어'
                  placeholder="공간의 볼륨, 소품의 디테일, 테마 구현도 등 인테리어에 대한 느낌을 자유롭게 적어주세요. (선택)"
                  value={review.interiorComment}
                  onChange={(e) => {
                   if (e.target.value.length <= 200) {
                      setReview(prev => ({ ...prev, interiorComment: e.target.value }));
                    }
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
                  
            <ThemeImg src={themeData?.img || ''} />
                  
            <Wrap2>
              <ThemeTitle>{themeData?.themeName || '테마명'}</ThemeTitle>
              <ThemeSubText>주관식 후기 작성하기</ThemeSubText>
            </Wrap2>
                  
            <MsgWrapper>
              <Asterisk3>별점</Asterisk3>
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
                  onToggle={() => {
                    setCheckedRange(prev => {
                      const next = !prev;
                      if (next) {
                        setReview(prev => ({ ...prev, lockRatio: null }));
                      }
                      return next;
                    });
                  }}
                />
              </Wrap>

              <RangeItem
                disabled={checkedRange}
                onChange={(value) => {
                  setReview(prev => ({
                    ...prev,
                    lockRatio: checkedRange ? null : Math.round(value / 10),
                  }))
                }} 
                value={(review.lockRatio ?? 0) * 10}
              />

            </ItemSection>

            <InputBox
              rateValue={review.level}
              rateOnChange={(val) =>
                setReview(prev => ({ ...prev, level: val }))
              }
              label="난이도"
              placeholder="문제 구성, 지문 이해도 등에 대한 느낌을 자유롭게 적어주세요. (선택)"
              value={review.levelComment}
              onChange={(e) => {
                if (e.target.value.length <= 200) {
                  setReview(prev => ({ ...prev, levelComment: e.target.value }));
                }
              }}
            />

            <InputBox
              rateValue={review.horrorLevel}
              rateOnChange={(val) =>
                setReview(prev => ({ ...prev, horrorLevel: val }))
              }
              label="공포도"
              placeholder="창조 공포, 조도, 갑툭튀 등 공포 요소에 대한 느낌을 자유롭게 적어주세요. (선택)"
              value={review.horrorComment}
              onChange={(e) => {
                if (e.target.value.length <= 200) {
                  setReview(prev => ({ ...prev, horrorComment: e.target.value }));
                }
              }}
            />

            <InputBox
              rateValue={review.activityLevel}
              rateOnChange={(val) =>
                setReview(prev => ({ ...prev, activityLevel: val }))
              }
              label='활동성'
              placeholder="수직/수평 이동, 복장 관련 등 활동성에 대한 느낌을 자유롭게 적어주세요. (선택)"
              value={review.activityComment}
              onChange={(e) => {
                if (e.target.value.length <= 200) {
                  setReview(prev => ({ ...prev, activityComment: e.target.value }));
                }
              }}
              active
              selected={review.recommendedCloth}
              handleSelect={handleSelect}
            />


            <InputBox
              rateValue={review.storyLevel}
              rateOnChange={(val) =>
                setReview(prev => ({ ...prev, storyLevel: val }))
              }
              label='스토리'
              placeholder="몰입도, 전개 방식, 신박함 등 스토리에 대한 느낌을 자유롭게 적어주세요. (선택)"
              value={review.storyComment}
              onChange={(e) => {
                if (e.target.value.length <= 200) {
                  setReview(prev => ({ ...prev, storyComment: e.target.value }));
                }
              }}
            />

            <InputBox
              rateValue={review.interiorLevel}
              rateOnChange={(val) =>
                setReview(prev => ({ ...prev, interiorLevel: val }))
              }
              label='인테리어'
              placeholder="공간의 볼륨, 소품의 디테일, 테마 구현도 등 인테리어에 대한 느낌을 자유롭게 적어주세요. (선택)"
              value={review.interiorComment}
              onChange={(e) => {
                if (e.target.value.length <= 200) {
                  setReview(prev => ({ ...prev, interiorComment: e.target.value }));
                }
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

const Asterisk3 = styled.div`
  color: var(--RIU_Monochrome-400, #718FF2);
  font-family: Pretendard-Bold;
  font-size: 0.75em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.625em;
  }
`;

const Wrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;