import React from 'react'
import styled from 'styled-components'
import Icon1 from '../assets/icons/boardMorePage/icon1.png'
import Icon2 from '../assets/icons/boardMorePage/icon2.png'
import PostLikeIcon from '../assets/icons/boardMorePage/likeicon.png'
import { useNavigate } from 'react-router-dom'

export default function BoardMorePage() {
    const navigate = useNavigate();

    const handleWrite = () => {
        navigate('/boardwrite');
    }

    const postData = [
        {
            id: 1,
            title: '미스터리스케이프 - 아버지의 비밀 추천합니다.',
            author: '작성자',
            date: '24.09.09',
            like_count: 12
        },
        {
            id: 2,
            title: '미스터리스케이프 - 아버지의 비밀 추천합니다.',
            author: '작성자',
            date: '24.09.09',
            like_count: 12
        },
        {
            id: 3,
            title: '미스터리스케이프 - 아버지의 비밀 추천합니다.',
            author: '작성자',
            date: '24.09.09',
            like_count: 12
        },
        {
            id: 4,
            title: '미스터리스케이프 - 아버지의 비밀 추천합니다.',
            author: '작성자',
            date: '24.09.09',
            like_count: 12
        },
        {
            id: 5,
            title: '미스터리스케이프 - 아버지의 비밀 추천합니다.',
            author: '작성자',
            date: '24.09.09',
            like_count: 12
        },
        {
            id: 6,
            title: '미스터리스케이프 - 아버지의 비밀 추천합니다.',
            author: '작성자',
            date: '24.09.09',
            like_count: 12
        },
        {
            id: 7,
            title: '미스터리스케이프 - 아버지의 비밀 추천합니다.',
            author: '작성자',
            date: '24.09.09',
            like_count: 12
        },
        {
            id: 8,
            title: '미스터리스케이프 - 아버지의 비밀 추천합니다.',
            author: '작성자',
            date: '24.09.09',
            like_count: 12
        },
        {
            id: 9,
            title: '미스터리스케이프 - 아버지의 비밀 추천합니다.',
            author: '작성자',
            date: '24.09.09',
            like_count: 12
        }
    ];

  return (
    <Wrapper>
        <MainBox>
            <MainTitle>인생테마</MainTitle>
            <LayoutBox>
                <PostButton onClick={handleWrite}>글쓰기</PostButton>
                <SubLayout>
                    <SortButton>
                        정렬순
                        <Icon1Img src={Icon1} alt="정렬아이콘" />
                    </SortButton>
                    <InputBox>
                        <Input placeholder="제목+본문 검색하기" />
                        <Icon2Img src={Icon2} alt="검색아이콘" />
                    </InputBox>
                </SubLayout>
            </LayoutBox>
            <ListBox>
                {postData.map((post) => (
                    <PostList key={post.id}>
                        <PostTitle>{post.title}</PostTitle>
                        <PostInfo>
                            <PostAuthor>{post.author}</PostAuthor>
                            <PostDate>{post.date}</PostDate>
                            <LikeWrapper>
                                <LikeIcon src={PostLikeIcon} alt="좋아요아이콘" />
                                <PostLikeCount>{post.like_count}</PostLikeCount>
                            </LikeWrapper>
                        </PostInfo>
                    </PostList>
                ))}
            </ListBox>
        </MainBox>
    </Wrapper>
  )
}

export const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const MainBox = styled.div`
    background-color: #4C4C4C;
    width: 100%;
    height: 100%;
    margin-bottom: 1.5em;
    margin-right: 1.5em;
    margin-left: 1.5em;
    border-radius: 0.625em;
    padding: 1.5em;
    display: flex;
    flex-direction: column;
    gap: 1.3em;
`;

export const MainTitle = styled.div`
    color: #fff;
    font-family: 'esamanru-Medium';
    font-size: 2.8125em;
`;

export const LayoutBox = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
`;

const PostButton = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 0.7em;
    padding-bottom: 0.7em;
    padding-right: 2em;
    padding-left: 2em;
    border: 0.0625em solid #121212;
    border-radius: 0.625em;
    background-color: #313131;
    color: #D2D2D2;
    font-family: 'esamanru-Light';
    box-shadow: 0em 0.25em 0.25em rgba(0, 0, 0, 0.25);
    cursor: pointer;
`;

const SubLayout = styled.div`
    display: flex;
    gap: 1em;
`;

export const SortButton = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.7em;
    border-radius: 0.625em;
    background-color: #313131;
    color: ${({ color }) => color || '#D2D2D2'};
    font-family: 'esamanru-Light';
    font-size: 1em;
    gap: 1em;
    border: 0.0625em solid #121212;
    box-shadow: 0em 0.25em 0.25em rgba(0, 0, 0, 0.25);
`;

export const Icon1Img = styled.img`
    width: 1em;
    cursor: pointer;
`;

const InputBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.7em;
    border-radius: 0.625em;
    background-color: #313131;
    gap: 1em;
    border: 0.0625em solid #121212;
    box-shadow: 0em 0.25em 0.25em rgba(0, 0, 0, 0.25);
`;

const Input = styled.input`
    background-color: transparent;
    border: none;
    width: 100%;
    height: 100%;
    color: #D2D2D2;
    font-family: 'esamanru-Light';
    font-size: 1em;
    &::placeholder {
        color: #D2D2D2;
    }
`;

const Icon2Img = styled.img`
    width: 1.2em;
    cursor: pointer;
`;

const ListBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 1.5em;
    width: 100%;
    border-bottom: 1px solid #fff;
`;

const PostList = styled.div`
    display: flex;
    justify-content: space-between;
    width: 97.5%;
    padding: 0.9em;
    border-top: 1px solid #fff;
    font-family: 'esamanru-Light';
    color: #fff;
    font-size: 1.1em;
`;

const PostTitle = styled.div`
    cursor: pointer;
`;

const PostInfo = styled.div`
    display: flex;
    gap: 4em;
`;

const PostAuthor = styled.div``;

const PostDate = styled.div``;

const LikeWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.3em;
    height: 1.1em;
`;

const LikeIcon  = styled.img`
    width: 1.4em;
`;

const PostLikeCount = styled.div`
    font-size: 0.9em;
`;