import './App.css';
import { Routes, Route } from "react-router-dom";
import MainLayOut from './layout/MainLayOut';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import LevelPage from './pages/LevelPage';
import LevelInfoPage from './pages/LevelInfoPage';
import GenrePage from './pages/GenrePage';
import GenreInfoPage from './pages/GenreInfoPage';
import LocationPage from './pages/LocationPage';
import BoardPage from './pages/BoardPage';
import BoardMorePage from './pages/BoardMorePage';
import BoardWritePage from './pages/BoardWritePage';
// 지도 컴포넌트
import NaverMapPage from './pages/map/NaverMapPage';
import GoogleMapPage from './pages/map/GoogleMapPage';

function App() {
  return (
    <Routes>
      {/* 메인 레이아웃 적용 */}
      <Route element={<MainLayOut/>}>
        
        {/* 메인 페이지 */}
        <Route path="/" element={<MainPage/>} />
        
        {/* 로그인 페이지 */}
        <Route path="/login" element={<LoginPage/>} />

        {/* 회원가입 페이지 */}
        <Route path="/signup" element={<LoginPage/>} />

        {/* 위치 페이지 */}
        <Route path="/location" element={<GoogleMapPage/>} />

        {/* 숙련도 페이지 */}
        <Route path="/level" element={<LevelPage/>} />
        <Route path='/levelInfo' element={<LevelInfoPage/>} />

        {/* 장르 페이지 */}
        <Route path="/genre" element={<GenrePage/>} />
        <Route path="/genreInfo" element={<GenreInfoPage/>} />

        {/* 게시판 페이지 */}
        <Route path="/board" element={<BoardPage/>} />
        <Route path="/boardmore" element={<BoardMorePage />} />
        <Route path="/boardwrite" element={<BoardWritePage/>} />

        {/* 마이 페이지 */}
        <Route path="/mypage" element={<MainPage/>} />

      </Route>
    </Routes>
  )
}

export default App;