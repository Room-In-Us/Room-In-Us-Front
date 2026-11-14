import styled from "styled-components"
import { getFavoriteThemesAPI } from "../../api/favoriteThemesAPI";
import ContentCard from "../../../../shared/components/ContentCard";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { headCountState } from "../../model/favoriteAtom";
import NoDataImg from "../../../../shared/assets/images/common/noData/noDataImageLarge.png";
import type { ThemeResponse } from "../../../../shared/types/theme";

export default function ContentCardSection() {

	// 인원수 필터 상태
	const headCount = useRecoilValue(headCountState);

	const [themeList, setThemeList] = useState<ThemeResponse[]>([]);
	const requestGeneration = useRef(0);
	const requestContext = useRef({ headCount });

	useLayoutEffect(() => {
		requestContext.current = { headCount };
		requestGeneration.current += 1;
		return () => { requestGeneration.current += 1; };
	}, [headCount]);

	const handleUnlike = (themeId: ThemeResponse['themeId']) => {
		setThemeList(prevList => 
			prevList.map(item =>
				item.themeId === themeId
				? { ...item, isLiked: false }
				: item
			)
		);
	};

	useEffect(() => {
		let active = true;
		const generation = ++requestGeneration.current;
		const isCurrent = () => active && requestGeneration.current === generation
			&& requestContext.current.headCount === headCount;
		const fetchData = async () => {
			try {
				const response = await getFavoriteThemesAPI(headCount, 1, 1000);
				if (!isCurrent()) return;
				setThemeList(response.contents);

				const initialLikes: Record<ThemeResponse['themeId'], boolean> = {};
				response.contents.forEach(item => {
					initialLikes[item.themeId] = true;
				});
			} catch (error) {
				if (!isCurrent()) return;
				console.error('좋아요한 방탈출 목록 데이터를 불러오는 중 오류 발생:', error);
			}
		};
		fetchData();
		return () => { active = false; };
	}, [headCount]);

	const visibleThemeList = themeList.filter((item) => item.isLiked !== false);

	return (
		<Wrapper>
			{visibleThemeList.length === 0 ? (
			<NoDataWrapper>
			<img src={NoDataImg} alt="찜한 방탈출 없음" />
			<NonDataTextWrapper>
				<NonDataText>아직 찜한 방탈출이 없습니다.</NonDataText>
			</NonDataTextWrapper>
			</NoDataWrapper>
			) : (
				visibleThemeList.map((items) => (
					<ContentCard
						key={items.themeId}
						data={{ ...items, price: items.price != null ? items.price * headCount : null }}
						headCount={headCount}
						onUnlike={handleUnlike}
						backButtonText="내가 찜한 테마 목록으로 돌아가기"
					/>
				))
			)}
		</Wrapper>
	)
}

const Wrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	align-content: flex-start;
	row-gap: 1.25em;
	align-self: stretch;
	flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const NoDataWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4rem 0;
  gap: 1.25em;

  img {
    width: 16rem;
    
    @media (max-width: 768px) {
      width: 10rem;
    }
  }
`;

const NonDataTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
`;

const NonDataText = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  text-align: center;
  font-family: Pretendard-ExtraBold;
  font-size: 1.125rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;
