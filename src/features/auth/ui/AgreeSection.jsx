import { useState } from "react";
import styled from "styled-components";
import { useRecoilState } from 'recoil';
import { signupSectionState, nicknameBackupState } from "../model/authAtom";
import { postSignupAPI } from "../api/authAPI";

function AgreeSection() {
  // state 관리
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [, setSignupSection] = useRecoilState(signupSectionState);
  const [nicknameBackup,] = useRecoilState(nicknameBackupState);

  // 동의하기 핸들러
  const handleAgree = (option) => {
    if (option === "terms") {
      setAgreeTerms(!agreeTerms);
    } else if (option === "privacy") {
      setAgreePrivacy(!agreePrivacy);
    } else if (option === "marketing") {
      setAgreeMarketing(!agreeMarketing);
    } else {
      if (agreeTerms === false || agreePrivacy === false || agreeMarketing === false) {
        setAgreeTerms(true);
        setAgreePrivacy(true);
        setAgreeMarketing(true);
      } else {
        setAgreeTerms(false);
        setAgreePrivacy(false);
        setAgreeMarketing(false);
      }
    }
  }
  
  // 회원 가입
  const onSubmit = async () => {
    try {
      // 서버로 보낼 데이터 가공
      const payload = {
        code: localStorage.getItem("userCode"),
        nickname: nicknameBackup,
        isTermAgreed: agreeTerms,
        isPrivacyAgreed: agreePrivacy,
        isMarketingAgreed: agreeMarketing,
      };
      console.log('전송 데이터:', payload);

      // 회원가입 API 호출
      const response = await postSignupAPI(payload);
      console.log('회원가입 API 응답:', response);

      setSignupSection("complete");
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('회원가입 중 문제가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <SectionWrapper>
      <ContentWrapper>
        <PageNumber>
          2/2
        </PageNumber>
        <TitleWrapper>
          <Title>반가워요!</Title>
          <Description>방탈출 예약을 쉽고 편리하게 도와주는 루미너스입니다 :&#41;</Description>
        </TitleWrapper>
        <AgreeWrapper>
          <SubTitle>약관 동의</SubTitle>
          <ListWrapper>
            <StyledCheckkBox onClick={() => handleAgree("all")} isChecked={agreeTerms && agreePrivacy && agreeMarketing}>✓</StyledCheckkBox>
            <Text>전체 동의</Text>
          </ListWrapper>
        </AgreeWrapper>
        <ListWrapper>
          <StyledCheckkBox onClick={() => handleAgree("terms")} isChecked={agreeTerms}>✓</StyledCheckkBox>
          <Text><Option>&#91;필수&#93;</Option> 이용 약관</Text>
        </ListWrapper>
        <ListWrapper>
          <StyledCheckkBox onClick={() => handleAgree("privacy")} isChecked={agreePrivacy}>✓</StyledCheckkBox>
          <Text><Option>&#91;필수&#93;</Option> 개인정보 수집 및 이용</Text>
        </ListWrapper>
        <ListWrapper>
          <StyledCheckkBox onClick={() => handleAgree("marketing")} isChecked={agreeMarketing}>✓</StyledCheckkBox>
          <Text><Option>&#91;선택&#93;</Option> 마케팅 수신 동의</Text>
        </ListWrapper>
      </ContentWrapper>

      <SignupButton onClick={onSubmit} disabled={!agreeTerms || !agreePrivacy}>
        <SignupText disabled={!agreeTerms || !agreePrivacy}>회원가입 완료</SignupText>
      </SignupButton>
    </SectionWrapper>
  )
}

export default AgreeSection;

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

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const PageNumber = styled.div`
  color: var(--RIU_Monochrome-200, #717486);
  font-family: 'Pretendard-Bold';
  line-height: 130%;
`;

const TitleWrapper = styled.div`
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
`;

const AgreeWrapper = styled.div`
  border-bottom: 1px solid var(--Grayscale-900, #383846);
  padding-bottom: 0.625em;
  display: flex;
  flex-direction: column;
`;

const SubTitle = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: 'Pretendard-Bold';
  font-size: 0.875em;
  line-height: 130%;
`;

const ListWrapper = styled.div`
  margin-top: 0.625em;
  height: 1.25em;
  display: flex;
  align-items: center;
`;

const StyledCheckkBox = styled.button`
  border: ${(props) => (props.isChecked ? "1.5px solid #718FF2" : "1.5px solid #D4D4D4")};
  border-radius: 3.125em;
  padding: 0;
  margin: 0.125em 0.75em 0.125em 0.125em;
  width: 1.3333em;
  height: 1.3333em;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 100%;
  background-color: ${(props) => (props.isChecked ? "var(--RIU_Primary-100, #718FF2)" : "transparent")};
  color: #FFF;
  font-size: 0.75em;
  font-family: 'Pretendard-Medium';
  cursor: pointer;
  transition: all 0.1s ease-in-out;
`;

const Text = styled.div`
  color: var(--RIU_Monochrome-300, #696C7E);
  font-family: 'Pretendard-Medium';
  font-size: 0.875em;
  line-height: 130%;
`;

const Option = styled.span`
  font-family: 'Pretendard-Bold';
`;

const SignupButton = styled.button`
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
      ? "var(--RIU_Monochrome-40, #DFDFE6);"
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
`;

const SignupText = styled.div`
  color: ${({ disabled }) => (disabled ? "var(--RIU_Monochrome-100, #818496)" : "#FFF")};
  font-family: 'Pretendard-Bold';
  line-height: 130%;
  z-index: 1;
  transition: all 0.2s ease-in-out;
`;
