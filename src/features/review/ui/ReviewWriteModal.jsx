import styled from "styled-components";
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { reviewModalState, reviewSectionState, reviewStateFamily } from "../../themeDetail/model/reviewAtom.jsx";
import ReviewFirst from "./ReviewFirst.jsx";
import ReviewSecond from "./ReviewSecond.jsx";
import ReviewThird from "./ReviewThird.jsx";
import CloseIcon from "../../../shared/assets/icons/reviewWrite/closeicon.svg";
import LikeIcon from "../../../shared/assets/icons/reviewWrite/likeIcon.svg";
import ReviewLast from "./ReviewLast.jsx";
import { postReviewAPI } from "../api/postReviewAPI.js";
import { putMyReviewAPI } from "../../mypage/api/myReviewAPI.js";
import PopUpModal from "../../../shared/components/PopUpModal.jsx";

function ReviewWriteModal({ themeData, reviewId, isEditMode, onUpdated }) {

  // 상태 관리
  const setReviewModalOpen = useSetRecoilState(reviewModalState);
  const [reviewSection, setReviewSection] = useRecoilState(reviewSectionState);
  const isModalOpen = useRecoilValue(reviewModalState);
  const [reviewData,] = useRecoilState(reviewStateFamily(themeData.themeId));
  const resetReview = useResetRecoilState(reviewStateFamily(themeData.themeId));
  const [, setIsSubmitting] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  // 모달 닫기 핸들러
  const handleClose = () => {
    setReviewModalOpen(false);
  };

  // 초기화 효과
  useEffect(() => {
    if (isModalOpen) {
      if (!isEditMode) {
        resetReview();
      }
      setReviewSection("first");
    }
  }, [isModalOpen, isEditMode, resetReview, setReviewSection]);

  const sectionComponents = [
    <ReviewFirst themeData={themeData} key="first" />, 
    <ReviewSecond themeData={themeData} key="second" />, 
    <ReviewThird themeData={themeData} key="third" />, 
    <ReviewLast themeData={themeData} isEditMode={isEditMode} key="last" />
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

  // 필수 데이터 검증 함수
  const validateRequiredFields = (data) => {
    const missingFields = [];
    const fieldNames = {
      satisfactionLevel: '총평 점수',
      review: '총평 선택',
      level: '난이도 점수',
      horrorLevel: '공포도 점수',
      activityLevel: '활동성 점수',
      storyLevel: '스토리 점수',
      interiorLevel: '인테리어 점수'
    };

    // satisfactionLevel 검증
    if (!data.satisfactionLevel || data.satisfactionLevel === 0) {
      missingFields.push(fieldNames.satisfactionLevel);
    }

    // review 검증
    if (!data.review) {
      missingFields.push(fieldNames.review);
    }

    // level 검증
    if (data.level === null || data.level === undefined || data.level === 0) {
      missingFields.push(fieldNames.level);
    }

    // horrorLevel 검증
    if (data.horrorLevel === null || data.horrorLevel === undefined || data.horrorLevel === 0) {
      missingFields.push(fieldNames.horrorLevel);
    }

    // activityLevel 검증
    if (data.activityLevel === null || data.activityLevel === undefined || data.activityLevel === 0) {
      missingFields.push(fieldNames.activityLevel);
    }

    // storyLevel 검증
    if (data.storyLevel === null || data.storyLevel === undefined || data.storyLevel === 0) {
      missingFields.push(fieldNames.storyLevel);
    }

    // interiorLevel 검증
    if (data.interiorLevel === null || data.interiorLevel === undefined || data.interiorLevel === 0) {
      missingFields.push(fieldNames.interiorLevel);
    }

    return missingFields;
  };

const parseServerErrors = (rawMsg) => {
  const messages = [];
  const EXCLUDE_PHRASES = [
    "0.5 단위로 입력해 주세요"
  ];

  rawMsg
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean)
    .forEach(line => {
      const [, message] = line.split(":").map(s => s.trim());
      if (!message) return;

      // 제외 문구 필터링
      if (EXCLUDE_PHRASES.some(p => message.includes(p))) return;

      messages.push(message);
    });

  return messages;
};


  const handleSubmit = async () => {

    const { uiState, ...serverData } = reviewData;
    void uiState;
  
    setIsSubmitting(true);
  
    try {
      // 수정 모드
      if (isEditMode) {
        await putMyReviewAPI(themeData.themeId, reviewId, serverData);
        console.log("[ReviewWriteModal] 후기 수정 요청 데이터:", serverData);
        alert("후기가 수정되었습니다.");
  
        if (onUpdated) onUpdated();
        resetReview();
        setReviewSection("last");
        return;
      }
  
      // 작성 모드
      const response = await postReviewAPI(themeData.themeId, serverData);
  
      if (!response.success) {
        const rawMsg = response?.message ?? '알 수 없는 오류가 발생했습니다.';
        const parsed = parseServerErrors(rawMsg);
        setErrorMessages(parsed);
        setErrorModalOpen(true);
        return;
      }
  
      const missingFields = validateRequiredFields(reviewData);
  
      if (missingFields.length > 0) {
        setErrorMessages(missingFields);
        setErrorModalOpen(true);
        return;
      }
  
      console.log("[ReviewWriteModal] 후기 작성 요청 데이터:", serverData);
      alert("후기가 작성되었습니다.");
      resetReview();
      setReviewSection("last");
  
    } catch (err) {
      console.error("후기 전송 실패:", err);
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
          <NextBtn onClick={goNext} $isFirstLast>
            <NextBtnText>다음</NextBtnText>
          </NextBtn>
        )}
        {reviewSection === "second" && (
          <BtnSection>
            <PrevBtn onClick={goPrev}>
              <PrevBtnText>이전</PrevBtnText>
            </PrevBtn>
            <NextBtn onClick={goNext} $isCompact>
              <NextBtnText>다음</NextBtnText>
            </NextBtn>
          </BtnSection>
        )}

        {reviewSection === "third" && (
          <BtnSection>
            <PrevBtn onClick={goPrev}>
              <PrevBtnText>이전</PrevBtnText>
            </PrevBtn>
            <NextBtn onClick={handleSubmit} $isCompact>
              <NextBtnText>
                {isEditMode ? "후기 수정 완료" : "후기 작성 완료"}
              </NextBtnText>
            </NextBtn>
          </BtnSection>
        )}

        {reviewSection === "last" && (
          <NextBtn onClick={handleClose} $isFirstLast>
            <NextBtnText>닫기</NextBtnText>
          </NextBtn>
        )}
      </Wrapper>

      {/* 에러 모달 */}
      <PopUpModal
        isOpen={errorModalOpen}
        title="후기 작성 실패"
        message="다음 필수 항목이 누락되었습니다."
        messageList={errorMessages}
        confirmText="확인"
        showCancel={false}
        onConfirm={() => setErrorModalOpen(false)}
        onCancel={() => setErrorModalOpen(false)}
      />
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
  width: ${({ $isCompact }) => $isCompact ? '23.125em' : '100%'};
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
    width: ${({ $isFirstLast }) => $isFirstLast ? '100%' : 'calc(100% - 7.125em - 1em)'};
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