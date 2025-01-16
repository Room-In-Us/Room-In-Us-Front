import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

function SignupModal({ isOpen }) {
  const navigate = useNavigate();

  return (
    <ContentWrapper isOpen={isOpen}>
      <ModalWrapper>
        <h2>회원가입 완료</h2>
        <p>
          방탈출 성향을 입력하시겠습니까?
          <br />
          입력한 정보는 추천에 활용될 수 있어요.
          <br />
          지금 입력하지 않더라도 나중에 마이페이지에서 설정이 가능합니다.
        </p>
        <ButtonWrapper>
          <StyledButton onClick={() => navigate('/')}>다음에 할게요</StyledButton>
          <StyledButton onClick={() => navigate('/userInfo')}>입력하기</StyledButton>
        </ButtonWrapper>
      </ModalWrapper>
    </ContentWrapper>
  );
}

// PropTypes 정의 (eslint 에러 방지)
SignupModal.propTypes = {
  isOpen: PropTypes.bool.isRequired, // isOpen은 boolean이며 필수 prop
};

export default SignupModal;

// CSS
const ContentWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
`;

const ModalWrapper = styled.div`
  padding: 2.5em;
  box-sizing: border-box;
  border-radius: 10px;
  width: 24em;
  height: 15em;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ButtonWrapper = styled.div``;

const StyledButton = styled.button`
  margin: 1em;
  width: 8em;
  height: 2em;
  cursor: pointer;
`;
