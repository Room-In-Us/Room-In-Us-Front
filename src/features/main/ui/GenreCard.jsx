import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

function GenreCard({ name }) {
  const navigate = useNavigate();

  return (
    <ItemWrapper onClick={() => navigate('/genre')}>
      {name}
    </ItemWrapper>
  )
}

// PropTypes 정의 (eslint 에러 방지)
GenreCard.propTypes = {
  name: PropTypes.string.isRequired,
};

export default GenreCard;

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