import './App.css';
import { Routes, Route } from "react-router-dom";
import MainLayOut from './layout/MainLayOut';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';

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
        <Route path="/location" element={<MainPage/>} />

        {/* 숙련도 페이지 */}
        <Route path="/level" element={<MainPage/>} />

        {/* 장르 페이지 */}
        <Route path="/genre" element={<MainPage/>} />

        {/* 게시판 페이지 */}
        <Route path="/board" element={<MainPage/>} />

        {/* 마이 페이지 */}
        <Route path="/mypage" element={<MainPage/>} />

      </Route>
    </Routes>
  )
}

export default App;
