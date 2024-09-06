import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import BackgroundImg from "../assets/images/loginPage/background2.png";

function LoginPage() {
    // state 관리
    const [isCheck, setIsCheck] = useState(false);

    // navigate
    const navigate = useNavigate();

    // 로그인 상태 유지 함수
    const handleCheckBox = () => {
        setIsCheck(!isCheck);
    }
    
    return (
        <PageWrapper>
            <ContentWrapper>
                {/* 좌측 영역 */}
                <LeftWrapper>
                    후기와 예약까지<br/>
                    한 번에 살필 수 있는,
                </LeftWrapper>
                
                {/* 우측 영역 */}
                <RightWrapper>
                    <UpWrapper>
                        {/* 아이디 */}
                        <InputWrapper>
                            <InputText>
                                아이디
                            </InputText>
                            <StyledInput/>
                        </InputWrapper>
                        {/* 비밀번호 */}
                        <InputWrapper>
                            <InputText>
                                비밀번호
                            </InputText>
                            <StyledInput type="password"/>
                        </InputWrapper>
                        {/* 로그인상태유지 버튼 */}
                        <LoginStateWrapper>
                                <StyledCheckbox onClick={handleCheckBox} isCheck={isCheck}>✓</StyledCheckbox>
                                <CheckboxText onClick={handleCheckBox}>로그인 상태 유지하기</CheckboxText>
                        </LoginStateWrapper>
                    </UpWrapper>
                    <DownWrapper>
                        <LoginButton onClick={() => navigate("/")}>로그인</LoginButton>
                        <SignupText onClick={() => navigate("/signup")}>
                            회원가입 하기
                        </SignupText>
                    </DownWrapper>
                </RightWrapper>
            </ContentWrapper>
        </PageWrapper>
    )
}

export default LoginPage;

// CSS
const PageWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ContentWrapper = styled.div`
    margin-top: 1em;
    border-radius: 1em;
    display: flex;
    justify-content: space-between;
    width: 60em;
    height: 36em;
    background-color: #030303;
    background-image: url(${BackgroundImg});
    background-size: 55em;
    background-repeat: no-repeat;
`;

const LeftWrapper = styled.div`
    margin: 1.5em;
    width: 10em;
    color: #EAEAEA;
    font-family: 'Pretendard-SemiBold';
    font-weight: 600;
    font-size: 2.3em;
`;

const RightWrapper = styled.div`
    padding: 2em 3em 3em 3em;
    box-sizing: border-box;
    margin: 3.45em;
    border-radius: 1em;
    width: 35%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #1A1A1A;
`;

const UpWrapper = styled.div`
    // 필요 시 작성
`;

const InputWrapper = styled.div`
    width: 100%;
`;

const InputText = styled.div`
    margin-top: 1em;
    color: #FBE8E9;
    font-family: 'Pretendard-Medium';
    font-weight: 500;
`;

const StyledInput = styled.input`
    padding: 0 1em;
    box-sizing: border-box;
    margin: 0.5em 0;
    border: none;
    border-radius: 0.5em;
    width: 100%;
    height: 3.5em;
    background-color: #322F35;
    color: #FBE8E9;
    outline: none;
`;

const LoginStateWrapper = styled.div`
    height: 2em;
    display: flex;
    flex-directon: column;
    align-items: center;
`;

const StyledCheckbox = styled.div`
    border: 1px solid white;
    border: ${(props) => (props.isCheck ? '1px solid #940000' : '1px solid white')};;
    border-radius: 3px;
    width: 1em;
    height: 1em;
    text-align: center;
    background-color: ${(props) => (props.isCheck ? '#940000' : 'transparent')};
    color: ${(props) => (props.isCheck ? 'white' : 'transparent')};;
    transition: all 0.2s ease;
    cursor: pointer;
`;

const CheckboxText = styled.div`
    margin-left: 0.6em;
    color: white;
    font-family: 'Pretendard-Regular';
    font-weight: 400;
    font-size: 0.8125em;
    cursor: pointer;
`;

const DownWrapper = styled.div`
    text-align: center;
`;

const LoginButton = styled.div`
    border: none;
    border-radius: 0.5em;
    width: 100%;
    height: 3em;
    line-height: 3em;
    text-align: center;
    background-color: #940000;
    color: white;
    font-family: 'Pretendard-Medium';
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover{
        filter: brightness(80%);
    }
`;

const SignupText = styled.div`
    margin-top: 0.6em;
    color: white;
    font-family: 'Pretendard-regular';
    font-weight: 400;
    cursor: pointer;
`;