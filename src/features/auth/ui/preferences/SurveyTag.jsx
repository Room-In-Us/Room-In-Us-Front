import styled from "styled-components";
import PropTypes from 'prop-types';

function SurveyTag({ item, selected, onClick, disabled }) {
  return (
    <TagWrapper onClick={!disabled ? onClick : undefined} selected={selected}>
      {item}
    </TagWrapper>
  )
}

// PropTypes 정의 (eslint 에러 방지)
SurveyTag.propTypes = {
  item: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default SurveyTag;

// CSS
const TagWrapper = styled.div`
  border: 1px solid var(--RIU_Primary-100, #718FF2);
  border-radius: 1.5rem;
  padding: 0.875rem 1rem;
  box-sizing: border-box;
  height: 2.0625rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  background-color: ${({ selected }) => selected ? '#718FF2' : 'var(--RIU_Monochrome-10, #F9F9FB)'};
  color: ${({ selected }) => selected ? '#F9F9FB' : '#718FF2'};
  font-family: 'Pretendard-Regular';
  font-size: 0.875rem;
  line-height: 1.25rem;
  letter-spacing: -0.02188rem;
  transition: all 0.1s ease-in-out;
  pointer-events: ${({ disabled }) => disabled ? 'none' : 'auto'};
  opacity: ${({ disabled }) => disabled ? 0.4 : 1};
`;
