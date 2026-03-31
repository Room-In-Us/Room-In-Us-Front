import { matchPath } from 'react-router-dom';

export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://roominus.kr';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export const DEFAULT_SEO = {
  title: 'Room-In-Us',
  description: '방탈출의 모든 정보를 한 곳에',
  canonicalPath: '/',
  robots: 'index, follow',
  ogType: 'website',
  image: DEFAULT_OG_IMAGE,
};

const ROUTE_SEO_CONFIG = [
  {
    pattern: '/',
    seo: {
      title: 'Room-In-Us | 방탈출의 모든 정보를 한 곳에',
      description: '지역, 장르, 숙련도별로 방탈출 테마를 찾고 후기와 정보를 한눈에 확인해보세요.',
      canonicalPath: '/',
    },
  },
  {
    pattern: '/landing',
    seo: {
      title: 'Room-In-Us 소개',
      description: 'Room-In-Us 서비스와 주요 기능을 소개합니다.',
      canonicalPath: '/landing',
    },
  },
  {
    pattern: '/location',
    seo: {
      title: '지역별 방탈출 찾기 | Room-In-Us',
      description: '지역별로 방탈출 테마를 모아보고 원하는 매장과 테마를 빠르게 찾아보세요.',
      canonicalPath: '/location',
    },
  },
  {
    pattern: '/level',
    seo: {
      title: '숙련도별 방탈출 찾기 | Room-In-Us',
      description: '입문자부터 고수까지, 숙련도에 맞는 방탈출 테마를 탐색해보세요.',
      canonicalPath: '/level',
    },
  },
  {
    pattern: '/genre',
    seo: {
      title: '장르별 방탈출 찾기 | Room-In-Us',
      description: '공포, 추리, 감성 등 원하는 장르별로 방탈출 테마를 찾아보세요.',
      canonicalPath: '/genre',
    },
  },
  {
    pattern: '/search',
    seo: {
      title: '방탈출 검색 | Room-In-Us',
      description: '원하는 방탈출 테마와 매장을 검색해보세요.',
      canonicalPath: '/search',
    },
  },
  {
    pattern: '/theme/:themeId',
    seo: {
      title: '방탈출 테마 상세 | Room-In-Us',
      description: '방탈출 테마의 상세 정보, 가격, 후기와 예약 링크를 확인해보세요.',
      ogType: 'article',
    },
  },
  {
    pattern: '/theme/:themeId/review/:reviewId',
    seo: {
      title: '방탈출 후기 상세 | Room-In-Us',
      description: '방탈출 플레이 후기와 평가를 자세히 확인해보세요.',
      ogType: 'article',
    },
  },
  {
    pattern: '/terms',
    seo: {
      title: '이용약관 | Room-In-Us',
      description: 'Room-In-Us 이용약관을 확인하세요.',
      canonicalPath: '/terms',
    },
  },
  {
    pattern: '/privacy',
    seo: {
      title: '개인정보처리방침 | Room-In-Us',
      description: 'Room-In-Us 개인정보처리방침을 확인하세요.',
      canonicalPath: '/privacy',
    },
  },
  {
    pattern: '/login',
    seo: {
      title: '로그인 | Room-In-Us',
      description: 'Room-In-Us에 로그인하세요.',
      canonicalPath: '/login',
      robots: 'noindex, nofollow',
    },
  },
  {
    pattern: '/signup',
    seo: {
      title: '회원가입 | Room-In-Us',
      description: 'Room-In-Us 회원가입을 진행하세요.',
      canonicalPath: '/signup',
      robots: 'noindex, nofollow',
    },
  },
  {
    pattern: '/survey',
    seo: {
      title: '취향 설문 | Room-In-Us',
      description: 'Room-In-Us 취향 설문을 진행하세요.',
      canonicalPath: '/survey',
      robots: 'noindex, nofollow',
    },
  },
  {
    pattern: '/mypage',
    seo: {
      title: '마이페이지 | Room-In-Us',
      description: '내 정보와 활동 내역을 확인하세요.',
      canonicalPath: '/mypage',
      robots: 'noindex, nofollow',
    },
  },
  {
    pattern: '/mypage/preferences',
    seo: {
      title: '선호 정보 설정 | Room-In-Us',
      description: '내 선호 정보를 관리하세요.',
      canonicalPath: '/mypage/preferences',
      robots: 'noindex, nofollow',
    },
  },
  {
    pattern: '/mypage/reservations',
    seo: {
      title: '내 예약 일정 | Room-In-Us',
      description: '예약한 방탈출 일정을 확인하세요.',
      canonicalPath: '/mypage/reservations',
      robots: 'noindex, nofollow',
    },
  },
  {
    pattern: '/mypage/favorites',
    seo: {
      title: '찜한 테마 | Room-In-Us',
      description: '찜한 방탈출 테마를 확인하세요.',
      canonicalPath: '/mypage/favorites',
      robots: 'noindex, nofollow',
    },
  },
  {
    pattern: '/mypage/reviews',
    seo: {
      title: '내 후기 | Room-In-Us',
      description: '내가 작성한 방탈출 후기를 확인하세요.',
      canonicalPath: '/mypage/reviews',
      robots: 'noindex, nofollow',
    },
  },
];

export function getSeoForPath(pathname) {
  const matchedRoute = ROUTE_SEO_CONFIG.find(({ pattern }) =>
    matchPath({ path: pattern, end: true }, pathname),
  );

  const routeSeo = matchedRoute?.seo || {};
  const canonicalPath = routeSeo.canonicalPath || pathname || '/';
  const canonicalUrl = new URL(canonicalPath, SITE_URL).toString();

  return {
    ...DEFAULT_SEO,
    ...routeSeo,
    canonicalPath,
    canonicalUrl,
    url: canonicalUrl,
  };
}
