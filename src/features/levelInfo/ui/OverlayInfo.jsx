import styled from "styled-components";

export default function Overlay({ level, playTime, genre }) {
  return (
      <OverlayInfo className="overlay">
        <CircleWrapper>
          <CircleTag>난이도</CircleTag>
          <Circle>
            <OverlayText>{level}</OverlayText>
          </Circle>
        </CircleWrapper>
        <CircleWrapper>
          <CircleTag>플레이타임</CircleTag>
          <Circle>
            <OverlayText>{playTime}분</OverlayText>
          </Circle>
        </CircleWrapper>
        <CircleWrapper>
          <CircleTag>장르</CircleTag>
          <Circle>
            <OverlayText>{genre}</OverlayText>
          </Circle>
        </CircleWrapper>
      </OverlayInfo>
  )
}

const OverlayInfo = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 0.625em;
  background: rgba(0, 0, 0, 0.6); // 반투명 배경
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  opacity: 0; // 기본적으로 보이지 않음
  transition: opacity 0.3s ease; // 부드러운 전환 효과
  gap: 1em;
`;

const CircleTag = styled.div`
  font-family: 'esamanru-Light';
  color: #fff;
  font-size: 0.5em;
`;

const CircleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1em;
  word-break: keep-all;
  white-space: normal;
`;

const Circle = styled.div`
  width: 3.5em;
  height: 3.5em;
  // padding: 0.5em;
  border-radius: 50%;
  background: #383838;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const OverlayText = styled.div`
  font-family: 'esamanru-Light';
  font-size: 0.8em;
  width: 100%;
  height: 2.5em;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  // word-break: break-word;
  // white-space: normal;
  color: #fff;
`;