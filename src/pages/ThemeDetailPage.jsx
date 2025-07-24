import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import LeftArrowIcon from "../shared/assets/icons/common/arrow/leftArrow.svg?react";
import ThemeOverviewCard from "../features/themeDetail/ui/ThemeOverviewCard";
import ThemeInfoSection from "../features/themeDetail/ui/ThemeInfoSection";
import { useRecoilValue } from 'recoil';
import ReviewWriteModal from "../features/review/ui/ReviewWriteModal";
import { reviewModalState } from "../features/themeDetail/model/reviewAtom";
import { getThemeDetailAPI, getThemePriceAPI } from "../features/themeDetail/api/themeDetailAPI";
import { userInfoModalState } from "../features/auth/model/authAtom";
import UserInfoModal from "../features/auth/ui/UserInfoModal";
import useDevice from "../shared/hooks/useDevice";

function ThemeDetailPage() {
  // 상태 관리
  const isModalOpen = useRecoilValue(reviewModalState);
  const isUSerInfoModalOpen = useRecoilValue(userInfoModalState);
  const [themeDetail, setThemeDetail] = useState({});
  const [themePrice, setThemePrice] = useState([]);

  const navigate = useNavigate();
  const { themeId } = useParams();

  const { isMobile } = useDevice();

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
            테마 선택으로 돌아가기
          </BackButtonText>
        </BackButtonWrapper>
      )}

      {/* 콘텐츠 영역 */}
      <ContentWrapper isMobile={isMobile}>
        {/* 테마 카드 */}
        <ThemeOverviewCard themeData={themeDetail} />

        {/* 테마 상세 정보 */}
        <ThemeInfoSection
          themeData={themeDetail}
          themePrice={themePrice}
        />
      </ContentWrapper>

      {/* 후기 작성 모달 */}
      {isModalOpen && (
        <ModalBackdrop>
          <ReviewWriteModal themeData={themeDetail}/>
        </ModalBackdrop>
      )}

      {/* 유저 정보 모달 */}
      {isUSerInfoModalOpen && (
        <ModalBackdrop>
          <UserInfoModal />
        </ModalBackdrop>
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
