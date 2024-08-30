import styled from "styled-components";
import LogoImg from "../../assets/images/common/logo.png";
import { useNavigate } from "react-router-dom";

function Header() {
    // navigate
    const navigate = useNavigate();
    
    return (
        <HeadrWrapper>
            <StyledLogoImg src={LogoImg} alt="logo image" onClick={() => navigate("/")}/>
            <ButtonWrapper>
                <Button onClick={() => navigate("/")}>홈</Button>
                <Button onClick={() => navigate("/board")}>게시판</Button>
                <Button onClick={() => navigate("/mypage")}>마이페이지</Button>
                <Button onClick={() => navigate("/login")}>로그인</Button>
            </ButtonWrapper>
        </HeadrWrapper>
    )
}

export default Header;

// CSS
const HeadrWrapper = styled.div`
    padding: 0 3em;
    height: 125px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const StyledLogoImg = styled.img`
    height: 5.3125em;
    cursor: pointer;
`;

const ButtonWrapper = styled.div`
    height: 5.3125em;
    line-height: 5.3125em;
    display: flex;
`;

const Button = styled.div`
    margin-left: 4em;
    color: white;
    font-size: 1.375em;
    cursor: pointer;
`;