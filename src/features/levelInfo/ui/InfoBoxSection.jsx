import styled from "styled-components"
import InfoBoxItem from "./InfoBoxItem";
import { roomData } from "../model/RoomList";
import Down from '../../../shared/assets/icons/level/down.svg'

export default function InfoBoxSection() {
  return (
    <Wrapper>
      <SortBox>
        <SortText>정렬 순</SortText>
        <DropDownIcon src={Down} />
      </SortBox>
      <InfoBoxWrapper>
        {roomData.map((room) => (
        <InfoBoxItem key={room.id} room={room} />
        ))}
      </InfoBoxWrapper>
    </Wrapper>
  )
};

const Wrapper = styled.div`
  width: 75%;
  height: 100%;
  display: flex;
  align-items: end;
  justify-content: center;
  flex-direction: column;
  gap: 1.25em;
`;

const SortBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #d9d9d9;
  gap: 0.625em;
  padding: 0em 0.5em;
  border-radius: 1em;
`;

const SortText = styled.div`
  font-family: Pretendard-Medium;
`;

const DropDownIcon = styled.img`

`;

const InfoBoxWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 1.25em;
`;
