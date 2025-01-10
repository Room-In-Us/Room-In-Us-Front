import styled from "styled-components";
import { useNavigate } from "react-router-dom";

function UserInfoPage() {
    const navigate = useNavigate();

    return (
        <PageWrapper>
            <h2>방탈출 성향</h2>
            <ContentWrapper>
                <h3>숙련도</h3>
                <StyledHr/>
                <h3>선호 장르</h3>
                <StyledHr/>
                <h3>선호하는 플레이 인원</h3>
                <StyledHr/>
                <h3>나의 방탈출 취향은?</h3>
                <StyledHr/>
                <h3>공포테마 포지션</h3>
                <StyledHr/>
                <h3>방탈출 성향 (기타 내용 직접 입력)</h3>
            </ContentWrapper>
            <ButtonWrapper>
                <StyledButton onClick={() => navigate('/login')}>
                    돌아가기
                </StyledButton>
                <StyledButton onClick={() => navigate('/login')}>
                    등록완료
                </StyledButton>
            </ButtonWrapper>
        </PageWrapper>
    )
};

export default UserInfoPage;

// CSS
const PageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
`;

const ContentWrapper = styled.div`
    padding: 2em;
    box-sizing: border-box;
    border: 1px solid white;
    border-radius: 10px;
    width: 30em;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const StyledHr = styled.hr`
    margin-top: 1em;
    width: 100%;
`;

const ButtonWrapper = styled.div`
`;

const StyledButton = styled.button`
    margin: 1em;
    width: 8em;
    height: 2em;
    cursor: pointer;
`;