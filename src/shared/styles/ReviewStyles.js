import styled from "styled-components";

export const Wrap1 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: 1.25em;

  flex: 1;
  min-height: 0;
`;

export const Wrap2 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ isLast }) => (isLast ? 'center' : 'flex-start')};
  gap: ${({ isLast }) => (isLast ? '0.625em' : '0.25em')};

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    align-items: center;
    gap: 0.375em;
  }
`;

export const ThemeTitle = styled.div`
  display: flex;
  align-items: center;

  color: var(--RIU_Primary-500, #4648A7);
  font-family: Pretendard-ExtraBold;
  font-size: 1.375em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 1em;
  }
`;

export const ThemeSubText = styled.div`
  display: flex;
  align-items: center;

  color: var(--RIU_Monochrome-500, #515467);
  font-family: Pretendard-Medium;
  font-size: 0.875em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;

export const Wrap3 = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  gap: 1.25em;

  flex: 1;
  min-height: 0;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    height: auto;
    flex-direction: column;
    align-items: center;
    gap: 0.875em;
  }
`;

export const Scroll = styled.div`
  box-sizing: content-box;
  padding-bottom: 1.25em;

  position: relative;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  min-height: 0;

  padding-right: 0.5625em;
  margin-right: -1.125em;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &:hover::-webkit-scrollbar-thumb {
    border-radius: 30px;
    background-color: #8DA3FF;
  }
    &::-webkit-scrollbar-track {
    background: transparent;
  }

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: ${({ $isSecond }) => ($isSecond ? '1.25em' : '1.875em')};
  }
`;

export const ImgSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    align-items: center;
    width: 100%;
  }
`;

export const ThemeImg = styled.img`
  width: 10.875em;
  height: 16.25em;
  border-radius: 0.625em;
  background: url(<path-to-image>) lightgray -7.025px 0px / 108.075% 100.375% no-repeat;
  object-fit: cover;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    width: 9.375em;
    height: 13.125em;
  }
`;

export const Asterisk = styled.div`
  color: var(--RIU_Monochrome-400, #718FF2);
  font-family: Pretendard-Medium;
  font-size: 0.75em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.625em;
  }
`;

export const GuideMsg = styled.div`
  display: flex;
  color: var(--RIU_Monochrome-400, #616277);
  font-family: Pretendard-Medium;
  font-size: 0.75em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.625em;
  }
`;

export const MsgWrapper = styled.div`
  display: flex;
`;

export const FinalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  gap: 1.875em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    gap: 0.875em;
  }
`;

export const Wrap5 = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25em;
`;