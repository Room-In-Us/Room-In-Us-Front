import styled from "styled-components";
import InstagramIcon from "../assets/icons/common/instagramIcon.svg?react";
import EmailIcon from "../assets/icons/common/emailIcon.svg?react";
import KakaoTalkIcon from "../assets/icons/common/kakaoTalkIcon.svg?react";

function Footer() {

  return (
    <FooterWrapper>
      <LeftWrapper>
        <StyledButton onClick={() => window.open('/terms', '_blank', 'width=600,height=800')}>이용약관</StyledButton>
        <Divider>|</Divider>
        <StyledButton onClick={() => window.open('/privacy', '_blank', 'width=600,height=800')}>개인정보처리방침</StyledButton>
        <Divider>|</Divider>
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
  border-top: 1px solid var(--Neutral-Palette-Byte-Black-40, #C5C4D5);
  width: 100%;
  height: 2.375rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--Neutral-Palette-Byte-Black-0, #FEFDFF);
`;

const LeftWrapper = styled.div`
  margin-left: 3.75rem;
  display: flex;
  align-items: center;
`;

const StyledButton = styled.p`
  color: var(--Neutral-Palette-Byte-Black-200, #676676);
  font-size: 0.75rem;
  font-family: Pretendard-Bold;
  line-height: 1.125rem;
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-skip-ink: none;
  text-decoration-thickness: auto;
  text-underline-offset: auto;
  text-underline-position: from-font;
  cursor: pointer;
`;

const Divider = styled.div`
  margin: 0 0.625rem;
  color: #B6B5C7;
  font-size: 0.85rem;
`;

const RightWrapper = styled.div`
  margin-right: 3.75rem;
  display: flex;
  align-items: center;
  gap: 0.875rem;
`;

const StyledInstagramIcon = styled(InstagramIcon)`
  color: var(--Neutral-Palette-Byte-Black-200, #676676);
  cursor: pointer;
`;

const StyledEmailIcon = styled(EmailIcon)`
  color: var(--Neutral-Palette-Byte-Black-200, #676676);
  cursor: pointer;
`;

const StyledKakaoTalkIcon = styled(KakaoTalkIcon)`
  cursor: pointer;
`;