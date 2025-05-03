import styled from "styled-components";

function ReviewWriteModal() {

  return (
    <ModalWrapper>
    </ModalWrapper>
  )
}

export default ReviewWriteModal;

// CSS
const ModalWrapper = styled.div`
font-size: 0.8rem; // 임의로 지정
  border-radius: 0.625em;
  padding: 1.25em 1.875em;
  width: 40em;
  height: 43.75em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: var(--RIU_Monochrome-10, #F9F9FB);
`;
