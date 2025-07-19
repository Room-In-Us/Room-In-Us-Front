import styled from "styled-components";
import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import CloseIcon from "../../../shared/assets/icons/reviewWrite/closeicon.svg";
import UserIcon from "../../../shared/assets/icons/userInfo/userIcon.svg";
import { userInfoModalState, userInfoIdState, userInfoNameState } from "../model/authAtom.jsx";
import { getUserInfoAPI } from "../api/memberAPI.js";
import ProficiencySection from "./preferences/ProficiencySection";
import GenreSection from "./preferences/GenreSection";
import HeadcountSection from "./preferences/HeadcountSection";
import PreferenceSection from "./preferences/PreferenceSection";
import PositionSection from "./preferences/PositionSection";
import InfoSection from "./preferences/InfoSection.jsx";
import NoDataIcon from "../../../shared/assets/images/common/noData/noDataImageLarge.png";

function UserInfoModal() {
  // 상태 관리
  const setModalOpen = useSetRecoilState(userInfoModalState);
  const userId = useRecoilValue(userInfoIdState);
  const userName = useRecoilValue(userInfoNameState);
  const [userInfoList, setUserInfoList] = useState(null);

  // 모달 닫기 핸들러
  const handleClose = () => {
    setModalOpen(false);
  };

  // 유저 정보 호출
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const data = await getUserInfoAPI(userId);
        setUserInfoList({
          proficiency: data.proficiency,
          preferredGenreList: data.preferredGenreList,
          preferredHeadcount: data.preferredHeadcount,
          preferredElementList: data.preferredElementList,
          preferredActivity: data.preferredActivity,
          preferredDevice: data.preferredDevice,
          horrorPos: data.horrorPos,
          preference: data.preference,
        });
      } catch (error) {
        console.error("유저 정보 로딩 실패:", error);
      }
    };

    fetchPreferences();
  }, [userId]);

  return (
    <ModalWrapper>
      {/* 헤더 영역 */}
      <ModalHeader>
        <Wrap>
          <Btn src={UserIcon} />
          <ModalTitle>{userName}님의 정보</ModalTitle>
        </Wrap>
        <StyledCloseIcon src={CloseIcon} onClick={handleClose} />
      </ModalHeader>

      <ContentWrapper>
        {/* 타이틀 */}
        <TitleWrapper>
          <TitleNickName>{userName}</TitleNickName>
          <TitleDescription>님의 방탈출 취향</TitleDescription>
        </TitleWrapper>

        {userInfoList && Object.values(userInfoList).some((value) => {
          if (Array.isArray(value)) return value.length > 0;
          return !!value;
        }) ? (
          <>
            {/* 숙련도 섹션 */}
            <ProficiencySection userInfo={userInfoList?.proficiency} />

            {/* 장르 섹션 */}
            <GenreSection userInfo={userInfoList?.preferredGenreList} />

            {/* 인원 섹션 */}
            <HeadcountSection userInfo={userInfoList?.preferredHeadcount} />

            {/* 취향 섹션 */}
            <PreferenceSection
              elementInfo={userInfoList?.preferredElementList}
              deviceInfo={userInfoList?.preferredDevice}
              activityInfo={userInfoList?.preferredActivity}
            />

            {/* 포지션 섹션 */}
            <PositionSection userInfo={userInfoList?.horrorPos} />

            {/* 추가정보 섹션 */}
            <InfoSection userInfo={userInfoList?.preference} />
          </>
        ): (
          <NoDataWrapper>
            <StyledNoDataIcon src={NoDataIcon}/>
            <NoDataText>
              작성한 방탈출 취향<br/>정보가 없습니다
            </NoDataText>
          </NoDataWrapper>
        )}

        {/* 버튼 영역 */}
        <CloseBtn onClick={handleClose}>
          <CloseBtnText>닫기</CloseBtnText>
        </CloseBtn>
      </ContentWrapper>

    </ModalWrapper>
  )
}

export default UserInfoModal;

// CSS
const ModalWrapper = styled.div`
font-size: 0.8rem; // 임의로 지정
  border-radius: 0.625em;
  width: 40em;
  height: 43.75em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: var(--RIU_Monochrome-10, #F9F9FB);

  @media (max-width: 768px) {
    width: 22.1875em;
    height: 22.5em;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.625em;
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid var(--RIU_Monochrome-30, #E7E8ED);
`;

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.625em;
`;

const ModalTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  
  color: var(--RIU_Monochrome-100, #818496);
  font-family: Pretendard-Bold;
  font-size: 0.875em;
`;

const Btn = styled.img`
  width: 1.25em;
  height: 1.25em;
`;

const StyledCloseIcon = styled.img`
  width: 1.25em;
  height: 1.25em;
  cursor: pointer;
`;

const CloseBtn = styled.div`
  display: flex;
  width: 100%;
  height: 3.125em;
  padding: 0.875em 0em;
  justify-content: center;
  align-items: center;
  border-radius: 2.5em;
  background: var(--RIU_Primary-0, #E8EAFF);
  box-sizing: border-box;
  cursor: pointer;

  @media (max-width: 768px) {
    height: 2.5em;
  }
`;

const CloseBtnText = styled.div`
  color: var(--RIU_Primary-100, #718FF2);
  font-family: Pretendard-Bold;
  font-size: 1em;

  @media (max-width: 768px) {
    font-size: 0.875em;
  }
`;

const ContentWrapper = styled.div`
  padding: 1.25em 1.88em;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 1.25em;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background: none;
  }
  &:hover::-webkit-scrollbar-thumb {
    border-radius: 30px;
    background-color: #8DA3FF;
  }

  @media (max-width: 768px) {
    padding: 1.25em;
  }
`;

const TitleWrapper = styled.div`
  border-bottom: 1px solid var(--RIU_Monochrome-60, #C4C6D1);
  padding-bottom: 0.625em;
  display: flex;
  align-items: flex-end;
  gap: 0.625em;
  align-self: stretch;
`;

const TitleNickName = styled.div`
  color: var(--RIU_Primary-500, #4648A7);
  font-family: 'Pretendard-ExtraBold';
  font-size: 1.375em;
  line-height: normal;

  @media (max-width: 768px) {
    font-size: 1em;
  }
`;

const TitleDescription = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: 'Pretendard-SemiBold';
  font-size: 0.875em;
  line-height: 140%;

  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;

const NoDataWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.625em;
  align-self: stretch;

  @media (max-width: 768px) {
    gap: 0;
  }
`;

const StyledNoDataIcon = styled.img`
  width: 11.25em;
  height: 11.25em;

  @media (max-width: 768px) {
    width: 6.25em;
    height: 6.25em;
  }
`;

const NoDataText = styled.div`
  color: var(--RIU_Monochrome-90, #9192A5);
  text-align: center;
  font-family: 'Pretendard-Medium';
  font-size: 0.75em;
  line-height: 150%;

  @media (max-width: 768px) {
    font-size: 0.6875em;
  }
`;