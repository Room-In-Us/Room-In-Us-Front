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
`;

const TypeText = styled.div`
  color: var(--RIU_Primary-200, #6680DF);
  text-align: center;
  font-family: 'Pretendard-Bold';
  font-size: 0.875rem;
  line-height: normal;
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
`;

const ValueText = styled.div`
  color: var(--RIU_Monochrome-20, #F0F0F4);
  text-align: center;
  font-family: 'Pretendard-Bold';
  font-size: 0.875rem;
  line-height: normal;
`;