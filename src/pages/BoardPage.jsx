import React from 'react'
import styled from 'styled-components'
import BoardImage from '../assets/images/boardPage/boardimg.png'
import TitleTextImg from '../assets/images/boardPage/boardpagetitle.png'
import Background from '../assets/images/boardPage/boardimgbackground.png'
import { useNavigate } from 'react-router-dom'

export default function BoardPage() {
    const navigate = useNavigate();

    const handleMore = () => {
        navigate('/boardmore');
    }

    const boardData = [
        {
            id: 1,
            title: '안녕하세요.',
            replyNum: '100+'
        },
        {
            id: 2,
            title: '요즘 홍대 이스케이프 재밌나요?',
            replyNum: '100+'
        },
        {
            id: 3,
            title: '제목',
            replyNum: '100+'
        },
        {
            id: 4,
            title: '제목',
            replyNum: '100+'
        },
        {
            id: 5,
            title: '제목',
            replyNum: '100+'
        },
        {
            id: 6,
            title: '제목',
            replyNum: '100+'
        }
    ];

  return (
    <Wrapper>
        <TitleBoxWrapper>
            <TitleBoxImg src={BoardImage} alt='게시판페이지이미지' />
            <ImgBackground src={Background} alt='게시판페이지이미지배경' />
            <TitleText src={TitleTextImg} alt='게시판페이지제목' />
        </TitleBoxWrapper>
        <BoardBoxWrapper>
            <BoardList>
                <BoardTitleBox>
                    <BoardTitle>인생 테마</BoardTitle>
                    <ShowMoreButton onClick={handleMore}>더보기</ShowMoreButton>
                </BoardTitleBox>
                {boardData.map((board) => (
                    <ListItemBox key={board.id}>
                        <PostTitle>{board.title}</PostTitle>
                        <ReplyNum>{board.replyNum}</ReplyNum>
                    </ListItemBox>
                ))}
            </BoardList>
            <BoardList>
                <BoardTitleBox>
                    <BoardTitle>질문</BoardTitle>
                    <ShowMoreButton>더보기</ShowMoreButton>
                </BoardTitleBox>
                {boardData.map((board) => (
                    <ListItemBox key={board.id}>
                        <PostTitle>{board.title}</PostTitle>
                        <ReplyNum>{board.replyNum}</ReplyNum>
                    </ListItemBox>
                ))}
            </BoardList>
        </BoardBoxWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    gap: 2em;
    margin-bottom: 4em;
`;

const TitleBoxWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const TitleBoxImg = styled.img`
    width: 90%;
    border-radius: 0.3125em;
`;

const TitleText = styled.img`
    position: absolute;
    right: 8em;
    width: 20%;
`;

const ImgBackground = styled.img`
    position: absolute;
    width: 90%;
    border-radius: 0.3125em;
`;

const BoardBoxWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2em;
    width: 90%;
    box-shadow: 0em 0.25em 0.25em rgba(0, 0, 0, 0.25);
`;

const BoardTitleBox = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #787777;
    border-bottom: 0.0625em solid #AAAAAA;
    padding: 0.9375em;
    border-radius: 0.3125em 0.3125em 0em 0em;
    position: relative;
`;

const BoardTitle = styled.div`
    color: #E0E0E0;
    font-family: 'esamanru-Medium';
    font-size: 1.5em;
    text-shadow: 0em 0.25em 0.25em rgba(0, 0, 0, 0.25);
`;

const ShowMoreButton = styled.div`
    border: none;
    background-color: transparent;
    cursor: pointer;
    font-family: 'esamanru-Light';
    font-size: 0.8em;
    color: #E0E0E0;
    position: absolute;
    bottom: 1em;
    right: 0.9375em;
`;

const BoardList = styled.div`
    width: 50%;
    height: 100%;
    list-style-type: none;
    font-family: 'esamanru-Medium';
    border-radius: 0.3125em;
    background-color: #4D4D4D;
`;

const ListItemBox = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 0.9375em;
`;

const PostTitle = styled.div`
    color: #E4E4E4;
    font-family: 'esamanru-Medium';
    cursor: pointer;
`;

const ReplyNum = styled.div`
    color: #B0B0B0;
    font-family: 'esamanru-Light';
    font-size: 0.6875em;
`;