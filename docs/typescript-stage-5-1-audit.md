**Stage 5-1 — TypeScript 설정 정리 및 최종 정적 검증**

검증일: 2026-11-03. Stage 5-1 구현·정적 검증 완료. 브라우저·실제 API 기능 검증인 Stage 5-2는 진행하지 않았다.

**1. 설정 관계와 적용 범위**

- 프로젝트 설정은 [tsconfig.json](../tsconfig.json) 한 개다. `extends`, `references`, 별도 tsconfig/jsconfig는 없다.
- `npm run typecheck`는 `tsc --noEmit --project tsconfig.json`을 실행한다.
- `allowJs: true`를 `false`로 변경하고, JS를 검사하지 않으므로 불필요한 `checkJs: false`를 삭제했다.
- `strict: true`, `include: ["src"]`, 기존 exclude, `noEmit`, `skipLibCheck` 등 나머지 옵션은 유지했다. 검사 대상을 줄이거나 라이브러리 검사 옵션을 추가로 완화하지 않았다.
- 변경 전후 프로젝트 입력 파일과 프로그램의 src 파일 목록은 동일한 **204개**다: `.ts` 76개, `.tsx` 125개, `.d.ts` 3개. src JS/JSX는 0개다.
- `vite.config.js`는 Vite가, `eslint.config.js`는 ESLint가 읽는다. `api/image-proxy.js`와 `server/*.mjs`는 Node 실행 영역이다. 이 파일들은 기존에도 src 타입 검사 대상이 아니었으며 그대로 유지했다.
- Vite 빌드·ESLint 실행, 범위 밖 JS 및 서버 진입점의 `node --check`, `api/image-proxy.js`의 Node ESM import가 통과했다. 서버를 실행하거나 포트를 점유하지 않았다.

**2. 이번 변경 파일**

| 파일 | 변경 |
| --- | --- |
| [tsconfig.json](../tsconfig.json) | allowJs false, checkJs 삭제 |
| [filterTypes.ts](../src/shared/components/filter/filterTypes.ts) | 미참조 FilterSelectionRef, 전용 MutableRefObject import, 사용하지 않는 currentValue 호환 필드 제거 |
| [PeopleFilter.tsx](../src/shared/components/filter/PeopleFilter.tsx) | forwardRef handle의 불필요한 undefined 제거 |
| [SortFilter.tsx](../src/shared/components/filter/SortFilter.tsx) | forwardRef handle의 불필요한 undefined 제거 |
| [RegionFilter.tsx](../src/shared/components/filter/RegionFilter.tsx) | forwardRef handle의 불필요한 undefined 제거 |
| [GenreContentSection.tsx](../src/features/genre/ui/GenreContentSection.tsx) | updatedZones에 string[] 명시 |
| [LevelContentSection.tsx](../src/features/level/ui/LevelContentSection.tsx) | updatedZones에 string[] 명시 |
| [StarRating.tsx](../src/features/review/ui/StarRating.tsx) | SVG URL 변수 icon에 string 명시 |
| [StoreCard.tsx](../src/features/location/ui/StoreCard.tsx) | 복사 실패 콜백 인자 3개에 unknown 명시 |
| [ThemeOverviewCard.tsx](../src/features/themeDetail/ui/ThemeOverviewCard.tsx) | 복사 실패 콜백 인자에 unknown 명시 |
| [ThemeInfoSection.tsx](../src/features/themeDetail/ui/ThemeInfoSection.tsx) | 복사 실패 콜백 인자 3개에 unknown 명시 |
| [ThemeReviewSection.tsx](../src/features/themeDetail/ui/ThemeReviewSection.tsx) | Array 생성으로 any가 추론되던 미사용 map 인자에 unknown 명시 |
| [ScheduleSection.tsx](../src/features/mypage/ui/reservations/ScheduleSection.tsx) | 조회 실패 콜백 인자에 unknown 명시 |
| [ReviewCard.tsx](../src/features/mypage/ui/reviews/ReviewCard.tsx) | 썸네일 조회 실패 콜백 인자에 unknown 명시 |
| [ReviewCardSection.tsx](../src/features/mypage/ui/reviews/ReviewCardSection.tsx) | 목록 조회 실패 콜백 인자에 unknown 명시 |
| 이 보고서 | 점검 결과·검증 범위·후속 항목 기록 |

