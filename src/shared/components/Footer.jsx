import styled from "styled-components";
import InstagramIcon from "../assets/icons/common/instagramIcon.svg?react";
import EmailIcon from "../assets/icons/common/emailIcon.svg?react";
import KakaoTalkIcon from "../assets/icons/common/kakaoTalkIcon.svg?react";

function Footer() {
  return (
    <FooterWrapper>
      <LeftWrapper>
        <StyledButton>루미너스 사업자 정보</StyledButton>
        <StyledButton>이용약관</StyledButton>
        <StyledButton>개인정보처리방침</StyledButton>
        <StyledButton>문의하기</StyledButton>
      </LeftWrapper>
      <RightWrapper>
        <StyledInstagramIcon/>
        <StyledEmailIcon/>
        <StyledKakaoTalkIcon/>
      </RightWrapper>
    </FooterWrapper>
  )
}

export default Footer;

// CSS
const FooterWrapper = styled.div`
  width: 100%;
  height: 3rem;
  display: flex;
  justify-content: space-between;
`;

const LeftWrapper = styled.div`
  margin-left: 3rem;
  display: flex;
  align-items: center;
`;

const StyledButton = styled.p`
  margin-right: 1rem;
  color: white;
  cursor: pointer;
  font-size: 0.8125rem;
`;

const RightWrapper = styled.div`
  margin-right: 3rem;
  display: flex;
  align-items: center;
`;

const StyledInstagramIcon = styled(InstagramIcon)`
  margin: 0 0.5rem;
  cursor: pointer;
`;

const StyledEmailIcon = styled(EmailIcon)`
  margin: 0 0.5rem;
  cursor: pointer;
`;

const StyledKakaoTalkIcon = styled(KakaoTalkIcon)`
  margin: 0 0.5rem;
  cursor: pointer;
`;