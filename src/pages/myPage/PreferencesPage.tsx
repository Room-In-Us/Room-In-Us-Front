import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import LeftArrow from "../../shared/assets/icons/common/arrow/leftArrow.svg?react";
import ProficiencySection from "../../features/mypage/ui/preferences/ProficiencySection";
import GenreSection from "../../features/mypage/ui/preferences/GenreSection";
import HeadcountSection from "../../features/mypage/ui/preferences/HeadcountSection";
import PreferenceSection from "../../features/mypage/ui/preferences/PreferenceSection";
import PositionSection from "../../features/mypage/ui/preferences/PositionSection";
import InfoSection from "../../features/mypage/ui/preferences/InfoSection";
import { getPreferencesAPI, patchPreferencesAPI } from "../../features/mypage/api/surveyAPI";
import { surveyState } from "../../features/mypage/model/surveyAtom";
import { useRecoilState, useResetRecoilState } from 'recoil';
import useDevice from "../../shared/hooks/useDevice";
import {
  getAuthSessionGeneration,
  getAuthSessionSnapshot,
  isAuthSessionCurrent,
  subscribeAuthSessionState,
  synchronizeAuthSessionToken,
} from "../../shared/auth/sessionState";
import type { ThemeGenre, ThemeProficiency } from "../../shared/types/theme";
import type {
  PatchMemberPreferenceRequest,
  PreferenceActivity,
  PreferenceDevice,
  PreferenceElement,
  PreferenceHorrorPosition,
} from "../../shared/types/preference";
import type { PreferenceDraft } from "../../shared/types/preferenceDraft";

const genreValues: Record<ThemeGenre, true> = {
  SENTIMENTAL: true, HORROR: true, THRILLER: true, DETECTIVE: true, COMIC: true,
  MYSTERY: true, FANTASY: true, ADVENTURE: true, ESCAPE: true, DRAMA: true,
  ROMANCE: true, SF: true, HISTORY: true, FAIRY_TALE: true, ARCADE: true,
  SURVIVAL: true, PROBLEM: true, ACTION: true, ADULT: true, OUTDOOR: true, ETC: true,
};
const proficiencyValues: Record<ThemeProficiency, true> = {
  BEGINNER: true, JUNIOR: true, SENIOR: true, MASTER: true,
};
const elementValues: Record<PreferenceElement, true> = {
  STORY: true, INTERIOR: true, DIRECTION: true, VOLUME: true, PROBLEM: true, PRICE: true,
};
const activityValues: Record<PreferenceActivity, true> = { HIGH: true, LOW: true, NO_MATTER: true };
const deviceValues: Record<PreferenceDevice, true> = { DEVICE: true, LOCK: true, NO_MATTER: true };
const horrorPositionValues: Record<PreferenceHorrorPosition, true> = {
  FEARLESS: true, FEARFUL_TANK: true, RELUCTANT_TANK: true,
  NERVOUS: true, SCARED: true, EXTREME_SCARED: true,
};

function isChoice<Value extends string>(value: unknown, choices: Record<Value, true>): value is Value {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(choices, value);
}

function isChoiceList<Value extends string>(value: unknown, choices: Record<Value, true>): value is Value[] {
  if (!Array.isArray(value)) return false;
  const entries: readonly unknown[] = value;
  for (const entry of entries) {
    if (!isChoice(entry, choices)) return false;
  }
  return true;
}

// 응답 DTO의 optional/null 값을 기본값으로 채우지 않고, 편집 가능한 8개 필드만 복사한다.
function toPreferenceDraft(response: unknown): PreferenceDraft | null {
  if (typeof response !== 'object' || response === null || Array.isArray(response)
    || !('proficiency' in response) || !('preferredGenreList' in response)
    || !('preferredHeadcount' in response) || !('preferredElementList' in response)
    || !('preferredActivity' in response) || !('preferredDevice' in response)
    || !('horrorPos' in response) || !('preference' in response)) return null;

  const { proficiency, preferredGenreList, preferredHeadcount, preferredElementList,
    preferredActivity, preferredDevice, horrorPos, preference } = response;

  if ((proficiency !== null && !isChoice(proficiency, proficiencyValues))
    || !isChoiceList(preferredGenreList, genreValues) || preferredGenreList.length > 4
    || (preferredHeadcount !== null && (typeof preferredHeadcount !== 'number' || !Number.isInteger(preferredHeadcount)))
    || !isChoiceList(preferredElementList, elementValues) || preferredElementList.length > 3
    || (preferredActivity !== null && !isChoice(preferredActivity, activityValues))
    || (preferredDevice !== null && !isChoice(preferredDevice, deviceValues))
    || (horrorPos !== null && !isChoice(horrorPos, horrorPositionValues))
    || (preference !== null && typeof preference !== 'string')) return null;

  return {
    proficiency, preferredGenreList: [...preferredGenreList], preferredHeadcount,
    preferredElementList: [...preferredElementList], preferredActivity, preferredDevice, horrorPos, preference,
  };
}