제품 코드 변경은 타입에 한정한다. API·DTO·공유 인증·Recoil 정의, 요청 payload, JSX/CSS, 이벤트 처리와 비동기 정책은 변경하지 않았다. 기존 미커밋 Stage 4 변경은 보존했다.

**3. any와 억제·단언 점검**

TypeScript AST와 타입 검사기로 전체 src를 조사했다.

| 항목 | 결과 |
| --- | --- |
| 명시적 AnyKeyword | 0개 |
| @ts-ignore / @ts-expect-error / @ts-nocheck | 각각 0개 |
| 변수·매개변수 바인딩의 any 추론 | 14개를 명시해 0개로 정리 |
| non-null assertion | 0개 |
| 타입 단언 | 12개, 아래 DOM 이벤트 처리에 한정 |
| 명시적인 .js/.jsx import/export 경로 | 0개 |

기존 any 추론 14개는 Promise.catch 인자 10개, 사용하지 않는 페이지네이션 인자 1개, 대입 전에 타입이 정해지지 않던 지역 변수 3개였다. 오류 인자에는 unknown을 사용하고, 정상 데이터는 실제 string[]/string 계약을 명시했다.

`LocationPeopleFilter`와 `LocationSortFilter`에 남은 `PropTypes.any` 네 표현식은 런타임 검증자이며 TypeScript any가 아니다. 런타임 변경을 피하기 위해 유지했다.

다음 단언은 각 document 이벤트 또는 input 이벤트의 실제 연결 위치를 확인하고 유지했다. 서버 DTO로의 강제 변환, 이중 단언, 타입 오류를 숨기는 단언은 발견되지 않았다.

| 파일·위치 | 단언 | 근거·후속 정리안 |
| --- | --- | --- |
| SearchInput.tsx:46 | e.target as HTMLInputElement | input의 Enter 이벤트. currentTarget.value로 바꾸면 단언을 줄일 수 있으나 이벤트 표현식 변경은 이번에 하지 않음 |
| Header.tsx:85 | event.target as Node \| null | document mousedown의 DOM 대상 |
| useDropDown.ts:61,63 | event.target as Node \| null | document mousedown의 외부 클릭 판정 |
| LevelTabSection.tsx:49 | e.target as Node \| null | document mousedown의 외부 클릭 판정 |
| ReviewDropdown.tsx:42 | event.target as Node \| null | document mousedown의 외부 클릭 판정 |
| ReviewSecond.tsx:87 | e.target as Node \| null | document mousedown의 외부 클릭 판정 |
| ReservationDropDown.tsx:70 | e.target as Node \| null | document mousedown의 외부 클릭 판정 |
| ReviewDropDown.tsx:25 | e.target as Node \| null | document mousedown의 외부 클릭 판정 |
| ReviewActionDropDown.tsx:32,34 | e.target as Node \| null | document mousedown의 외부 클릭 판정 |
| PlayMemberSection.tsx:21 | e.target as Node \| null | document mousedown/touchstart의 외부 클릭 판정 |

이 결과가 외부 라이브러리 내부의 any까지 없앴다는 의미는 아니다. React Router의 useLocation().state 등은 라이브러리의 any 경계이며, 현재 호출부의 Location<T> 표기는 런타임 검증이 아니다. 서버 응답과 history state의 실제 형식 검증은 별도 기능 검증 대상이다.

**4. union과 전환 호환 타입**

329개 union 구문(중복 문자열을 합치면 144종)을 조사했다. nullable 상태, enum, 식별자, 초기 표시 상태, UI/API 경계를 구분해 검토했다.

