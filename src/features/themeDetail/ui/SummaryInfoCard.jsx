import styled from "styled-components";
import PropTypes from 'prop-types';

function SummaryInfoCard({ icon, type, value }) {
  return (
    <CardWrapper>
      <TitleWrapper>
        {icon}
        <TypeText>
          {type}
        </TypeText>
      </TitleWrapper>
      <ValueWrapper>
        <ValueText>
          {value}
        </ValueText>
      </ValueWrapper>
    </CardWrapper>
  )
}

// PropTypes 정의 (eslint 에러 방지)
SummaryInfoCard.propTypes = {
  icon: PropTypes.node.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default SummaryInfoCard;

// CSS
const CardWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    flex-direction: row;
  }
`;

const TitleWrapper = styled.div`
  border-radius: 0.625rem 0.625rem 0 0;
  height: 5.625rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  align-self: stretch;
  background: var(--RIU_Monochrome-20, #F0F0F4);

  @media (max-width: 768px) {
    border-radius: 0.625rem 0 0 0.625rem;
    padding: 0rem 1.25rem;
    box-sizing: border-box;
    width: 100%;
    height: 2.25rem;
    flex-direction: row;
    justify-content: start;
  }
`;

const TypeText = styled.div`
  color: var(--RIU_Primary-200, #6680DF);
  text-align: center;
  font-family: 'Pretendard-Bold';
  font-size: 0.875rem;
  line-height: normal;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const ValueWrapper =  styled.div`
  border-radius: 0 0 0.625rem 0.625rem;
  padding: 0.625rem 1.25rem;
  box-sizing: border-box;
  height: 2.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  background: var(--RIU_Primary-200, #6680DF);

  @media (max-width: 768px) {
    border-radius: 0 0.625rem 0.625rem 0;
    width: 6.4375rem;
  }
`;

const ValueText = styled.div`
  color: var(--RIU_Monochrome-20, #F0F0F4);
  text-align: center;
  font-family: 'Pretendard-Bold';
  font-size: 0.875rem;
  line-height: normal;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;