import { useState, useEffect } from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import PropTypes from 'prop-types';
import { themeState, themeVisible } from "../../recoil/atoms/locationAtom";
import { useNavigate } from "react-router-dom";
import { getThemeInfoAPI } from "../../apis/theme/getThemeInfoAPI";
import NoAvailableImg from "../../assets/images/locationPage/noImageAvailable.webp";

function ThemeInfo({ themeId }) {
    // state 관리
    const [themeInfo, setThemeInfo] = useState({});
    const [, setIsThemeState] = useRecoilState(themeState);
    const [, setIsThemeVisible] = useRecoilState(themeVisible);
    
    // 테마 정보 불러오기
    useEffect(() => {
        const fetchThemeInfo = async () => {
            try {
                const response = await getThemeInfoAPI(themeId);
                console.log('받은 데이터:', response);
                setThemeInfo(response.data);
            } catch (error) {
                console.error('테마 목록 데이터를 불러오는 중 오류 발생:', error);
            }
        };
        fetchThemeInfo();
    }, [themeId]);

    // themeInfo가 유효하지 않으면 로딩 중 표시
    // if (!themeInfo) {
    //     return <ComponentWrapper>Loading...</ComponentWrapper>;
    // }

    // navigate
    const navigate = useNavigate();
    
    // 테마 선택 함수
    const handleThemeState = (theme) => {
        setIsThemeState(theme);
        setIsThemeVisible(false);
        navigate("/");
        alert("예약 페이지는 구현 중입니다");
    };

    return (
        <ComponentWrapper>
            <TopWrapper>
                <ThemeImg src={themeInfo.themeImg || NoAvailableImg} alt="Theme Image"/>
                <TitleWrapper>
                    <TagWrapper>
                        <Tag>{themeInfo.level}</Tag>
                        {themeInfo.genreList && themeInfo.genreList.map((genre, index) => (
                            <Tag key={index}>{genre}</Tag>
                        ))}
                        <Tag>{themeInfo.playTime}분</Tag>
                    </TagWrapper>
                    <Title>
                        {themeInfo.theme}
                    </Title>
                </TitleWrapper>
                <ReservationButton onClick={() => handleThemeState(themeInfo.themeId)}>
                    예약하기
                </ReservationButton>
            </TopWrapper>
            <Synopsis>
                {themeInfo.synopsis || '제공되는 줄거리가 없습니다.'}
            </Synopsis>
        </ComponentWrapper>
    )
};

// prop 유효성 검사
ThemeInfo.propTypes = {
    themeId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
};

export default ThemeInfo;

// CSS
const ComponentWrapper = styled.div`
    padding: 0.7em;
    box-sizing: border-box;
    margin-bottom: 0.5em;
    border-radius: 5px;
    width: 100%;
    min-height: 6.4em;
    background-color: #3b3b3b;
    font-family: 'esamanru-medium';
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const TopWrapper = styled.div`
    height: 3em;
    display: flex;
    justify-content: space-between;
    align-items: end;

    // height: 2.5em;
    // display: flex;
    // justify-content: space-between;
    // align-items: end;
`;

const ThemeImg = styled.img`
    border-radius: 0.2em;
    width: 4em;
    height: 100%;
`;

const TitleWrapper = styled.div`
    width: 10.5em;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: white;
`;

const TagWrapper = styled.div`
    display: flex;
    gap: 0.3em;
`;

const Tag = styled.div`
    padding: 0.2em 1em;
    border-radius: 3em;
    background-color: #c8c8c8;
    color: black;
    font-size: 0.4em;
`;

const Title = styled.div`
    font-size: 1.2em;
    font-family: 'esamanru-Medium';
    // 말줄임표
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: break-all;
`;

const ReservationButton = styled.button`
    border: none;
    border-radius: 0.3em;
    width: 7.5em;
    height: 2.5em;
    line-height: 2.5em;
    background-color: #940000;
    color: white;
    font-size: 0.7em;
    box-shadow: inset 0 3px 1px 1px #7F0000;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
        background-color: #830000;
        box-shadow: inset 0 3px 1px 1px #770000;
    }
`;

const Synopsis = styled.div`
    height: 2.7em;
    color: white;
    font-size: 0.5em;
    font-family: 'esamanru-light';
    // 말줄임 표시
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;

    // height: 4.3em;
    // color: white;
    // font-size: 0.5em;
    // font-family: 'esamanru-light';
    // // 말줄임 표시
    // text-overflow: ellipsis;
    // overflow: hidden;
    // word-break: break-word;
    // display: -webkit-box;
    // -webkit-line-clamp: 3;
    // -webkit-box-orient: vertical;
`;
