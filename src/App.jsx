import './App.css';
import { Routes, Route } from "react-router-dom";
import MainPage from './pages/MainPage';

function App() {
  return (
    <Routes>
      {/* 메인 페이지 */}
      <Route path="/" element={<MainPage/>} />
      
      {/* 로그인 페이지 */}
      <Route path="/login" element={<MainPage/>} />

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
    </Routes>
  )
}

export default App;
