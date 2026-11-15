import styled from 'styled-components';
import TextLogo from '../../shared/assets/icons/landing/landingTextLogo2.svg?react';
import Img1 from '../../shared/assets/images/landing/landingSection1Img1.png';
import Img2 from '../../shared/assets/images/landing/landingSection1Img2.png';
import Img3 from '../../shared/assets/images/landing/landingSection1Img3.png';
import Img4 from '../../shared/assets/images/landing/landingSection1Img4.png';
import Img5 from '../../shared/assets/images/landing/landingSection1Img5.png';
import InfoListItem from './InfoListItem';
import { Fade } from 'react-awesome-reveal';

const LandingSection1 = () => {
  return (
    <SectionWrapper>
      <InfoAndImgWrapper>
        <InfoWrapper>
          <StyledTextLogo />
          <InfoBoldText>
            내 취향 탐색부터 예약까지
            <br />
            루미너스가 도와드릴게요!
          </InfoBoldText>
          <InfoText>
            루미너스는 단순한 추천이 아니라,
            <br />
            ‘나를 더 잘 아는 선택’을 돕는 취향의 나침반이에요.
            <br />한 번의 클릭이 아니라, 한 편의 여정을 함께합니다.
          </InfoText>
        </InfoWrapper>
        <StyledImg1 src={Img5} />
      </InfoAndImgWrapper>
      <ListWrapper>
        <Fade direction="up" duration={700} triggerOnce>
          <InfoListItem
            number="01"
            Img={Img1}
            title="내 취향이 뭘까? 취향 탐색 맞춤 테마 추천"
            description={`공포보다 미스터리, 논리보다 스토리, 장치보다 연출—
              루미너스는 당신의 ‘좋아함’을 읽고, 그에 맞는 방탈출을 제안합니다.
              당신이 아직 몰랐던 ‘진짜 취향’을 발견해보세요.`}
          />
        </Fade>
        <Fade direction="up" duration={700} triggerOnce>
          <InfoListItem
            number="02"
            Img={Img2}
            title="이 근처 방탈출? 유명 테마? 지도 하나로 끝"
            description={`도심 속 한켠, 혹은 익숙한 거리의 골목 어딘가.
              지금 당신 근처의 방탈출을 한눈에 보고,
              가장 설레는 테마로 바로 떠날 수 있습니다.`}
          />
        </Fade>
        <Fade direction="up" duration={700} triggerOnce>
          <InfoListItem
            number="03"
            Img={Img3}
            title="NO 스포! 자세하게 남길 수 있는 후기"
            description={`결말은 숨기고, 감정은 또렷하게 남기세요.
              루미너스의 템플릿 기반 후기 시스템으로 난이도·몰입도·연출감 등을 정리하면, 그날의 순간이 자연스럽게 기록됩니다.
              스포 없이도 깊이 있는 후기, 당신의 경험이 누군가의 다음 선택이 됩니다. 
        `}
          />
        </Fade>
        <Fade direction="up" duration={700} triggerOnce>
          <InfoListItem
            number="04"
            Img={Img4}
            title="언제 예약했더라? 예약 일정 남기기"
            description={`처음 도전했던 방, 다시 가고 싶은 테마,
              그리고 함께했던 사람들까지.
              루미너스는 방탈출 캘린더를 통해 당신의 방탈출을 하나의 추억으로 엮어줍니다.`}
            isLast={true}
          />
        </Fade>
      </ListWrapper>
    </SectionWrapper>
  );
};

export default LandingSection1;

// CSS
const SectionWrapper = styled.section`
  padding: 5.625em 14.375em 7.5em 14.375em;
  border-radius: 3.125em 3.125em 0 0;
  background: var(--RIU_Monochrome-10, #f9f9fb);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 5em;
  pointer-events: auto;

  @media (max-width: 768px) {
    padding: 3.125em 1.5em 7.5em 1.5em;
    border-radius: 1.875em 1.875em 0 0;
    align-items: center;
  }
`;

const InfoAndImgWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5em;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 3.75em;
  }
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2.5em;

  @media (max-width: 768px) {
    gap: 1.25em;
  }
`;

const StyledTextLogo = styled(TextLogo)`
  width: 21.3125em;
  height: 7.5em;

  @media (max-width: 768px) {
    width: 17.5em;
    height: 6.15625em;
  }
`;

const InfoBoldText = styled.div`
  color: var(--RIU_Monochrome-400, #616277);
  font-family: 'Pretendard-Bold';
  font-size: 3em;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 1.75em;
  }
`;

const InfoText = styled.div`
  color: var(--RIU_Monochrome-200, #717486);
  font-family: 'Pretendard-Medium';
  font-size: 1.25em;
  line-height: 150%;

  @media (max-width: 768px) {
    font-size: 1em;
  }
`;

const StyledImg1 = styled.img`
  width: 46em;
  height: 46em;

  @media (max-width: 768px) {
    width: 20.9375em;
    height: 20.9375em;
  }
`;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