- filter ref의 handle은 useImperativeHandle에서 항상 객체를 반환하므로 undefined를 제거했다. React의 ref 생략·null 처리는 유지된다.
- FilterSelectionRef와 currentValue는 src 및 테스트 소비처가 없어 제거했다. reset/getValue 계약은 유지했다.
- RegionFilterCompatibilityProps는 부모가 지금도 selectedZone, regionId, zoneIdList, setter 등을 전달하는 계약이다. 자식이 읽지 않는 레거시 props가 있지만 호출부를 바꾸지 않고 이 타입만 지우면 호환성이 깨지므로 유지했다. 별도 소비처 정리 후보이며 새 union으로 오용을 허용하지 않았다.
- ID의 number|string, 선택 전 null/undefined, StationCard의 number|'' 및 StoreCard의 응답|[]는 실제 호출·초기값을 보존한다. 타입을 좁히려고 값을 변환하거나 초기값을 바꾸지 않았다.
- 후기 draft의 nullable 참여자·UI 전용 필드와 mutation 요청은 계속 분리한다. atomFamily parameter의 undefined는 일정 날짜 선택 화면의 실제 호출과 대응한다.
- 예약 목록 DTO와 일정 미리보기는 구분한 타입을 유지한다. Date/Dayjs/string과 날짜만 선택했을 때 reservedAt=null을 임의로 통일하지 않았다.
- 성향 DTO의 optional/null과 필수 편집 배열은 구분한다. 불완전 응답을 임의의 빈 배열로 저장하지 않는 기존 검증 경계를 유지했다.
- API DTO의 null 가능성·가입 토큰·요청 ID 의미는 새 자료 없이 축소하거나 확대하지 않았다.

**5. 선언 파일**

남은 .d.ts는 3개이며 중복이나 JS 구현을 대신하는 임시 선언은 없다. 실제 파일을 삭제하지 않고 컴파일러 호스트에서 하나씩 제외해 필요성을 검증했다.

| 선언 | 유지 이유 |
| --- | --- |
| [vite-env.d.ts](../src/vite-env.d.ts) | Vite CSS·이미지, SVGR, ImportMetaEnv, Window.dataLayer. 제외 시 env/CSS/SVG 타입 오류 발생 |
| [axios.d.ts](../src/app/axios.d.ts) | __skipAuth, __skipRefresh, __authSessionGeneration, _retry 확장. 제외 시 인증 요청 옵션 오류 발생 |
| [swiper-css.d.ts](../src/shared/types/swiper-css.d.ts) | 실제 사용하는 swiper/css, pagination, navigation 경로 3개. 제외 시 TS2882 발생 |

기존 OptionList.d.ts·FilterStyles.d.ts는 이미 제거된 상태이며 새 선언을 추가하지 않았다.

**6. 검증과 실행 결과 동등성**

