import React from 'react'
import styled from 'styled-components';

export default function TagItem({ title, tags }) {

  return (
    <StandardBox>
      <StandardText>{title}</StandardText>
      <TagBox>
        {tags.map((tag, index) => (
        <Tag key={index}>{tag}</Tag>
        ))}
      </TagBox>
  </StandardBox>
  )
};

const StandardBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.25em;
`;

const TagBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  gap: 1em;
`;

const Tag = styled.div`
  box-sizing: border-box;

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.875em 1em;
  gap: 0.625em;

  width: 7.78em;
  height: 2.67em;

  border: 1px solid #B3B3B3;
  border-radius: 1.5em;

  color: #B3B3B3;
  font-size: 1.125em;
  font-family: Pretendard-Light;
`;

const StandardText = styled.div`
  font-family: 'Pretendard-Bold';
  font-size: 1.125em;
  color: #fff;
`;