type PreferenceRequest = {
  sessionGeneration: number;
  active: boolean;
  loaded: boolean;
  edited: boolean;
  saving: boolean;
};
type PreferenceLoadState = { sessionGeneration: number; status: 'loading' | 'ready' | 'error' };

function isCurrentRequest(request: PreferenceRequest, current: PreferenceRequest | null): boolean {
  return request === current && request.active && isAuthSessionCurrent(request.sessionGeneration)
    && getAuthSessionSnapshot() === true;
}

function PreferencesPage() {
  const [survey, setSurvey ] = useRecoilState(surveyState);
  const resetSurvey = useResetRecoilState(surveyState);
  const navigate = useNavigate();
  const { isMobile } = useDevice();
  // 기존 인증 상태만 구독하며, 새로운 /members 조회를 시작하지 않는다.
  const sessionGeneration = useSyncExternalStore(subscribeAuthSessionState, getAuthSessionGeneration, getAuthSessionGeneration);
  const authenticated = useSyncExternalStore(subscribeAuthSessionState, getAuthSessionSnapshot, getAuthSessionSnapshot);
  const requestRef = useRef<PreferenceRequest | null>(null);
  const [loadState, setLoadState] = useState<PreferenceLoadState>({ sessionGeneration, status: 'loading' });
  const [isSaving, setIsSaving] = useState(false);
  // effect의 cleanup 전 렌더에서도 이전 회원의 draft를 표시하지 않는다.
  const readyForCurrentSession = authenticated === true && loadState.sessionGeneration === sessionGeneration
    && loadState.status === 'ready';
  const canEdit = readyForCurrentSession && toPreferenceDraft(survey) !== null;
  const hasLoadError = authenticated === false || (loadState.sessionGeneration === sessionGeneration && loadState.status === 'error')
    || (readyForCurrentSession && !canEdit);

  // 성향조회 호출 (초기값 설정)
  useEffect(() => {
    synchronizeAuthSessionToken();
    if (!isAuthSessionCurrent(sessionGeneration) || getAuthSessionSnapshot() !== authenticated) return;
    // 본인 조회 응답의 memberId는 optional이다. 계정 전환은 기존 인증 세대로 구분한다.
    const request: PreferenceRequest = { sessionGeneration, active: true, loaded: false, edited: false, saving: false };
    requestRef.current = request;
    resetSurvey();
    setLoadState({ sessionGeneration, status: authenticated === false ? 'error' : 'loading' });
    setIsSaving(false);

    const fetchPreferences = async () => {
      try {
        const data = await getPreferencesAPI();
        if (!isCurrentRequest(request, requestRef.current) || request.edited) return;
        const draft = toPreferenceDraft(data);
        if (draft === null) {
          resetSurvey();
          setLoadState({ sessionGeneration, status: 'error' });
          return;
        }
        request.loaded = true;
        setSurvey(draft);
        setLoadState({ sessionGeneration, status: 'ready' });
      } catch (error) {
        if (!isCurrentRequest(request, requestRef.current) || request.edited) return;
        resetSurvey();
        setLoadState({ sessionGeneration, status: 'error' });
        console.error("성향조사 데이터 로딩 실패:", error);
      }
    };

    if (authenticated === true) void fetchPreferences();
    return () => {
      request.active = false;
      if (requestRef.current === request) requestRef.current = null;
    };
  }, [authenticated, sessionGeneration, setSurvey, resetSurvey]);

  const handleEditStart = () => {
    const request = requestRef.current;
    if (request && request.loaded && isCurrentRequest(request, requestRef.current)) request.edited = true;
  };

  // 성향조사 저장 핸들러
  const handleSubmitSurvey = async () => {
    // 다른 탭의 토큰 변경이 storage 이벤트보다 먼저 반영된 경우에도 이전 draft를 전송하지 않는다.
    synchronizeAuthSessionToken();
    const request = requestRef.current;
    if (!canEdit || !request || !request.loaded || request.saving || !isCurrentRequest(request, requestRef.current)) return;
    const draft = toPreferenceDraft(survey);
    if (draft === null) return;
    request.saving = true;
    setIsSaving(true);
    try {
      const payload: PatchMemberPreferenceRequest = draft;

      console.log("성향조사 제출 결과: ", payload);
      const response = await patchPreferencesAPI(payload);
      if (!isCurrentRequest(request, requestRef.current)) return;
      console.log("성향조사 제출 결과: ", response);
      alert("성향조사 결과가 저장되었습니다.");
      if (isCurrentRequest(request, requestRef.current)) navigate('/mypage');
    } catch (error) {
      if (!isCurrentRequest(request, requestRef.current)) return;
      console.error("성향조사 제출 중 오류 발생:", error);
    } finally {
      if (isCurrentRequest(request, requestRef.current)) {
        request.saving = false;
        setIsSaving(false);
      }
    }
  };

  return (
    <PageWrapper>
      <ContentWrapper onClickCapture={handleEditStart} onChangeCapture={handleEditStart}>
        {/* 뒤로가기 버튼 */}
        {!isMobile && (
          <BackButtonWrapper onClick={() => navigate('/mypage')}>
            <StyledLeftArrow/>
            <BackButtonText>
              마이페이지로 돌아가기
            </BackButtonText>
          </BackButtonWrapper>
        )}

        {/* 타이틀 영역 */}
        <TitleWrapper>
          <Title>
            내 성향조사 수정하기
          </Title>
          <Description>
            방탈출 예약을 쉽고 편리하게 도와주는 루미너스입니다 :&#41;
          </Description>
        </TitleWrapper>

        {canEdit ? <>
        {/* 숙련도 섹션 */}
        <ProficiencySection/>

        {/* 장르 섹션 */}
        <GenreSection/>

        {/* 인원 섹션 */}
        <HeadcountSection/>

        {/* 취향 섹션 */}
        <PreferenceSection/>

        {/* 포지션 섹션 */}
        <PositionSection/>

        {/* 추가정보 섹션 */}
        <InfoSection/>
        </> : (
          <Description role={hasLoadError ? 'alert' : 'status'}>
            {hasLoadError
              ? '성향 정보를 확인할 수 없어 수정할 수 없습니다. 잠시 후 다시 시도해 주세요.'
              : '성향 정보를 불러오는 중입니다.'}
          </Description>
        )}

        {/* 저장 버튼 */}
        <StyledButton onClick={handleSubmitSurvey} disabled={!canEdit || isSaving}>
          <ButtonText>성향조사 결과 저장하기</ButtonText>
        </StyledButton>
      </ContentWrapper>
    </PageWrapper>
  )
}

