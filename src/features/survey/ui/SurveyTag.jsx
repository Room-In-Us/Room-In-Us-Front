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
  border-radius: 1.5em;
  padding: 0.875em 1em;
  box-sizing: border-box;
  display: flex;
  height: 2.0625em;
  justify-content: center;
  align-items: center;
  gap: 0.625em;
  font-family: 'Pretendard-Regular';
  font-size: 0.875em;
  font-weight: 400;
  line-height: 1.25em;
  letter-spacing: -0.02188em;
  cursor: pointer;
  background-color: ${({ selected }) => selected ? '#718FF2' : 'transparent'};
  color: ${({ selected }) => selected ? '#F9F9FB' : '#718FF2'};
  pointer-events: ${({ disabled }) => disabled ? 'none' : 'auto'};
  opacity: ${({ disabled }) => disabled ? 0.4 : 1};
  transition: all 0.1s ease-in-out;
`;
