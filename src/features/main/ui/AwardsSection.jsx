import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import LightbulbIcon from "../../../shared/assets/icons/main/lightblubIcon.svg?react";
import AwardsImage from "../../../shared/assets/images/main/awardsCloud.png";
import RightArrowIcon from "../../../shared/assets/icons/common/arrow/rightArrow.svg?react";

function AwardsSection() {
  const navigate = useNavigate();

  return (
    <SectionWrapper>
      {/* 제목 영역 */}
      <TitleWrapper>
        <StyledLightbulbIcon />
        <Title>루미너스 힌트!</Title>
      </TitleWrapper>

      {/* 콘텐츠 영역 */}
      <ContainerWrapper>
        {/* 설명 */}
        <DescriptionWrapper>
          <StyledAwardsImage src={AwardsImage} />
          <TextWrapper>
            <Text1>퀄리티 보장 테마를 플레이하고 싶다면?</Text1>
            <Text2>루미너스에서 왕관 모양을 찾아보세요!</Text2>
            <Text3>방탈출 어워즈에서 수상한 테마 및 카페를 모아뒀어요.</Text3>
          </TextWrapper>
        </DescriptionWrapper>

        {/* 버튼 */}
        <Button onClick={() => navigate('/location')}>
          <ButtonText>
            더 많은 테마 둘러보기
          </ButtonText>
          <StyledRightArrowIcon />
        </Button>
      </ContainerWrapper>
    </SectionWrapper>
  )
}

export default AwardsSection;

// CSS
const SectionWrapper = styled.div`
  width: 70rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 1024px) {
    width: 43.3125rem;
  }
  @media (max-width: 768px) {
    width: 20.9375rem;
  }
`;

const TitleWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

const StyledLightbulbIcon = styled(LightbulbIcon)`
  width: 1.6875rem;
  height: 1.6875rem;
`;

const Title = styled.p`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: 'Pretendard-Bold';
  font-size: 1.40625rem;

  @media (max-width: 1024px) {
    font-size: 1.40625rem;
  }
  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const ContainerWrapper = styled.div`
  border-radius: 0.46875rem;
  padding: 1.5625rem 1.875rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  background: var(--RIU_Monochrome-10, #F9F9FB);

  @media (max-width: 1024px) {
    padding: 1.25rem 1.5rem;
  }
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.875rem;
  }
`;

const DescriptionWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.875rem;

  @media (max-width: 1024px) {
    gap: 1.5rem;
  }
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const StyledAwardsImage = styled.img`
  width: 6.43rem;
  height: 6.43rem;

  @media (max-width: 1024px) {
    width: 5rem;
    height: 5rem;
  }
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const Text1 = styled.div`
  margin-bottom: 0.375rem;
  color: var(--RIU_Primary-100, #718FF2);
  font-family: 'Pretendard-Bold';
  font-size: 1rem;
  line-height: normal;

  @media (max-width: 1024px) {
    font-size: 0.875rem;
  }
`;

const Text2 = styled.div`
  margin-bottom: 0.625rem;
  color: var(--RIU_Primary-100, #718FF2);
  font-family: 'Pretendard-Bold';
  font-size: 1.25rem;
  line-height: normal;

  @media (max-width: 1024px) {
    font-size: 1.125rem;
  } 
`;

const Text3 = styled.div`
  color: var(--RIU_Monochrome-100, #818496);
  font-family: 'Pretendard-Bold';
  font-size: 0.875rem;
  line-height: 1.3125rem;
  letter-spacing: -0.02188rem;

  @media (max-width: 1024px) {
    font-size: 0.75rem;
  } 
`;

const Button = styled.div`
  border-radius: 2.5rem;
  display: flex;
  padding: 1rem 2.5rem;
  align-items: center;
  gap: 0.46875rem;
  background: var(--RIU_Primary-Gradient-02, linear-gradient(282deg, #5B6ACC 0%, #718FF2 100%));
  cursor: pointer;

  @media (max-width: 768px) {
    padding: 0.875rem 1.875rem;
  }
`;

const ButtonText = styled.div`
  color: var(--RIU_Monochrome-10, #F9F9FB);
  font-family: 'Pretendard-Bold';
  font-size: 0.9375rem;
  line-height: normal;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const StyledRightArrowIcon = styled(RightArrowIcon)`
  width: 0.75rem;
  fill: var(--RIU_Monochrome-10, #F9F9FB);

  @media (max-width: 768px) {
    width: 0.9375rem;
  }
`;
