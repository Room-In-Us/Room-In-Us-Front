import { useMediaQuery } from "react-responsive";

const useDevice = () => {
    const isDesktop = useMediaQuery({ minWidth: 1025 });  // PC
    const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });  // 태블릿
    const isMobile = useMediaQuery({ maxWidth: 768 });  // 모바일

    return { isDesktop, isTablet, isMobile };

};

export default useDevice;