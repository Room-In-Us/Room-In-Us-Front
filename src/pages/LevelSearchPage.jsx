import styled from 'styled-components';
import InfoBoxSection from '../features/levelInfo/ui/InfoBoxSection';
import StandardSection from '../features/levelInfo/ui/StandardSection';

export default function LevelSearchPage() {

  return (
    <Wrapper>
        
      <InfoHeader>
        <LevelText>숙련도 검색</LevelText>
        <SubText>내 방탈출 레벨에 맞춰 추천해드려요</SubText>
      </InfoHeader>
      
      <MainWrapper>
        
        <RawBox>
          {/* 기준 영역 */}
          <StandardSection/>
          {/* 방탈출 카드 영역 */}
          <InfoBoxSection/>
        </RawBox>
        
      </MainWrapper>

    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.25em;
  margin: 2em;
`;

const InfoHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 0.5em;
  gap: 0.5em;
`;

const LevelText = styled.div`
  font-family: 'esamanru-Bold';
  color: #fff;
  font-size: 2.3em;
  margin-top: 0.5em;
`;

const SubText = styled.div`
  font-family: 'esamanru-medium';
  color: #fff;
  font-size: 1em;
`;

const RawBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 1.875em;
`;