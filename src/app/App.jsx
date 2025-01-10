import './App.css';
import { Routes, Route } from "react-router-dom";
import MainLayOut from '../widgets/MainLayOut';
import MainPage from '../pages/MainPage';
import LoginPage from '../pages/LoginPage';
import LevelPage from '../pages/LevelPage';
import LevelInfoPage from '../pages/LevelInfoPage';
import GenrePage from '../pages/GenrePage';
import GenreInfoPage from '../pages/GenreInfoPage';
import LocationPage from '../pages/LocationPage';
import BoardPage from '../pages/BoardPage';
import BoardMorePage from '../pages/BoardMorePage';
import BoardWritePage from '../pages/BoardWritePage';
import SignupPage from '../pages/SignupPage';
import { LoadScript } from '@react-google-maps/api';
import { useSetRecoilState } from 'recoil';
import { mapsLoadedState } from '../features/location/model/locationAtom';

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
                <Route element={<MainLayOut/>}>
                    
                    {/* 메인 페이지 */}
                    <Route path="/" element={<MainPage/>} />
                    
                    {/* 로그인 페이지 */}
                    <Route path="/login" element={<LoginPage/>} />

                    {/* 회원가입 페이지 */}
                    <Route path="/signup" element={<SignupPage/>} />

                    {/* 유저 정보 페이지 */}
                    
                    {/* 위치 페이지 */}
                    <Route path="/location" element={<LocationPage/>} />

                    {/* 숙련도 페이지 */}
                    <Route path="/level" element={<LevelPage/>} />
                    <Route path="/levelInfo" element={<LevelInfoPage/>} />

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
        </LoadScript>
    )
}

export default App;
