import styled from "styled-components"
import { getFavoriteThemesAPI } from "../../api/favoriteThemesAPI";
import ContentCard from "../../../../shared/components/ContentCard";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { likedThemeState } from "../../../like/modal/likeAtom";

export default function ContentCardSection() {

	// 인원수 필터 상태
	const [headCount, setHeadCount] = useState(2);

	const [themeList, setThemeList] = useState([]);

	const setLikedThemes = useSetRecoilState(likedThemeState);

	const handleUnlike = (themeId) => {
		setThemeList(prevList => prevList.filter(item => item.themeId !== themeId));
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await getFavoriteThemesAPI(headCount, 1, 1000);
				setThemeList(response.contents);

				const initialLikes = {};
				response.contents.forEach(item => {
					initialLikes[item.themeId] = true;
				});
				setLikedThemes(initialLikes);
			} catch (error) {
				console.error('좋아요한 방탈출 목록 데이터를 불러오는 중 오류 발생:', error);
			}
		};
		fetchData();
	}, [headCount, setLikedThemes]);

	return (
		<Wrapper>
		{themeList.map((items) => (
			<ContentCard
				key={items.themeId}
				data={{ ...items, price: items.price != null ? items.price * headCount : null }}
				headCount={headCount}
				onUnlike={handleUnlike}
			/>
		))}
		</Wrapper>
	)
}

const Wrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	align-content: flex-start;
	row-gap: 20px;
	align-self: stretch;
	flex-wrap: wrap;
`;