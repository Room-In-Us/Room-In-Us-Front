import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "../features/auth/model/authSchema";
import { postSignupAPI } from "../features/auth/api/authAPI";

function SignupPage() {
    const navigate = useNavigate();

    // React Hook Form 설정
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(signupSchema), // Yup 스키마 연결
    });

    // 폼 제출 핸들러
    const onSubmit = async (data) => {
        try {
            // 서버로 보낼 데이터 가공
            const { name, email, password } = data;
            const payload = {
                nickname: name,
                email,
                password,
            };
    
            console.log("전송 데이터:", payload);
    
            // 회원가입 API 호출
            const response = await postSignupAPI(payload);
            console.log("API 응답:", response);
    
            // 회원가입 후 페이지 이동
            navigate("/");
        } catch (error) {
            console.error("회원가입 실패:", error);
            alert("회원가입 중 문제가 발생했습니다. 다시 시도해 주세요.");
        }
    };

    return (
        <FormWrapper onSubmit={handleSubmit(onSubmit)}>
            <PageWrapper>
                <h2>회원가입</h2>
                <ContentWrapper>
                    <InputWrapper>
                        <Title>닉네임</Title>
                        <StyledInput
                            {...register("name")}
                        />
                        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                    </InputWrapper>
                    <InputWrapper>
                        <Title>이메일</Title>
                        <StyledInput
                            {...register("email")}
                        />
                        {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                    </InputWrapper>
                    <InputWrapper>
                        <Title>비밀번호</Title>
                        <StyledInput
                            {...register("password")}
                        />
                        {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                    </InputWrapper>
                    <InputWrapper>
                        <Title>비밀번호 확인</Title>
                        <StyledInput
                            {...register("confirmPassword")}
                        />
                        {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>}
                    </InputWrapper>
                </ContentWrapper>
                <ButtonWrapper>
                    <StyledButton onClick={() => navigate('/login')}>
                        이전
                    </StyledButton>
                    <StyledButton type="submit">
                        완료
                    </StyledButton>
                </ButtonWrapper>
            </PageWrapper>
        </FormWrapper>
    )
};

export default SignupPage;

// CSS
const FormWrapper = styled.form`
    width: 100%;
`;

const PageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
`;

const ContentWrapper = styled.div`
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
    margin: 1em;
    width: 8em;
    height: 2em;
`;

const ErrorMessage = styled.div`
    color: red;
    font-size: 0.8em;
    margin-top: 0.3em;
`;