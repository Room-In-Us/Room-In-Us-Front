import React from 'react'
import styled from 'styled-components';
import TagItem from './TagItem';
import { locationTags } from '../model/TagList';
import { priceTags } from '../model/TagList';
import { peopleTags } from '../model/TagList';

export default function TagSection() {

  return (
    <TagWrapper>
      <TagItem title="지역" tags={locationTags} />
      <TagItem title="가격대" tags={priceTags} />
      <TagItem title="인원 수" tags={peopleTags} />
    </TagWrapper>
  )
};

const TagWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3.125em;
`;