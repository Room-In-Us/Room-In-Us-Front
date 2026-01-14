import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import LeftArrowIcon from "../shared/assets/icons/common/arrow/leftArrow.svg?react";
import ThemeOverviewCard from "../features/themeDetail/ui/ThemeOverviewCard";
import ThemeInfoSection from "../features/themeDetail/ui/ThemeInfoSection";
import { useRecoilValue, useSetRecoilState } from 'recoil';
import ReviewWriteModal from "../features/review/ui/ReviewWriteModal";
import { reviewModalState } from "../features/themeDetail/model/reviewAtom";
import { getThemeDetailAPI, getThemePriceAPI } from "../features/themeDetail/api/themeDetailAPI";
import { userInfoModalState } from "../features/auth/model/authAtom";
import UserInfoModal from "../features/auth/ui/UserInfoModal";
import useDevice from "../shared/hooks/useDevice";
import MoreIcon from "../shared/assets/icons/common/more.svg?react";
import CloseIcon from "../shared/assets/icons/survey/modalCancelIcon.svg?react"
import ReservationIcon from "../shared/assets/icons/themeDetail/reservationIcon.svg?react";
import CalenderIcon from "../shared/assets/icons/themeDetail/scheduleIcon.svg?react";
import PencilIcon from "../shared/assets/icons/themeDetail/pencilIcon.svg?react";
import useAuthSession from "../shared/hooks/useAuthSession";
import ScheduleModal from "../features/schedule/ui/ScheduleModal";
import { scheduleModalState } from "../features/schedule/modal/scheduleAtom";
import PopUpModal from "../shared/components/PopUpModal";

function ThemeDetailPage() {
  // 상태 관리
  const isModalOpen = useRecoilValue(reviewModalState);
  const setReviewWriteModal = useSetRecoilState(reviewModalState);
  const isUSerInfoModalOpen = useRecoilValue(userInfoModalState);
  const [themeDetail, setThemeDetail] = useState({});
  const [themePrice, setThemePrice] = useState([]);
  const [isFloatingButtonOpen, setIsFloatingButtonOpen] = useState(false);
  const setScheduleWriteModal = useSetRecoilState(scheduleModalState);
  const modalState = useRecoilValue(scheduleModalState);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [reviewRefetchKey, setReviewRefetchKey] = useState(0);

  const navigate = useNavigate();
  const { isFavoritePage } = useLocation().state || {};
  const { themeId } = useParams();

  const { isMobile } = useDevice();

  // 로그인 상태 검증
  const isLoggedIn = useAuthSession();

  // api 호출
  useEffect(() => {
    async function fetchAll() {
      try {
        const [detailRes, priceRes] = await Promise.all([
          getThemeDetailAPI(themeId),
          getThemePriceAPI(themeId),
        ]);
        setThemeDetail(detailRes);
        setThemePrice(priceRes);
      } catch (err) {
        console.error('테마 상세 api 호출 중 오류 발생: ', err);
      }
    }
  
    fetchAll();
  }, [themeId]);

  return (
    <PageWrapper>
      {/* 돌아가기 버튼 */}
      {!isMobile && (
        <BackButtonWrapper>
          <StyledLeftArrowIcon onClick={() => navigate(-1)}/>
          <BackButtonText onClick={() => navigate(-1)}>
            {isFavoritePage ? '내가 찜한 테마 목록으로 돌아가기' : '테마 선택으로 돌아가기'}
          </BackButtonText>
        </BackButtonWrapper>
      )}

      {/* 콘텐츠 영역 */}
      <ContentWrapper>
        {/* 테마 카드 */}
        <ThemeOverviewCard themeData={themeDetail} />

        {/* 테마 상세 정보 */}
        <ThemeInfoSection
          themeData={themeDetail}
          themePrice={themePrice}
          reviewRefetchKey={reviewRefetchKey}
        />

      </ContentWrapper>

      {/* 후기 작성 모달 */}
      {isModalOpen && (
        <ModalBackdrop>
          <ReviewWriteModal
            themeData={themeDetail}
            onUpdated={() => setReviewRefetchKey((p) => p + 1)}
          />
        </ModalBackdrop>
      )}

      {/* 유저 정보 모달 */}
      {isUSerInfoModalOpen && (
        <ModalBackdrop>
          <UserInfoModal />
        </ModalBackdrop>
      )}

      {/* 모바일 플러팅 액션 버튼 */}
      {isMobile && (
        isFloatingButtonOpen ? (
          <ModalBackdrop>
            <FloatingMenuWrapper>
              <InteractionButton onClick={() => window.open(themeDetail?.storeInfo?.storeReservationUrl, '_blank',)}>
                <StyledReservationIcon />
                <ButtonText>
                  예약하기
                </ButtonText>
              </InteractionButton>
              <InteractionButton
                onClick={() => {
                  if (!isLoggedIn) {
                    setIsLoginModalOpen(true);
                    return;
                  }
                  setScheduleWriteModal({ isOpen: true, mode: 'add', reservation: null });
                  setIsFloatingButtonOpen(false);
                }}>
                <StyledCalenderIcon />
                <ButtonText>
                  일정 추가하기
                </ButtonText>
              </InteractionButton>
              <InteractionButton
                onClick={() => {
                  if (!isLoggedIn) {
                    setIsLoginModalOpen(true);
                    return;
                  }
                  setReviewWriteModal(true);
                  setIsFloatingButtonOpen(false);
                }}>
                <StyledPencilIcon />
                <ButtonText>
                  후기 작성하기
                </ButtonText>
              </InteractionButton>
            </FloatingMenuWrapper>
            <FloatingButton onClick={() => setIsFloatingButtonOpen(prev => !prev)}>
              <StyledCloseIcon/>
            </FloatingButton>
          </ModalBackdrop>
          ) : (
          <FloatingButton onClick={() => setIsFloatingButtonOpen(prev => !prev)}>
            <StyledMoreIcon/>
          </FloatingButton>
          )
      )}

      {/* 로그인 모달 */}
      <PopUpModal
        isOpen={isLoginModalOpen}
        message="로그인 후 사용할 수 있는 기능입니다."
        subMessage="로그인하시겠습니까?"
        confirmText="확인"
        cancelText="취소"
        onConfirm={() => navigate('/login')}
        onCancel={() => setIsLoginModalOpen(false)}
      />

      {/* 일정 관리 모달 */}
      {modalState.isOpen && (
        <ScheduleModal themeId={themeId} />
      )}
    </PageWrapper>
  )
}

