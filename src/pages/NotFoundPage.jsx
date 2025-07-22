import styled from 'styled-components';
import ErrorImage from '../shared/assets/images/common/noData/404Image.png';
import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <ContentWrapper>
        {/* 이미지 영역 */}
        <StyledErrorImage src={ErrorImage}/>

        {/* 버튼 영역 */}
        <ButtonWrapper>
          <TextWrapper>
            <Title>
              404 Error
            </Title>
            <Description>
              이런! 막다른 길인 것 같아요.<br/>
              요청하신 페이지의 주소가 변경, 삭제되었을 수 있어요.
            </Description>
          </TextWrapper>
          <Button onClick={() => navigate('/')}>
            <ButtonText>
              홈으로 돌아가기
            </ButtonText>
          </Button>
        </ButtonWrapper>
      </ContentWrapper>
    </PageWrapper>
  );
}

export default NotFoundPage;

// CSS
const PageWrapper = styled.div`
font-size: 70%;
  margin-top: 5.625rem;
  width: 100vw;
  height: calc(100vh - 5.625rem - 2.375rem); // 100vh-헤더-풋터
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    font-size: 100%;
  }
`;

const ContentWrapper = styled.div`
  width: 27.25em;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5em;

  @media (max-width: 768px) {
    width: 19.6875em;
    gap: 1.875em;
  }
`;

const StyledErrorImage = styled.img`
  height: 21.43669em;
  align-self: stretch;
  aspect-ratio: 436.00/342.99;

  @media (max-width: 768px) {
    width: 16.875em;
    height: 13.25em;
    aspect-ratio: 135/106;
  }
`;

const ButtonWrapper = styled.div`
  border-radius: 1.25em;
  padding: 2.5em 3.125em;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.4375em;
  align-self: stretch;
  background: var(--RIU_Monochrome-10, #F9F9FB);

  @media (max-width: 768px) {
    padding: 1.875em;
    gap: 1.4375em;
  }
`;

const TextWrapper = styled.div`
  width: 21em;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1em;

  @media (max-width: 768px) {
    width: 200%;
  }
`;

const Title = styled.div`
  color: var(--RIU_Primary-100, #718FF2);
  font-family: 'Pretendard-Black';
  font-size: 3em;
  line-height: 100%;

  @media (max-width: 768px) {
    font-size: 2.25em;
  }
`;

const Description = styled.div`
  color: var(--RIU_Monochrome-100, #818496);
  font-family: 'Pretendard-Medium';
  font-size: 1em;
  line-height: 160%;

  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;

const Button = styled.div`
  border-radius: 2.5em;
  background: var(--RIU_Primary-100, #718FF2);
  padding: 0.875em 0em;
  box-sizing: border-box;
  height: 3.125em;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.625em;
  align-self: stretch;
  cursor: pointer;

  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease-in-out;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(19, 26, 115, 0.5);
    opacity: 0;
    transition: all 0.1s ease-in-out;
  }

  &:hover::before {
    opacity: 0.5;
  }

  @media (max-width: 768px) {
    height: 2.5em;
  }
`;

const ButtonText = styled.div`
  color: var(--RIU_Monochrome-10, #F9F9FB);
  font-family: 'Pretendard-Bold';
  font-size: 1em;
  line-height: 130%;
  z-index: 10;

  @media (max-width: 768px) {
    font-size: 0.875em;
  }
`;