import React from 'react'
import styled from 'styled-components';
import RangeItem from './RangeItem';

export default function RangeSection() {
  return (
    <RangeBox>
      <RangeItem/>
    </RangeBox>
  )
}

const RangeBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 6.125em;
  border-radius: 0.625em;
  padding: 0em 0.6em;
  background-color: grey; // 임시로 배경 색상 처리
`;