export default ThemeDetailPage;

// CSS
const PageWrapper = styled.div`
  margin-top: 5.625rem; // 헤더높이
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.875rem;

  @media (max-width: 768px) {
    position: relative;
  }
`;

const BackButtonWrapper = styled.div`
  width: 70rem;
  display: flex;
  align-items: center;
`;

const StyledLeftArrowIcon = styled(LeftArrowIcon)`
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  fill: var(--RIU_Monochrome-500, #515467);
`;

const BackButtonText = styled.div`
  padding-left: 0.625rem;
  color: var(--RIU_Monochrome-500, #515467);
  text-align: center;
  font-family: 'Pretendard-Medium';
  font-size: 1rem;
  line-height: normal;
  cursor: pointer;
`;

const ContentWrapper = styled.div`
  width: 70rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  @media (max-width: 768px) {
    width: 90%;
    flex-direction: column;
    gap: 1.25rem;
  }
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

const FloatingButton = styled.div`
  border-radius: 2.5rem;
  width: 3.125rem;
  height: 3.125rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  aspect-ratio: 1/1;
  background: var(--RIU_Primary-Gradient-02, linear-gradient(282deg, #5B6ACC 0%, #718FF2 100%));
  position: fixed;
  bottom: 1.25rem;
  right: 1.25rem;
`;

const StyledMoreIcon = styled(MoreIcon)`
  width: 1.25rem;
  height: 1.25rem;
  color: var(--RIU_Primary-0, #E8EAFF);
`;

const StyledCloseIcon = styled(CloseIcon)`
  width: 1.25rem;
  height: 1.25rem;
  color: var(--RIU_Primary-0, #E8EAFF);
`;

const FloatingMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  gap: 0.625rem;
  position: fixed;
  bottom: 5rem;
  right: 1.25rem;
`;

const InteractionButton = styled.div`
  border-radius: 2.5rem;
  padding: 0rem 1.25rem;
  box-sizing: border-box;
  width: 9.375rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  background: var(--RIU_Monochrome-10, #F9F9FB);
`;

const ButtonText = styled.div`
  color: var(--RIU_Primary-200, #6680DF);
  font-family: Pretendard;
  font-size: 0.625rem;
  font-style: normal;
  font-weight: 700;
  line-height: 130%;
`;

const StyledReservationIcon = styled(ReservationIcon)`
  width: 0.625rem;
  height: 0.625rem;
`;
const StyledCalenderIcon = styled(CalenderIcon)`
  width: 0.625rem;
  height: 0.625rem;
`;
const StyledPencilIcon = styled(PencilIcon)`
  width: 0.625rem;
  height: 0.625rem;
  color: var(--RIU_Primary-80, #8DA3FF);
`;
