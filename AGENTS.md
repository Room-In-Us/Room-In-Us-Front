# Room-In-Us-Front 에이전트 지침

## 프로젝트 구조

- 사용자용 방탈출 탐색·후기·예약 관리 프런트엔드입니다. Vite, React 18, TypeScript, React Router 6를 사용합니다.
- 의존성 설치와 실행 명령은 `package-lock.json`과 `package.json`을 기준으로 합니다. `npm ci`로 설치하고 `npm run dev`로 개발 서버를 실행합니다. 배포 컨테이너는 `Dockerfile`의 Node.js 버전을 사용합니다.
- `src/app`은 앱 진입점, 라우팅, 공통 Axios 인스턴스를 관리합니다. `src/pages`는 라우트 화면을 조립합니다. `src/features/<기능>` 아래에는 필요한 역할에 따라 `ui`, `model`, `lib`, `api`를 둡니다.
- `src/widgets`는 레이아웃을, `src/shared`는 여러 기능이 쓰는 컴포넌트·훅·스타일·헬퍼를 관리합니다. 도메인에 한정된 코드는 해당 기능 폴더에 둡니다.
- `server/`는 `npm start`로 실행하는 정적 파일 서버와 이미지 프록시 구현을 포함합니다. `api/image-proxy.js`는 Vercel 진입점입니다.

## 작업 기준

- 페이지와 컴포넌트 파일명은 PascalCase(`RoomInUs.tsx`), 아이콘과 이미지 파일명은 camelCase(`roomInUs.png`)를 사용합니다. 아이콘은 SVG, 이미지는 PNG를 기본으로 사용합니다.
- 스타일 단위는 `em`, `%`를 우선하고 `border-width`, `border-radius`에는 `px`를 사용합니다.
- 인접 코드의 모듈 구성, 상대경로 import와 export 방식을 따릅니다. 타입 전용 import는 `import type`을 사용하고 API 계약 타입은 해당 기능의 API 경계에 둡니다.
- UI는 기존 styled-components, MUI, 공유 컴포넌트 패턴을 따릅니다. 화면 변경 시 모바일 레이아웃, 키보드 포커스, 입력 레이블, 로딩·빈 결과·오류 상태 중 변경에 해당하는 부분을 확인합니다.
- API 호출은 해당 기능의 기존 헬퍼를 우선 재사용합니다. 인증 변경 시 `src/app/API.ts`, `src/shared/auth/`, 인증 테스트를 함께 확인하고 로그아웃 이후의 응답과 토큰 갱신 동작을 점검합니다.
- 라우팅 변경은 `src/app/App.tsx`의 라우트와 보호 화면을 기준으로 합니다. 직접 URL 접근과 새로고침 동작이 바뀌면 `src/shared/seo/`와 해당 배포 설정도 확인합니다.
- `VITE_` 환경 변수는 클라이언트 번들에 포함될 수 있으므로 공개 가능한 설정에만 사용합니다. 분석 이벤트를 수정할 때는 `src/shared/utils/analytics.ts`의 처리 기준을 따르고 전화번호 등 개인정보가 전송되지 않는지 확인합니다.
- 이미지 프록시 변경 시 허용 호스트, 오류 응답, `server/`와 `api/` 진입점의 동작을 함께 확인합니다.

## 이슈와 PR

- 이슈와 PR은 `.github/ISSUE_TEMPLATE/custom.md`와 `.github/pull_request_template.md`의 형식을 따릅니다. PR에는 반영 브랜치, 사용자에게 보이는 변경, 실제로 수행한 검증을 적습니다.
- 관련 이슈가 있으면 PR에 연결합니다.
- CodeRabbit은 `.coderabbit.yaml`의 기준으로 리뷰합니다. 변경을 검증할 때는 아래 로컬 검증 명령을 사용합니다.

## 브랜치와 커밋

- 배포 브랜치는 `main`, 개발 브랜치는 `develop`입니다. 작업 브랜치는 `유형/#이슈-설명` 형식으로 작성합니다. 예시는 `feature/#3-로그인레이아웃`입니다.
- 커밋 제목은 `유형: 한글 설명 (#이슈번호)` 형식으로 작성합니다. 유형의 첫 글자는 대문자로 쓰고, 제목은 영문 기준 50자 이내로 작성하며 끝에 마침표를 붙이지 않습니다.
- 커밋 유형은 기능 추가 `Feat`, 버그 수정 `Fix`, 삭제 `Remove`, 빌드 관련 변경 `Chore`, 테스트 `Test`, 리팩토링 `Refactor`, 문서 `Docs`, 코드 포맷 `Style`, 환경 설정 `Setting`을 사용합니다.
- 제목과 본문 사이에 빈 줄을 두고, 본문은 무엇을 왜 바꿨는지 한글로 설명합니다. 항목이 여러 개면 글머리 기호를 사용합니다.

## 검증

- 문서 및 설정 변경은 `git diff --check`로 확인합니다. CodeRabbit YAML을 바꾸면 YAML 파싱과 설정 키도 확인합니다.
- 소스 변경은 영향 범위에 따라 `npm run lint`, `npm run typecheck`, `npm run build`를 실행합니다.
- 회귀 테스트는 `node --test tests/변경에-해당하는-파일.test.cjs`로 실행합니다. 전체 테스트는 `node --test tests/*.test.cjs`로 실행합니다.
- 실행한 검증과 결과를 기록하고, 실행할 수 없었던 검증은 이유를 적습니다.
