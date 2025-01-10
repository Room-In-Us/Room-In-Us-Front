import styled from "styled-components";
import { useNavigate } from "react-router-dom";

function SignupPage() {
    // useNavigate
    const navigate = useNavigate();

    return (
        <PageWrapper>
            회원가입
            <ContentWrapper>
                <InputWrapper>
                    <Title>이름</Title>
                    <StyledInput></StyledInput>
                </InputWrapper>
                <InputWrapper>
                    <Title>이메일</Title>
                    <StyledInput></StyledInput>
                </InputWrapper>
                <InputWrapper>
                    <Title>비밀번호</Title>
                    <StyledInput></StyledInput>
                </InputWrapper>
                <InputWrapper>
                    <Title>비밀번호 확인</Title>
                    <StyledInput></StyledInput>
                </InputWrapper>
            </ContentWrapper>
            <ButtonWrapper>
                <StyledButton onClick={() => navigate('/login')}>
                    이전
                </StyledButton>
                <StyledButton onClick={() => navigate('/')}>
                    완료
                </StyledButton>
            </ButtonWrapper>
        </PageWrapper>
    )
};

export default SignupPage;

// CSS
const PageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
`;

const ContentWrapper = styled.div`
    margin: 1em;
    border: 1px solid white;
    border-radius: 10px;
    width: 30em;
    height: 30em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const InputWrapper = styled.div`
    margin: 1em 0;
    width: 80%;
`;

const Title = styled.div`
`;

const StyledInput = styled.input`
    width: 98%;
    height: 2em;
`;

const ButtonWrapper = styled.div`

`;

const StyledButton = styled.button`
    margin: 0 1em;
    width: 8em;
    height: 2em;
`;