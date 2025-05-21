import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import LogoIcon from '../shared/assets/icons/common/logo.svg?react';
import UpdateIcon from '../shared/assets/icons/myPage/updateIcon.svg?react';
import ArrowIcon from '../shared/assets/icons/myPage/rightArrow.svg?react';

function MyPage() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <ContentWrapper>
        {/* 계정 정보 영역 */}
        <InfoWrapper>
          <StyledLogoIcon/>
          <EmailWrapper>
            <Nickname>
              선방
            </Nickname>
            <Email>
              roominus@test.com
            </Email>
            <StyledUpdateIcon/>
          </EmailWrapper>
        </InfoWrapper>

        {/* 네비게이션 영역 */}
        <NavigatorWrapper>
          <NavigatorBox onClick={() => navigate('/mypage/preferences')}>
            <NavigatorText>
              내 성향조사 수정하기
            </NavigatorText>
            <StyledArrowIcon/>
          </NavigatorBox>
          <NavigatorBox onClick={() => navigate('/mypage/reservations')}>
            <NavigatorText>
              예약한 방탈출 관리
            </NavigatorText>
            <StyledArrowIcon/>
          </NavigatorBox>
          <NavigatorBox onClick={() => navigate('/mypage/favorites')}>
            <NavigatorText>
              찜해둔 방탈출
            </NavigatorText>
            <StyledArrowIcon/>
          </NavigatorBox>
          <NavigatorBox onClick={() => navigate('/mypage/reviews')}>
            <NavigatorText>
              내가 작성한 후기
            </NavigatorText>
            <StyledArrowIcon/>
          </NavigatorBox>
        </NavigatorWrapper>
      </ContentWrapper>
    </PageWrapper>
  )
}

export default MyPage;

// CSS
const PageWrapper = styled.div`
  margin-top: 5.625rem;
  width: 100vw;
  height: calc(100vh - 5.625rem - 2.375rem); // 100vh-헤더-풋터
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.25em;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
`;

const InfoWrapper = styled.div`
  padding: 2.5rem 1.25rem 1.25rem 1.25rem;
  box-sizing: border-box;
  width: 32.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.25rem;
`;

const StyledLogoIcon = styled(LogoIcon)`
  width: 5.625rem;
  height: 5.625rem;
`;

const EmailWrapper = styled.div`
  width: 18.5rem;
  height: 7.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
`;

const Nickname = styled.div`
  height: 2.625rem;
  color: var(--RIU_Primary-400, #515DBA);
  font-family: 'Pretendard-ExtraBold';
  font-size: 1.375rem;
  line-height: normal;
`;

const Email = styled.div`
  color: var(--RIU_Monochrome-100, #818496);
  text-align: center;
  font-family: 'Pretendard-Bold';
  line-height: normal;
`;

const StyledUpdateIcon = styled(UpdateIcon)`
  width: 1.6875rem;
  height: 1.6875rem;
  cursor: pointer;
`;

const NavigatorWrapper = styled.div`
  padding: 1.25rem;
  box-sizing: border-size;
  width: 32.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;
`;

const NavigatorBox = styled.div`
  border-bottom: 1px solid var(--RIU_Monochrome-50, #D6D6DF);
  padding: 0.625rem;
  box-sizing: border-box;
  height: 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  cursor: pointer
`;

const NavigatorText = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: 'Pretendard-Medium';
  line-height: normal;
`;

const StyledArrowIcon = styled(ArrowIcon)`
  width: 0.9375rem;
  height: 0.9375rem;
`;