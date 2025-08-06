import styled from "styled-components";
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { reviewModalState, reviewSectionState } from "../../themeDetail/model/reviewAtom.jsx";
import ReviewFirst from "./ReviewFirst.jsx";
import ReviewSecond from "./ReviewSecond.jsx";
import ReviewThird from "./ReviewThird.jsx";
import CloseIcon from "../../../shared/assets/icons/reviewWrite/closeicon.svg";
import LikeIcon from "../../../shared/assets/icons/reviewWrite/likeIcon.svg";
import ReviewLast from "./ReviewLast.jsx";
import { postReviewAPI } from "../api/postReviewAPI.js";
import { reviewState } from "../../themeDetail/model/reviewAtom.jsx";

function ReviewWriteModal({themeData}) {

  // 상태 관리
  const setReviewModalOpen = useSetRecoilState(reviewModalState);
  const [reviewSection, setReviewSection] = useRecoilState(reviewSectionState);
  const isModalOpen = useRecoilValue(reviewModalState);
  const reviewData = useRecoilValue(reviewState);
  const [, setIsSubmitting] = useState(false);

  // 모달 닫기 핸들러
  const handleClose = () => {
    setReviewModalOpen(false);
  };

  // 초기화 효과
  useEffect(() => {
    if (isModalOpen) {
      setReviewSection("first");
    }
  }, [isModalOpen, setReviewSection]);

  const sectionComponents = [
    <ReviewFirst themeData={themeData} key="first" />, 
    <ReviewSecond themeData={themeData} key="second" />, 
    <ReviewThird themeData={themeData} key="third" />, 
    <ReviewLast themeData={themeData} key="last" />
  ];

  const currentSectionIndex = ["first", "second", "third", "last"].indexOf(reviewSection);

  // 다음 화면 이동
  const goNext = () => {
    if (reviewSection === "first") setReviewSection("second");
    else if (reviewSection === "second") setReviewSection("third");
    else if (reviewSection === "third") setReviewSection("last");
  };

  // 이전 화면 이동
  const goPrev = () => {
    if (reviewSection === "second") setReviewSection("first");
    else if (reviewSection === "third") setReviewSection("second");
  };  

  // 후기 작성 제출 핸들러
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      console.log("themeId:", themeData.themeId);
      console.log("reviewData:", reviewData);

      await postReviewAPI(themeData.themeId, reviewData);
      setReviewSection("last");
    } catch (err) {
      console.error("후기 전송 실패:", err);
      alert("후기 전송 실패: 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <ModalWrapper>

      <ModalHeader>
        <Wrap>
          <Btn src={LikeIcon} />
          <ModalTitle>후기 작성하기</ModalTitle>
        </Wrap>
        <CloseBtn src={CloseIcon} onClick={handleClose} />
      </ModalHeader>

      <Wrapper>

        {sectionComponents[currentSectionIndex]}

        {/* 버튼 영역 */}
        {reviewSection === "first" && (
          <NextBtn onClick={goNext} isFirstLast>
            <NextBtnText>다음</NextBtnText>
          </NextBtn>
        )}
        {reviewSection === "second" && (
          <BtnSection>
            <PrevBtn onClick={goPrev}>
              <PrevBtnText>이전</PrevBtnText>
            </PrevBtn>
            <NextBtn onClick={goNext} isCompact>
              <NextBtnText>다음</NextBtnText>
            </NextBtn>
          </BtnSection>
        )}

        {reviewSection === "third" && (
          <BtnSection>
            <PrevBtn onClick={goPrev}>
              <PrevBtnText>이전</PrevBtnText>
            </PrevBtn>
            <NextBtn onClick={handleSubmit} isCompact>
              <NextBtnText>후기 작성 완료</NextBtnText>
            </NextBtn>
          </BtnSection>
        )}

        {reviewSection === "last" && (
          <NextBtn onClick={handleClose} isFirstLast>
            <NextBtnText>닫기</NextBtnText>
          </NextBtn>
        )}
      </Wrapper>
    </ModalWrapper>
  )
}

export default ReviewWriteModal;

// CSS
const ModalWrapper = styled.div`
font-size: 0.8rem; // 임의로 지정
  border-radius: 0.625em;
  width: 40em;
  height: 43.75em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: var(--RIU_Monochrome-10, #F9F9FB);

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    width: 22.1875rem;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.625em;
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid var(--RIU_Monochrome-30, #E7E8ED);
`;

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.625em;
`;

const ModalTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  
  color: var(--RIU_Monochrome-100, #818496);
  font-family: Pretendard-Bold;
  font-size: 0.875em;
`;

const Btn = styled.img`
  width: 1.25em;
  height: 1.25em;
`;

const CloseBtn = styled.img`
  width: 1.25em;
  height: 1.25em;
  cursor: pointer;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 1.25em 1.875em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  flex: 1;
  min-height: 0;  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    padding: 1.25em;
  }
`;

const BtnSection = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1.25em;
  width: 100%;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    gap: 1em;
  }
`;

const PrevBtn = styled.div`
  display: flex;
  width: calc(100% - 23.125em - 1.25em);
  padding: 0.875em 0em;
  justify-content: center;
  align-items: center;
  border-radius: 2.5em;
  background: var(--RIU_Primary-0, #E8EAFF);
  box-sizing: border-box;
  cursor: pointer;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    width: 7.125em;
    height: 2.5em;
  }
`;

const PrevBtnText = styled.div`
  color: var(--RIU_Primary-100, #718FF2);
  font-family: Pretendard-Bold;
  font-size: 1em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.875em;
  }
`;

const NextBtn = styled.div`
  display: flex;
  width: ${({ isCompact }) => isCompact ? '23.125em' : '100%'};
  height: 3.125em;
  padding: 0.875em 0em;
  justify-content: center;
  align-items: center;
  border-radius: 2.5em;
  background: var(--RIU_Primary-Gradient-02, linear-gradient(282deg, #5B6ACC 0%, #718FF2 100%));
  box-sizing: border-box;
  cursor: pointer;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    width: ${({ isFirstLast }) => isFirstLast ? '100%' : 'calc(100% - 7.125em - 1em)'};
    height: 2.5em;
  }
`;

const NextBtnText = styled.div`
  color: var(--RIU_Monochrome-10, #F9F9FB);
  font-family: Pretendard-Bold;
  font-size: 1em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.875em;
  }
`;