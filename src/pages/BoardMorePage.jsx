import { useState } from 'react';
import styled from 'styled-components';
import Icon1 from '../shared/assets/icons/boardMore/icon1.png';
import Icon2 from '../shared/assets/icons/boardMore/icon2.png';
import PostLikeIcon from '../shared/assets/icons/boardMore/likeicon.png';
import { useNavigate } from 'react-router-dom';

export default function BoardMorePage() {

    const navigate = useNavigate();

    const handleWrite = () => {
        navigate('/boardwrite');
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageGroup, setCurrentPageGroup] = useState(0);
    
    const postsPerPage = 10;
    const pagesPerGroup = 10;
    
    const postData = Array.from({length: 500}, (_, i) => ({
        id: i + 1,
        title: `게시물 제목 ${i + 1}`,
        author: '작성자',
        date: '24.09.09',
        like_count: 12
    }));

    const totalPages = Math.ceil(postData.length / postsPerPage);

    const handleNextPageGroup = () => {
        if ((currentPageGroup + 1) * pagesPerGroup < totalPages) {
            setCurrentPageGroup(prev => prev + 1);
            setCurrentPage((currentPageGroup + 1) * pagesPerGroup + 1);
        }
    };

    const handlePreviousPageGroup = () => {
        if (currentPageGroup > 0) {
            setCurrentPageGroup(prev => prev - 1);
            setCurrentPage(currentPageGroup * pagesPerGroup); 
        };
    }   

    const startPage = currentPageGroup * pagesPerGroup + 1;
    const endPage = Math.min((currentPageGroup + 1) * pagesPerGroup, totalPages);

    const displayedPosts = postData.filter((_, index) => {
        const startIdx = (currentPage - 1) * postsPerPage;
        const endIdx = startIdx + postsPerPage;
        return index >= startIdx && index < endIdx;
    });

  return (
    <Wrapper>
        <MainBox>
            <MainTitle>인생테마</MainTitle>
            <LayoutBox>
                <PostButton onClick={handleWrite}>글쓰기</PostButton>
                <SubLayout>
                    <SortButton>
                        정렬순
                        <Icon1Img src={Icon1} alt="정렬아이콘"/>
                    </SortButton>
                    <InputBox>
                        <Input placeholder="제목+본문 검색하기" />
                        <Icon2Img src={Icon2} alt="검색아이콘" />
                    </InputBox>
                </SubLayout>
            </LayoutBox>
            <ListBox>
            {displayedPosts.map((post) => (
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
            <PaginationWrapper>
                <Pagination>
                    <PageButton onClick={handlePreviousPageGroup} disabled={currentPageGroup === 0}>
                        &lt;
                    </PageButton>
                    {startPage > 1 && <Ellipsis>···</Ellipsis>}
                    {Array.from({length: endPage - startPage + 1}, (_, i) => startPage + i).map(page => (
                        <CurrentPageButton key={page} onClick={() => setCurrentPage(page)} disabled={currentPage === page}>
                            {page}
                        </CurrentPageButton>
                    ))}
                    {endPage < totalPages && <Ellipsis>···</Ellipsis>}
                    <PageButton onClick={handleNextPageGroup} disabled={endPage === totalPages}>
                        &gt;
                    </PageButton>
                </Pagination>
            </PaginationWrapper>
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
    gap: 1em;
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

const SortButton = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.7em;
    border-radius: 0.625em;
    background-color: #313131;
    color: #D2D2D2;
    font-family: 'esamanru-Light';
    font-size: 1em;
    gap: 1em;
    border: 0.0625em solid #121212;
    box-shadow: 0em 0.25em 0.25em rgba(0, 0, 0, 0.25);
`;

export const Icon1Img = styled.img`
    width: 1em;
    cursor: pointer;
    transition: transform 0.5s ease;
    transform: ${({ isRotated }) => (isRotated ? 'rotate(180deg)' : 'rotate(0deg)')};
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
    margin-top: 1em;
    width: 100%;
    border-bottom: 1px solid #fff;
`;

const PostList = styled.div`
    display: flex;
    justify-content: space-between;
    width: 97.5%;
    padding: 0.85em;
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

const PaginationWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 0.5em;
`;

const Pagination = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 40%;
    height: 2em;
`;

const PageButton = styled.div`
    background-color: transparent;
    color: ${props => (props.disabled ? 'grey' : '#fff')};
    cursor: ${props => (props.disabled ? '' : 'pointer')};
    padding: 1em;
    font-size: 1.3em;

    &:hover {
        color: ${props => (props.disabled ? '' : '#810000')};
    }
`;

const CurrentPageButton = styled.span`
    font-size: 1em;
    color: #fff;
    padding: 0.3em;
    color: ${props => (props.disabled ? '#fff' : '#A4A4A4')};
    &:hover {
        color: ${props => (props.disabled ? '' : '#810000')};
        cursor: pointer;
    }
`;

const Ellipsis = styled.span`
    font-size: 0.8em;
    color: #fff;
    padding: 0.3em;
`;