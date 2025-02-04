import React from 'react'
import styled from 'styled-components'
import TagSection from './TagSection'
import RangeSection from './RangeSection'
import CircleInfo from '../../../shared/assets/icons/level/circleinfo.svg'

export default function StandardSection() {
  return (
    <StandardWrapper>

      <RangeWrapper>

        <TextWrapper>
          <RangeText>숙련도</RangeText>
          <LevelInfoIcon src={CircleInfo} />
        </TextWrapper>
        
        <RangeSection/>

      </RangeWrapper>

      <TagSection/>

    </StandardWrapper>
  )
};

const StandardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 25%;
  gap: 3.125em;
`;

const RangeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  gap: 1.25em;
`;

const TextWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.625em;
`;

const RangeText = styled.div`
  font-family: 'Pretendard-Bold';
  font-size: 1.125em;
  color: #fff;
`;

const LevelInfoIcon = styled.img`
  width: 1em;
  height: 1em;
`;