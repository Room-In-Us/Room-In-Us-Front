import styled, { css } from "styled-components"
import Caution from '../assets/icons/common/cautionIcon.svg?react';
import Cancel from '../assets/icons/common/cancelIconColor.svg?react';
import { createPortal } from "react-dom";

export default function PopUpModal({
  isOpen,
  title = "알림",
  message,
  subMessage,
  messageList,
  onConfirm,
  onCancel,
  confirmText = "확인",
  cancelText = "취소",
  showCancel = true,
}) {
  if (!isOpen) return null;

  // subMessage가 줄바꿈으로 구분된 문자열인 경우 배열로 변환
  const displayList = messageList || (subMessage && subMessage.includes('\n') ? subMessage.split('\n') : null);

  const modalNode = (
    <Backdrop onClick={(e) => e.stopPropagation()}>
      <Wrapper $hasList={!!displayList}>
        <PopUpHeader>
          <PopUpNameWrapper>
            <CautionIcon />
            <PopUpName>{title}</PopUpName>
          </PopUpNameWrapper>
          <CancelIcon onClick={onCancel} />
        </PopUpHeader>
        <PopUpBox>
          <PopUpContentBox>
            <PopUpTitle>{message}</PopUpTitle>
            {displayList ? (
              <PopUpList>
                {displayList.map((item, index) => (
                  <PopUpListItem key={index}>{item}</PopUpListItem>
                ))}
              </PopUpList>
            ) : (
              <PopUpDetail>{subMessage}</PopUpDetail>
            )}
          </PopUpContentBox>
          <PopUpBtnWrapper>
            {showCancel && (
              <PopUpBtn mode='cancel' onClick={onCancel}>
                <BtnText mode='cancel'>{cancelText}</BtnText>
              </PopUpBtn>
            )}
            <PopUpBtn mode='confirm' onClick={onConfirm}>
              <BtnText mode='confirm'>{confirmText}</BtnText>
            </PopUpBtn>
          </PopUpBtnWrapper>
        </PopUpBox>
      </Wrapper>
    </Backdrop>
  )

  // 포탈로 body에 직접 렌더링
  return createPortal(modalNode, document.body);
}

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  cursor: default;
`;

const Wrapper = styled.div`
  width: 25rem;
  height: ${({ $hasList }) => $hasList ? 'auto' : '16.44rem'};
  min-height: 16.44rem;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.625rem;
  background: var(--RIU_Monochrome-10, #F9F9FB);

  @media (max-width: 768px) {
    width: 18.75rem;
    height: ${({ $hasList }) => $hasList ? 'auto' : '15.81rem'};
    min-height: 15.81rem;
  }
`;

const PopUpHeader = styled.div`
  width: 100%;
  display: flex;
  padding: 0.625rem;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--RIU_Monochrome-30, #E7E8ED);
  box-sizing: border-box;
`;

const PopUpNameWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
`;

const PopUpName =  styled.div`
  color: var(--RIU_Monochrome-100, #818496);
  text-align: center;
  font-family: Pretendard-Bold;
  font-size: 0.875rem;
`;

const CautionIcon = styled(Caution)`
  display: flex;
  width: 1.25rem;
  height: 1.25rem;
  justify-content: center;
  align-items: center;
`;

const CancelIcon = styled(Cancel)`
  display: flex;
  width: 1.25rem;
  height: 1.25rem;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const PopUpBox = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  padding: 1.875rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.875rem;
  box-sizing: border-box;
`;

const PopUpContentBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
`;

const PopUpTitle = styled.div`
  color: var(--RIU_Primary-100, #718FF2);
  text-align: center;
  font-family: Pretendard-Bold;
  font-size: 1.25rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const PopUpDetail = styled.div`
  color: var(--RIU_Monochrome-100, #818496);
  text-align: center;
  font-family: Pretendard-Medium;
  font-size: 0.875rem;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const PopUpList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-sizing: border-box;

  @media (max-width: 768px) {
    gap: 0.25rem;
  }
`;

const PopUpListItem = styled.div`
  color: var(--RIU_Monochrome-100, #818496);
  font-family: Pretendard-Medium;
  font-size: 0.875rem;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const PopUpBtnWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  align-self: stretch;
`;

const PopUpBtn = styled.div`
  display: flex;
  height: 3.125rem;
  padding: 0.875rem 0;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  flex: 1 0 0;
  border-radius: 2.5rem;
  box-sizing: border-box;
  cursor: pointer;

  ${({ mode }) =>
    mode === "cancel" &&
    css`
      background: var(--RIU_Monochrome-70, #B3B6C3);
    `}
  ${({ mode }) =>
    mode === "confirm" &&
    css`
      background: var(--RIU_Primary-100, #718FF2);
    `}

  @media (max-width: 768px) {
    height: 2.5rem;
  }
`;

const BtnText = styled.div`
  font-family: Pretendard-Bold;
  font-size: 1rem;

  ${({ mode }) =>
    mode === "cancel" &&
    css`
      color: var(--RIU_Monochrome-300, #696C7E);
    `}
  ${({ mode }) =>
    mode === "confirm" &&
    css`
      color: var(--RIU_Monochrome-300, #F9F9FB);
    `}

  @media (max-width: 768px) {
    font-size: 0.875rem;   
  }
`;