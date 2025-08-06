import './App.css';
import { Routes, Route } from 'react-router-dom';
import MainLayOut from '../widgets/MainLayOut';
import MainPage from '../pages/MainPage';
import LoginPage from '../pages/LoginPage';
import GenrePage from '../pages/GenrePage';
import LocationPage from '../pages/LocationPage';
import SignupPage from '../pages/SignupPage';
import { LoadScript } from '@react-google-maps/api';
import { useSetRecoilState } from 'recoil';
import { mapsLoadedState } from '../features/location/model/locationAtom';
import LevelPage from '../pages/LevelPage';
import AuthCallback from '../features/auth/ui/AuthCallback';
import AuthError from '../features/auth/ui/AuthError';
import SurveyPage from '../pages/SurveyPage';
import ThemeDetailPage from '../pages/ThemeDetailPage';
import MyPage from '../pages/myPage/MyPage';
import PreferencesPage from '../pages/myPage/PreferencesPage';
import ReservationsPage from '../pages/myPage/ReservationsPage';
import FavoritesPage from '../pages/myPage/FavoritesPage';
import ReviewsPage from '../pages/myPage/ReviewsPage';
import SerachPage from '../pages/SerachPage';
import ReviewDetailPage from '../pages/ReviewDetailPage';
import NotFoundPage from '../pages/NotFoundPage';
import DatePickerGlobalStyle from '../shared/styles/DatePickerGlobalStyle';

function App() {
  const setMapsLoaded = useSetRecoilState(mapsLoadedState);

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      onLoad={() => setMapsLoaded(true)} // 로딩 완료 시 상태를 true로 설정
      onError={() => setMapsLoaded(false)} // 로딩 실패 시 false로 설정
    >
      <Routes>
        {/* 메인 레이아웃 적용 */}
        <Route element={<MainLayOut />}>
          {/* 메인 페이지 */}
          <Route path="/" element={<MainPage />} />

          {/* 로그인 페이지 */}
          <Route path="/login" element={<LoginPage />} />

          {/* 회원가입 페이지 */}
          <Route path="/signup" element={<SignupPage />} />

          {/* 소셜 로그인 콜백 페이지 */}
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* 소셜 로그인 에러 페이지 */}
          <Route path="/auth/error" element={<AuthError />} />

          {/* 위치 페이지 */}
          <Route path="/location" element={<LocationPage />} />

          {/* 숙련도 페이지 */}
          <Route path="/level" element={<LevelPage/>} />

          {/* 장르 페이지 */}
          <Route path="/genre" element={<GenrePage />} />

          {/* 테마 상세 페이지 */}
          <Route path="/theme/:themeId" element={<ThemeDetailPage />} />

          {/* 후기 상세 페이지 */}
          <Route path="/theme/:themeId/review/:reviewId" element={<ReviewDetailPage />} />

          {/* 마이 페이지 */}
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/mypage/preferences" element={<PreferencesPage />} />
          <Route path="/mypage/reservations" element={<ReservationsPage />} />
          <Route path="/mypage/favorites" element={<FavoritesPage />} />
          <Route path="/mypage/reviews" element={<ReviewsPage />} />

          {/* 성향조사 페이지 */}
          <Route path="/survey" element={<SurveyPage />} />

          {/* 전체 검색 페이지 */}
          <Route path = '/search' element={<SerachPage />} />

          {/* 404 Not Found 페이지 */}
          <Route path= "*" element={<NotFoundPage />} />
        </Route>
      </Routes>

      {/* 데이터 피커 전역 스타일 */}
      <DatePickerGlobalStyle />
    </LoadScript>
  );
}

export default App;
