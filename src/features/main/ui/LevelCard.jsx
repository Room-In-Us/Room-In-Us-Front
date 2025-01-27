import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

function LevelCard({ name }) {
  const navigate = useNavigate();

  return (
    <ItemWrapper onClick={() => navigate('/level')}>
      {name}
    </ItemWrapper>
  )
}

// PropTypes 정의 (eslint 에러 방지)
LevelCard.propTypes = {
  name: PropTypes.string.isRequired,
};

export default LevelCard;

// CSS
const ItemWrapper = styled.div`
  width: 16rem;
  height: 10rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: lightgray;
  cursor: pointer;
`;