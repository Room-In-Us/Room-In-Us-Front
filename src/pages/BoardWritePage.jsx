import React, { useState } from 'react'
import styled from 'styled-components'
import Icon1 from '../assets/icons/boardMorePage/icon1.png'
import { Wrapper, MainBox, MainTitle, LayoutBox, SortButton, Icon1Img } from './BoardMorePage';

export default function BoardWritePage() {
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('게시판을 선택해주세요!');

  const handleToggleCategories = () => {
    setShowCategories(!showCategories);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category); // 선택한 카테고리 상태 저장
    setShowCategories(false); // 카테고리 선택 후 드롭다운 닫기
  };

  return (
    <Wrapper>
      <MainBox>
        <MainTitle>글 작성</MainTitle>
        <LayoutBox>
          <SortButton color="#fff">
            {selectedCategory}
            <Icon1Img src={Icon1} alt='정렬아이콘' onClick={handleToggleCategories} />
          </SortButton>

          {showCategories && (
            <CategoryBox>
              <CategoryButton onClick={() => handleCategorySelect('인생테마 게시판')}>인생테마 게시판</CategoryButton>
              <Divider />
              <CategoryButton onClick={() => handleCategorySelect('질문 게시판')}>질문 게시판</CategoryButton>
            </CategoryBox>
          )}

          <SubmitButton>저장하기</SubmitButton>
        </LayoutBox>
        <TitleInputBox placeholder='제목을 입력하세요.'/>
        <ContentInputBox placeholder='내용을 입력하세요.' />
      </MainBox>
    </Wrapper>
  )
}

const SubmitButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 0.7em;
  padding-bottom: 0.7em;
  padding-right: 1em;
  padding-left: 1em;
  border-radius: 0.625em;
  background-color: #930000;
  color: #D2D2D2;
  font-family: 'esamanru-Light';
  cursor: pointer;
  box-shadow: 0.25em 0.25em 0.625em rgba(147, 0, 0, 0.35);
`;

const TitleInputBox = styled.input`
  padding-top: 1em;
  padding-bottom: 1em;
  padding-right: 1.5em;
  padding-left: 1.5em;
  border-radius: 0.625em;
  background-color: #313131;
  border: 0.0625em solid #121212;
  box-shadow: 0em 0.25em 0.25em rgba(0, 0, 0, 0.25);
  font-family: 'esamanru-Light';
  font-size: 1em;
  color: #fff;
  &::placeholder {
    color: #fff;
  }
`;

const ContentInputBox = styled.textarea`
  padding: 1.5em;
  border-radius: 0.625em;
  background-color: #313131;
  border: 0.0625em solid #121212;
  box-shadow: 0em 0.25em 0.25em rgba(0, 0, 0, 0.25);
  font-family: 'esamanru-Light';
  font-size: 1em;
  color: #fff;
  &::placeholder {
    color: #fff;
  }
  height: 25em;
  resize: none;
`;

const CategoryBox = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 2em;
  margin-top: 1em;
  border: 0.0625em solid #121212;
  border-radius: 0.625em;
  background-color: #313131;
  box-shadow: 0.25em 0.25em 0.625em rgba(0, 0, 0, 0.35);
`;

const CategoryButton = styled.div`
  padding: 0.7em;
  color: #fff;
  font-family: 'esamanru-Light';
  cursor: pointer;
  text-align: center;
  border-radius: 0.625em;
  &:hover {
    background-color: #777777;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 0.0625em solid #121212;
  width: 100%;
  margin: 0em;
`;