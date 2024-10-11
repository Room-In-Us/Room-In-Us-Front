import { useMediaQuery } from "react-responsive";

const useDevice = () => {
    const isMobile = useMediaQuery({ maxWidth: 768 });  // 모바일
    const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });  // 태블릿
    const isDesktop = useMediaQuery({ minWidth: 1025 });  // PC

    return { isMobile, isTablet, isDesktop };

};

export default useDevice;