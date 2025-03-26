import { useState } from "react";
import styled from "styled-components";
import { useRecoilState } from 'recoil';
import { signupSectionState, nicknameBackupState } from "../model/authAtom";
import { postNicknameAPI } from "../api/authAPI";

function NicknameSection() {
  // state 관리
  const [nickname, setNickname] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [, setSignupSection] = useRecoilState(signupSectionState);
  const [nicknameBackup, setNicknameBackup] = useRecoilState(nicknameBackupState);

  // 닉네임 중복 검사 실행
  const handleNicknameCheck = async () => {
    try {
      const response = await postNicknameAPI({ nickname });

      if (response.isAvailable === false) {
        setErrorMessage("이미 존재하는 닉네임입니다.");
        setIsVisible(true);
        setNicknameBackup("");
      } else {
        setErrorMessage("사용 가능한 닉네임입니다.");
        setIsVisible(true);
        setNicknameBackup(nickname);
      }

    } catch (error) {
      console.error("닉네임 중복 검사 중 오류 발생:", error);
      setErrorMessage("닉네임 중복 검사 중 오류가 발생했습니다.");
      setIsVisible(true);
    }
  };

  // 섹션 넘어가기
  const handleNextSection = async () => {
    setSignupSection("agree");
  }

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
        <NicknameWrapper>
          <InputText>닉네임</InputText>
          <InputWrapper>
            <StyledInput
              placeholder="닉네임을 입력하세요."
              value={nickname}
              onChange={(e) => {
                const value = e.target.value;
                setNickname(value);
                // 닉네임 백업값이 존재하고, 현재 입력값이 백업값과 다르면 초기화
                if (nicknameBackup && value !== nicknameBackup) {
                  setNicknameBackup("");
                  setIsVisible(false);
                }
                // 에러메시지 떠 있을 경우 에러메시지 감추기
                if (isVisible) {
                  setIsVisible(false);
                }
              }}
            />
            <NicknameCheckButton onClick={handleNicknameCheck} disabled={!nickname.trim()}>닉네임 중복 검사</NicknameCheckButton>
          </InputWrapper>
        </NicknameWrapper>
        <ErrorMessage isVisible={isVisible} isSuccess={nicknameBackup.trim()}>{errorMessage}</ErrorMessage>
      </InputSection>

      <LoginButton onClick={handleNextSection} disabled={!nicknameBackup.trim()}>
        <LoginText disabled={!nicknameBackup.trim()}>다음으로</LoginText>
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

  @media (max-width: 768px) {
    border-radius: 0.9375em;
    padding: 1.25em;
    width: 20.9375em;
    height: 40.625em;
  }
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const PageNumber = styled.div`
  color: var(--RIU_Monochrome-200, #717486);
  font-family: 'Pretendard-Bold';
  line-height: 130%;

  @media (max-width: 768px) {
    font-size: 0.75em;
  }
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
  font-size: 1.125em;
  line-height: 130%;
`;

const Description = styled.div`
  color: var(--RIU_Monochrome-200, #717486);
  font-family: 'Pretendard-Medium';
  font-size: 0.875em;
  line-height: 130%;

  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;

const NicknameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625em;
`;

const InputText = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: 'Pretendard-Bold';
  font-size: 0.875em;
  line-height: 130%;

  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;

const InputWrapper = styled.div`
  height: 2.5em;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledInput = styled.input`
  border: none;
  border-bottom: 1px solid var(--RIU_Monochrome-300, #696C7E);
  width: 68%;
  height: 100%;
  font-size: 0.875em;
  outline: none;

  &::placeholder {
    color: var(--Grayscale-200, #C6C5D7);
    font-family: 'Pretendard-Medium';
    line-height: 130%;
    color: var(--RIU_Monochrome-70, #B3B6C3);
  }

  @media (max-width: 768px) {
    width: 52%;
    font-size: 0.8571em;
  }
`;

const NicknameCheckButton = styled.button`
  all: unset;
  border-radius: 0.7142em;
  width: 8.2857em;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ disabled }) =>
    disabled
      ? "var(--RIU_Monochrome-40, #DFDFE6)"
      : "var(--RIU_Primary-100, #718FF2)"};
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
  color: ${({ disabled }) => (disabled ? "var(--RIU_Monochrome-100, #818496)" : "var(--RIU_Monochrome-10, #F9F9FB)")};
  font-family: 'Pretendard-Bold';
  font-size: 0.875em;
  line-height: 130%;
  transition: all 0.2s ease-in-out;
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
  background: ${({ disabled }) =>
    disabled
      ? "var(--RIU_Monochrome-40, #DFDFE6)"
      : "var(--RIU_Primary-Gradient-02, linear-gradient(282deg, #5B6ACC 0%, #718FF2 100%))"};
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease-in-out;

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
    opacity: ${({ disabled }) => (disabled ? "0" : "0.5")};
  }

  @media (max-width: 768px) {
    height: 2.5em;
  }
`;

const LoginText = styled.div`
  color: ${({ disabled }) => (disabled ? "var(--RIU_Monochrome-100, #818496)" : "#FFF")};
  font-family: 'Pretendard-Bold';
  line-height: 130%;
  z-index: 1;
  transition: all 0.2s ease-in-out;

  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;

const ErrorMessage = styled.div`
  margin-top: 0.625em;
  color: ${(props) => (props.isSuccess ? "var(--RIU_Primary-100, #718FF2)" : "#ED2222")};
  font-family: 'Pretendard-Medium';
  font-size: 0.75em;
  line-height: normal;
  visibility: ${(props) => (props.isVisible ? "visible" : "hidden")};
  opacity: ${(props) => (props.isVisible ? "1" : "0")};
  transition: opacity 0.2s ease-in-out;
`;
