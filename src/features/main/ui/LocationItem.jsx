import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

function LocationItem({ name }) {
  const navigate = useNavigate();

  return (
    <ItemWrapper onClick={() => navigate('/location')}>
      {name}
    </ItemWrapper>
  )
}

// PropTypes 정의 (eslint 에러 방지)
LocationItem.propTypes = {
  name: PropTypes.string.isRequired,
};

export default LocationItem;

// CSS
const ItemWrapper = styled.div`
  border-radius: 50px;
  width: 5rem;
  height: 5rem;
  line-height: 5rem;
  text-align: center;
  background-color: lightgray;
  cursor: pointer;
`;