| 검사 | 결과 |
| --- | --- |
| npm run lint | 통과, 기존 LocationPage Hook 경고 1건 |
| npm run typecheck | 통과, 검사 파일 집합 전후 동일 |
| npm run build | 변경 전후 통과, 기존 대형 번들 경고만 유지 |
| git diff --check | 통과 |
| node --test tests/*.test.cjs | 298개 모두 통과, 기존 인증 회귀 25개 포함 |
| 범위 밖 JS 구문·모듈 로드 | node --check 및 serverless handler ESM import 통과 |
| 타입 제거 후 JS | 201개 구현 파일의 JavaScript AST 전후 동일 |
| production build | 산출물 47개 전부 파일명·SHA-256 동일 |
| HTML 및 런타임 진입점 | dist/index.html 동일, /assets/index-B4Vk1I6A.js 동일 |
| 런타임 import 순환 | 기존 API.ts ↔ authAPI.ts 한 개만 유지, 신규 없음 |

TypeScript 출력 텍스트에서는 오류 인자 두 곳에 괄호가 추가되지만 JavaScript AST와 production bundle은 동일하다. src/app/main.tsx, 원본 index.html, API·인증·Recoil·패키지·범위 밖 JS 파일은 이번 작업 전후 동일하다.

브라우저 테스트, 실제 회원 조회 및 데이터 생성·수정·삭제는 실시하지 않았다. Stage 5-2를 시작하지 않았으며 커밋·push도 하지 않았다.

**7. 기존 문제와 마이그레이션 차단 여부**

| 항목 | 판단·후속 조치 |
| --- | --- |
| LocationPage handleStationSelect 의존성 경고 | 기존 문제로 Stage 5-1 완료를 막지 않음. 의존성만 추가하면 조회 루프가 달라질 수 있어 별도 동작 검증 후 수정 |
| Vite 대형 번들 경고 | 타입·빌드 실패가 아닌 성능 과제. 코드 분할·패키지 정리는 별도 작업 |
| API.ts ↔ authAPI.ts 순환 | 기존 실행 의존성으로 이번 설정 변경과 무관. 인증 회귀는 통과하지만 향후 초기화 순서·모듈 구조 검토가 필요 |
| 인증·프로필의 비동기 후속 문제 | 타입 전환 실패는 아님. NicknameSection의 늦은 중복검사 응답, AuthCallback의 언마운트 후 이동, MyPage의 조회·수정·타이머 cleanup 부재는 기능 과제로 유지 |
| 후기 성향 자동 입력 | ReviewSecond의 성향 조회에 cleanup/요청 세대 검사가 없음. 늦은 응답의 shared draft 쓰기를 별도 검증·수정해야 함 |
| 예약·후기 경합 수정 결과 | 이미 수정된 검색·캐시·저장·내보내기 경합은 이번 전체 회귀를 통과. 이를 미해결 버그로 되돌리지 않으며 실제 화면에서도 추가 검증 |
| 서버 nullable 의미 | 정적 완료와 실제 서버 계약 확정은 별개. reservedAt=null, 참여자 remark의 null, 누락/null 성향 배열, 토큰 없는 가입 성공 후 UX는 자료·정책 확인 없이 변경하지 않음 |

위 항목은 이번 설정 변경의 신규 오류가 아니다. Stage 5-1 정적 완료를 막지 않지만, 제품 전체 기능의 최종 승인 여부와는 구분한다. 서버 계약과 다른 실제 응답이나 오류가 확인되면 별도의 버그·계약 수정으로 처리해야 한다.

**8. Stage 5-2 직접 검증 목록 — 아직 미실시**

1. 앱 최초 진입·새로고침, 주요 경로 직접 접근, 인증 null/false/true, 404, 뒤로가기·앞으로가기, 데스크톱·모바일 레이아웃.
2. 로그인·가입·로그아웃, 가입 중복 클릭·실패 재시도, 토큰 없는 성공, 계정 변경, 탭 focus/visibilitychange의 60초 조건, /members 중복 조회 방지.
3. 닉네임 중복검사 응답 역전, 프로필 조회 중 편집, 닉네임 수정 실패, 모달 닫기·재진입·언마운트.
4. 장르·숙련도·검색의 정렬·페이지·필터, 지역 전체 선택, 모바일 선택/적용/취소/초기화, 지도·역·매장 선택과 중심·줌.
5. 설문·회원 성향 로딩/실패/불완전 응답, 장르 4개·요소 3개 제한, 저장 성공·실패와 입력 보존.
6. 예약·일정 검색과 월 이동의 응답 경합, 날짜만 선택, 생성·수정·삭제, 저장 성공 후 목록 갱신 실패, 중복 제출·재진입.
7. 후기 draft 복원·단계 이동·참여자 입력·필수값 검증, 작성·수정·삭제, 테마 변경 시 후기 페이지 초기화, 찜 실패 복구와 빠른 연속 클릭.
8. 후기 공유 8종 템플릿, 이미지 업로드·fallback, PNG 다운로드·Web Share·fallback, 실패 재시도와 이전 작업의 늦은 완료.

실제 인증·변경 API 검증은 본인 또는 명시적으로 허가된 테스트 계정·데이터로 제한한다. 미확정 서버 정책과 발견된 기능 버그는 타입 정리와 별도의 승인 범위로 관리한다.