export default PreferencesPage;

// CSS
const PageWrapper = styled.div`
  margin-top: 5.625rem; // 헤더높이
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContentWrapper = styled.div`
  width: 36.25rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2.5rem;

  @media (max-width: 768px) {
    margin-bottom: 1.88rem;
    width: 90vw;
    gap: 1.875rem;
  }
`;

const BackButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  cursor: pointer;
`;

const StyledLeftArrow = styled(LeftArrow)`
  width: 1.25rem;
  height: 1.25rem;

  path {
    fill: var(--RIU_Monochrome-200, #717486);
  }
`;

const BackButtonText = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  text-align: center;
  font-family: 'Pretendard-Medium';
  line-height: normal;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.625rem;
`;

const Title = styled.div`
  color: var(--RIU_Primary-100, #718FF2);
  font-family: 'Pretendard-Bold';
  font-size: 1.5rem;
  line-height: 130%; /* 1.95rem */

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const Description = styled.div`
  color: var(--RIU_Monochrome-200, #717486);
  font-family: 'Pretendard-Medium';
  line-height: 130%; /* 1.3rem */

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const StyledButton = styled.button`
  all: unset;
  border: none;
  display: flex;
  height: 3.125rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  align-self: stretch;
  border-radius: 2.5rem;
  background: var(--RIU_Primary-Gradient-02, linear-gradient(282deg, #5B6ACC 0%, #718FF2 100%));
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease-in-out;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(19, 26, 115, 0.5);
    opacity: 0;
    transition: all 0.1s ease-in-out;
  }

  &:hover::before {
    opacity: 0.5;
  }
`;

const ButtonText = styled.div`
  color: #F9F9FB;
  font-family: 'Pretendard-Bold';
  line-height: 130%;
  z-index: 1;
  transition: all 0.2s ease-in-out;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;
