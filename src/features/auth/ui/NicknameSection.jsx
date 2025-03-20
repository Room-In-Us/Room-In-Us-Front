import { useState } from "react";
import styled from "styled-components";
import { postNicknameAPI } from "../api/authAPI";

function NicknameSection() {
  const [nickname, setNickname] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  // 닉네임 중복 검사 실행
  const handleNicknameCheck = async () => {
    try {
      if (!nickname.trim()) {
        setErrorMessage("닉네임을 입력해주세요.");
        setIsVisible(true);

        setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => setErrorMessage(""), 200);
        }, 3000);
        return;
      }

      const response = await postNicknameAPI({ nickname });

      if (response.isAvailable === false) {
        setErrorMessage("이미 존재하는 닉네임입니다.");
        setIsVisible(true);

        setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => setErrorMessage(""), 200);
        }, 3000);
      } else {
        setIsVisible(false);
        setErrorMessage("");
        alert("사용 가능한 닉네임입니다!");
      }

    } catch (error) {
      console.error("닉네임 중복 검사 중 오류 발생:", error);
      setErrorMessage("닉네임 중복 검사 중 오류가 발생했습니다.");
      setIsVisible(true);

      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setErrorMessage(""), 200);
      }, 3000);
    }
};

  return (
    <SectionWrapper>
      <InputSection>
        <PageNumber>
          1/2
        </PageNumber>
        <TextWrapper>
          <Title>반가워요!</Title>
          <Description>방탈출 예약을 쉽고 편리하게 도와주는 루미너스입니다 :&#41;</Description>
        </TextWrapper>
        <InputWrapper>
          <InputText>닉네임</InputText>
          <StyledInput
            placeholder="닉네임을 입력하세요."
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </InputWrapper>
        <ErrorMessage isVisible={isVisible}>{errorMessage}</ErrorMessage>
      </InputSection>

      <LoginButton onClick={handleNicknameCheck}>
        <LoginText>다음으로</LoginText>
      </LoginButton>
    </SectionWrapper>
  )
}

export default NicknameSection;

// CSS
const SectionWrapper = styled.div`
  border-radius: 1.875em;
  padding: 1.875em 2.5em;
  box-sizing: border-box;
  width: 32.5em;
  height: 50em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  background-color: #FFF;
  z-index: 1;
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const PageNumber = styled.div`
  color: var(--RIU_Monochrome-200, #717486);
  font-family: 'Pretendard-Bold';
  line-height: 130%;
`;

const TextWrapper = styled.div`
  margin: 1.5625em 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.625em;
`;

const Title = styled.div`
  color: var(--RIU_Primary-100, #718FF2);
  font-family: 'Pretendard-Bold';
  font-size: 1.5em;
  line-height: 130%;
`;

const Description = styled.div`
  color: var(--RIU_Monochrome-200, #717486);
  font-family: 'Pretendard-Medium';
  line-height: 130%;
`;

const InputWrapper = styled.div`
  border-bottom: 1px solid var(--Grayscale-900, #383846);
  display: flex;
  flex-direction: column;
`;

const InputText = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: 'Pretendard-Bold';
  font-size: 0.875em;
  line-height: 130%;
`;

const StyledInput = styled.input`
  border: none;
  width: 90%;
  height: 2em;
  outline: none;

  &::placeholder {
    color: var(--Grayscale-200, #C6C5D7);
    font-family: 'Pretendard-Medium';
    line-height: 130%;
  }
`;

const LoginButton = styled.button`
  all: unset;
  border: none;
  display: flex;
  height: 3.125em;
  justify-content: center;
  align-items: center;
  gap: 0.625em;
  align-self: stretch;
  border-radius: 2.5em;
  background: var(--RIU_Primary-Gradient-02, linear-gradient(282deg, #5B6ACC 0%, #718FF2 100%));
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(19, 26, 115, 0.5);
    opacity: 0;
    transition: all 0.1s ease-in-out;
  }

  &:hover::before {
    opacity: 0.5;
  }
`;

const LoginText = styled.div`
  color: #FFF;
  font-family: 'Pretendard-Bold';
  line-height: 130%;
  z-index: 1;
`;

const ErrorMessage = styled.div`
  margin-top: 0.625em;
  color: #ED2222;
  font-family: 'Pretendard-Medium';
  font-size: 0.75em;
  line-height: normal;
  visibility: ${(props) => (props.isVisible ? "visible" : "hidden")};
  opacity: ${(props) => (props.isVisible ? "1" : "0")};
  transition: all 0.2s ease-in-out;
`;
