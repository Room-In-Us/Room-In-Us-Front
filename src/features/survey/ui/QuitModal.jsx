import styled from "styled-components";
import CautionIcon from '../../../shared/assets/icons/survey/modalCautionIcon.svg?react';
import CancelIcon from '../../../shared/assets/icons/survey/modalCancelIcon.svg?react';
import { useNavigate } from "react-router-dom";
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { surveySectionState, surveyState, modalState } from "../model/surveyAtom";
import { patchPreferencesAPI } from "../api/surveyAPI";

function QuitModal() {
  // 상태 관리
  const [, setSurveySection] = useRecoilState(surveySectionState);
  const resetSurvey = useResetRecoilState(surveyState);
  const [survey] = useRecoilState(surveyState);
  const setModal = useSetRecoilState(modalState);

  const navigate = useNavigate();

  // 성향조사 제출 핸들러
  const handleSubmitSurvey = async () => {
    try {
      const payload = {
        proficiency: survey.proficiency,
        preferredGenreList: survey.preferredGenreList,
        preferredHeadcount: survey.preferredHeadcount,
        preferredElementList: survey.preferredElementList,
        preferredActivity: survey.preferredActivity,
        preferredDevice: survey.preferredDevice,
        horrorPos: survey.horrorPos,
        preference: survey.preference,
      };

      console.log("성향조사 제출 결과: ", payload);
      const response = await patchPreferencesAPI(payload);
      console.log("성향조사 제출 결과: ", response);
      setSurveySection("proficiency");
      resetSurvey();
      setModal(false);
      navigate('/');
    } catch (error) {
      console.error("성향조사 제출 중 오류 발생:", error);
    }
  };

  return (
    <ModalWrapper>
      <HeaderWrapper>
        <CautionWrapper>
          <StyledCautionIcon/>
          <CautionText>경고</CautionText>
        </CautionWrapper>
        <StyeldCancelIcon onClick={() => setModal(false)}/>
      </HeaderWrapper>

      <ContentWrapper>
        <TextWrapper>
          <Title>성향조사를 그만두시겠어요?</Title>
          <Description>
            지금까지 입력한 성향 정보의<br/>
            저장 여부를 선택하실 수 있습니다.
          </Description>
        </TextWrapper>
        <ButtonWrapper>
          <StyledButton onClick={() => {
              resetSurvey();
              setModal(false);
              navigate('/');
            }} isCancel={true}>
            <ButtonText isCancel={true}>저장하지 않을래요</ButtonText>
          </StyledButton>
          <StyledButton onClick={handleSubmitSurvey} isCancel={false}>
            <ButtonText isCancel={false}>저장할래요</ButtonText>
          </StyledButton>
        </ButtonWrapper>
      </ContentWrapper>
    </ModalWrapper>
  )
}

export default QuitModal;

// CSS
const ModalWrapper = styled.div`
  border-radius: 0.625rem;
  width: 31.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--RIU_Monochrome-10, #F9F9FB);

  @media (max-width: 768px) {
    width: 17.875rem;
  }
`;

const HeaderWrapper = styled.div`
  border-bottom: 1px solid var(--RIU_Monochrome-30, #E7E8ED);
  display: flex;
  padding: 0.625rem;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;

const CautionWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 0.625rem;
`;

const StyledCautionIcon = styled(CautionIcon)`
  width: 1.25rem;
  height: 1.25rem;
`;

const CautionText = styled.div`
  color: var(--RIU_Monochrome-100, #818496);
  text-align: center;
  font-family: 'Pretendard-Bold';
  font-size: 0.875rem;
  line-height: 150%;
`;

const StyeldCancelIcon = styled(CancelIcon)`
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
`;

const ContentWrapper = styled.div`
  padding: 1.875rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  gap: 1.875rem;
`;

const TextWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
`;

const Title = styled.div`
  color: var(--RIU_Primary-200, #6680DF);
  text-align: center;
  font-family: 'Pretendard-Bold';
  font-size: 1.125rem;
  line-height: 150%;
`;

const Description = styled.div`
  color: var(--RIU_Monochrome-100, #818496);
  text-align: center;
  font-family: 'Pretendard-Medium';
  font-size: 0.75rem;
  line-height: 150%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  align-self: stretch;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.625rem;
  }
`;

const StyledButton = styled.button`
  all: unset;
  border: none;
  border-radius: 2.5rem;
  display: flex;
  width: 13.125rem;
  height: 3.125rem;
  padding: 0.875rem 0rem;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  background: ${(props) =>
  (props.isCancel)
      ? "var(--RIU_Monochrome-40, #DFDFE6)"
      : "var(--RIU_Primary-Gradient-02, linear-gradient(282deg, #5B6ACC 0%, #718FF2 100%))"};
  cursor: pointer;
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
    opacity: ${(props) => (props.isCancel ? "0.2" : "0.5")};
  }

  @media (max-width: 768px) {
    height: 2.5rem;
  }
`;

const ButtonText = styled.div`
  color: ${(props) => (props.isCancel ? "var(--RIU_Monochrome-100, #818496)" : "#F9F9FB")};
  font-family: 'Pretendard-Bold';
  font-size: 1rem;
  line-height: 130%;
  transition: all 0.2s ease-in-out;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;
