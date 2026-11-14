import { useState, useEffect, useLayoutEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import LogoIcon from '../../shared/assets/icons/common/logo.svg?react';
import UpdateIcon from '../../shared/assets/icons/myPage/updateIcon.svg?react';
import ArrowIcon from '../../shared/assets/icons/common/arrow/rightArrow.svg?react';
import { getMemberInfoAPI } from "../../features/auth/api/memberAPI";
import { patchNicknameAPI } from "../../features/mypage/api/nicknameAPI";
import CancelIcon from '../../shared/assets/icons/common/cancelIcon.svg?react';
import CheckIcon from '../../shared/assets/icons/myPage/checkIcon.svg?react';

type NicknameUpdate = { generation: number; viewGeneration: number; editGeneration: number; nickname: string };

function MyPage() {
  // 상태 관리
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [editState, setEditState] = useState(false);
  const [prevNickname, setPrevNickname] = useState('');
  const [errorState, setErrorState] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const mountedProfile = useRef(false);
  const viewGeneration = useRef(0);
  const editGeneration = useRef(0);
  const updateGeneration = useRef(0);
  const savedNicknameGeneration = useRef(0);
  const currentNickname = useRef(nickname);
  const confirmedNickname = useRef<string | null>(null);
  const editingNickname = useRef(false);
  const pendingUpdate = useRef<NicknameUpdate | null>(null);
  const errorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigate = useNavigate();

  const clearErrorTimer = () => {
    if (errorTimer.current !== null) {
      clearTimeout(errorTimer.current);
      errorTimer.current = null;
    }
  };

  useLayoutEffect(() => {
    mountedProfile.current = true;
    viewGeneration.current += 1;
    return () => {
      mountedProfile.current = false;
      viewGeneration.current += 1;
      editGeneration.current += 1;
      pendingUpdate.current = null;
      if (errorTimer.current !== null) {
        clearTimeout(errorTimer.current);
        errorTimer.current = null;
      }
    };
  }, []);

  // 닉네임 가져오기 (로그인 상태일 때만 실행)
  useEffect(() => {
    let active = true;
    const generation = viewGeneration.current;
    const initialSavedGeneration = savedNicknameGeneration.current;
    const isCurrent = () => active && mountedProfile.current && viewGeneration.current === generation;
    const fetchNickname = async () => {
      try {
        const response = await getMemberInfoAPI();
        if (!isCurrent()) return;
        setEmail(response.email);
        // 수정 성공보다 오래된 조회로 저장값을 되돌리지 않는다. 편집 중이면
        // 입력 대신 취소 시 복원할 서버 닉네임만 기록한다.
        if (savedNicknameGeneration.current === initialSavedGeneration) {
          confirmedNickname.current = response.nickname;
          if (editingNickname.current) setPrevNickname(response.nickname);
          else {
            currentNickname.current = response.nickname;
            setNickname(response.nickname);
          }
        }
      } catch (error) {
        if (!isCurrent()) return;
        console.error("닉네임 불러오는 중 오류 발생:", error);
      }
    };
    fetchNickname();
    return () => { active = false; };
  }, []);

  const beginNicknameEdit = () => {
    if (!mountedProfile.current) return;
    editGeneration.current += 1;
    pendingUpdate.current = null;
    editingNickname.current = true;
    clearErrorTimer();
    setErrorState(false);
    setPrevNickname(currentNickname.current);
    setEditState(true);
  };

  const cancelNicknameEdit = () => {
    if (!mountedProfile.current) return;
    editGeneration.current += 1;
    pendingUpdate.current = null;
    editingNickname.current = false;
    clearErrorTimer();
    setErrorState(false);
    currentNickname.current = confirmedNickname.current ?? prevNickname;
    setNickname(currentNickname.current);
    setEditState(false);
  };

  // 닉네임 수정하기
  const handleNicknameUpdate = async () => {
    if (!mountedProfile.current || !editingNickname.current || pendingUpdate.current !== null) return;
    const operation: NicknameUpdate = {
      generation: ++updateGeneration.current,
      viewGeneration: viewGeneration.current,
      editGeneration: editGeneration.current,
      nickname: currentNickname.current,
    };
    pendingUpdate.current = operation;
    clearErrorTimer();
    setErrorState(false);
    const isCurrent = () => mountedProfile.current && editingNickname.current && pendingUpdate.current === operation
      && viewGeneration.current === operation.viewGeneration && editGeneration.current === operation.editGeneration
      && updateGeneration.current === operation.generation && currentNickname.current === operation.nickname;
    try {
      const response = await patchNicknameAPI(operation.nickname);
      if (!isCurrent()) return;
      console.log("닉네임 수정 결과: ", response);
      savedNicknameGeneration.current += 1;
      confirmedNickname.current = operation.nickname;
      editingNickname.current = false;
      setEditState(false);
    } catch (error) {
      if (!isCurrent()) return;
      console.error("닉네임 수정 중 오류 발생:", error);

      const response = error != null && typeof error === 'object' && 'response' in error ? error.response : undefined;
      if (response != null && typeof response === 'object' && 'status' in response && response.status === 409) {
        setErrorMessage("이미 존재하는 닉네임입니다.");
      } else {
        setErrorMessage("닉네임 수정 중 오류가 발생했습니다.");
      }

      setErrorState(true);

      errorTimer.current = setTimeout(() => {
        if (mountedProfile.current && viewGeneration.current === operation.viewGeneration
          && editGeneration.current === operation.editGeneration && updateGeneration.current === operation.generation) {
          setErrorState(false);
          errorTimer.current = null;
        }
      }, 2000);
    } finally {
      if (pendingUpdate.current === operation) pendingUpdate.current = null;
    }
  };
  
  return (
    <PageWrapper>
      <ContentWrapper>
        {/* 계정 정보 영역 */}
        <InfoWrapper>
          <StyledLogoIcon/>
          <EmailWrapper>
            { editState ?
              <NicknameInput
                maxLength={10}
                value={nickname}
                onChange={(e) => {
                  const value = e.target.value.slice(0, 10);
                  if (currentNickname.current !== value) {
                    editGeneration.current += 1;
                    pendingUpdate.current = null;
                    currentNickname.current = value;
                    clearErrorTimer();
                    setErrorState(false);
                  }
                  setNickname(value);
                }}
              />
              :
              <Nickname>
                {nickname}
              </Nickname>
            }
            <Email>
              {email}
            </Email>
            { editState ?
              <NicknameUpdateButton>
                <StyledCancelIcon onClick={cancelNicknameEdit} />
                <StyledCheckIcon onClick={handleNicknameUpdate} />
              </NicknameUpdateButton>
              :
              <StyledUpdateIcon
                onClick={beginNicknameEdit}
              />
            }
            <ErrorText errorState={errorState}>
              {errorMessage}
            </ErrorText>
          </EmailWrapper>
        </InfoWrapper>

        {/* 네비게이션 영역 */}
        <NavigatorWrapper>
          <NavigatorBox onClick={() => navigate('/mypage/preferences')}>
            <NavigatorText>
              내 성향조사 수정하기
            </NavigatorText>
            <StyledArrowIcon/>
          </NavigatorBox>
          <NavigatorBox onClick={() => navigate('/mypage/reservations')}>
            <NavigatorText>
              예약한 방탈출 관리
            </NavigatorText>
            <StyledArrowIcon/>
          </NavigatorBox>
          <NavigatorBox onClick={() => navigate('/mypage/favorites')}>
            <NavigatorText>
              찜해둔 방탈출
            </NavigatorText>
            <StyledArrowIcon/>
          </NavigatorBox>
          <NavigatorBox onClick={() => navigate('/mypage/reviews')}>
            <NavigatorText>
              내가 작성한 후기
            </NavigatorText>
            <StyledArrowIcon/>
          </NavigatorBox>
        </NavigatorWrapper>
      </ContentWrapper>
    </PageWrapper>
  )
}

export default MyPage;

// CSS
const PageWrapper = styled.div`
  margin-top: 5.625rem;
  width: 100vw;
  height: calc(100vh - 5.625rem - 2.375rem); // 100vh-헤더-풋터
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.25em;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
`;

const InfoWrapper = styled.div`
  padding: 2.5rem 1.25rem 1.25rem 1.25rem;
  box-sizing: border-box;
  width: 32.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.25rem;
`;

const StyledLogoIcon = styled(LogoIcon)`
  width: 5.625rem;
  height: 5.625rem;

  @media (max-width: 768px) {
    width: 4.375rem;
    height: 4.375rem;
  }
`;

const EmailWrapper = styled.div`
  width: 18.5rem;
  height: 7.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
`;

const NicknameInput = styled.input`
  border: 1px solid var(--RIU_Monochrome-60, #C4C6D1);
  padding: 0rem 0.625rem;
  box-sizing: border-box;
  width: 18.0625rem;
  height: 2.625rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  background: var(--RIU_Monochrome-10, #F9F9FB);
  outline: none;
  text-align: center;
  color: var(--RIU_Primary-400, #515DBA);
  font-family: 'Pretendard-ExtraBold';
  font-size: 1.375rem;
  line-height: normal;

  @media (max-width: 768px) {
    width: 16.25rem;
    font-size: 1rem;
  }
`;

const Nickname = styled.div`
  height: 2.625rem;
  color: var(--RIU_Primary-400, #515DBA);
  font-family: 'Pretendard-ExtraBold';
  font-size: 1.375rem;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Email = styled.div`
  color: var(--RIU_Monochrome-100, #818496);
  text-align: center;
  font-family: 'Pretendard-Bold';
  line-height: normal;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const NicknameUpdateButton = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

const StyledCancelIcon = styled(CancelIcon)`
  padding: 0.28125rem;
  width: 0.8rem;
  cursor: pointer;
  path {
    fill: var(--RIU_Primary-100, #718FF2);
  }
`;
const StyledCheckIcon = styled(CheckIcon)`
  margin: 0.28125rem;
  height: 1.125rem;
  cursor: pointer;
`;

const StyledUpdateIcon = styled(UpdateIcon)`
  width: 1.6875rem;
  height: 1.6875rem;
  cursor: pointer;
`;

const ErrorText = styled.div<{ errorState: boolean }>`
  color: #ED2222;
  font-family: Pretendard;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  visibility: ${(props) => (props.errorState ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.errorState ? 1 : 0)};
  transition: all 0.2s ease-in-out;
`;

const NavigatorWrapper = styled.div`
  padding: 1.25rem;
  box-sizing: border-box;
  width: 32.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;

  @media (max-width: 768px) {
    width: 90vw;
  }
`;

const NavigatorBox = styled.div`
  border-bottom: 1px solid var(--RIU_Monochrome-50, #D6D6DF);
  padding: 0.625rem;
  box-sizing: border-box;
  height: 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  cursor: pointer;
`;

const NavigatorText = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: 'Pretendard-Medium';
  line-height: normal;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const StyledArrowIcon = styled(ArrowIcon)`
  width: 0.9375rem;
  height: 0.9375rem;

  path {
    fill: var(--RIU_Monochrome-500, #515467);
  }
`;
