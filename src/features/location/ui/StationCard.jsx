import { useState, useEffect } from "react";
import styled from "styled-components";
import DownArrowIcon from "../../../shared/assets/icons/location/downArrowIcon.svg?react";
import AwardsIcon from "../../../shared/assets/icons/common/awards.svg?react";
import ArrowIcon from "../../../shared/assets/icons/location/arrowIcon.svg?react";
import RightArrowIcon from "../../../shared/assets/icons/survey/rightArrowIcon.svg?react";
import LeftArrowIcon from "../../../shared/assets/icons/survey/leftArrowIcon.svg?react";
import { useRecoilState } from "recoil";
import { stationCardVisible, storeCardVisible, zoneId, storePageNumber, locationStoreId, locationRegionId, zoneName, storeCount, themeCount, centerLatAndLng, storeLatAndLngList, zoomLevel } from "../../../features/location/model/locationAtom";
import { getSeoulZonesInfoAPI, getSeoulZoneStoreListAPI, getZoneStoreListAPI } from "../api/locationAPI";
import { stationLineConversion } from "../../../shared/utils/stationLineUtils";

function StationCard() {
  // 상태 관리
  const [, setIsStationCardVisible] = useRecoilState(stationCardVisible);
  const [, setIsStoreCardVisible] = useRecoilState(storeCardVisible);
  const [, setZoneInfo] = useState(""); // 구역별 상세정보
  const [stationList, setStationList] = useState([]); // 역 목록 상태
  const [isZoneId,] = useRecoilState(zoneId);
  const [currentPage, setCurrentPage] = useRecoilState(storePageNumber);
  const [totalPages, setTotalPages] = useState("");
  const [, setStoreId] = useRecoilState(locationStoreId);
  const [regionId,] = useRecoilState(locationRegionId); // 지역 아이디 상태
  const [CapitalZoneName,] = useRecoilState(zoneName); // 구역 이름 상태
  const [CapitalStoreCount,] = useRecoilState(storeCount); // 구역별 매장 개수
  const [CapitalThemeCount,] = useRecoilState(themeCount); // 구역별 테마 개수
  const [, setCenterLatAndLng] = useRecoilState(centerLatAndLng); // 구역 중앙 좌표
  const [storeList, setStoreList] = useRecoilState(storeLatAndLngList); // 매장 리스트
  const [, setZoomLevel] = useRecoilState(zoomLevel); // 줌 레벨

  // 매장 선택 핸들러
  const handleStoreSelect = (id) => {
    setIsStoreCardVisible(true);
    setIsStationCardVisible(false);
    setStoreId(id);
  };

  // 서울 구역 상세정보 조회
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSeoulZonesInfoAPI(isZoneId);
        console.log('서울 구역 상세정보: ', response);
        setZoneInfo(response);
        setStationList(response.stationList);
      } catch (error) {
        console.error('서울 구역 상세정보 데이터를 불러오는 중 오류 발생:', error);
      }
    };
    fetchData();
  }, [isZoneId]);

  // 서울 구역 매장 목록 조회
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isZoneId > 0 && isZoneId < 17) {
          const response = await getSeoulZoneStoreListAPI(isZoneId, currentPage, 10, "RECOMMEND");
          console.log('서울 구역 매장 목록: ', response);
          setTotalPages(response.storeData.totalPages);
          setCenterLatAndLng({ // 구역 중앙 좌표
            lat: response.latitudeAvg,
            lng: response.longitudeAvg,
          });
          setStoreList(response.storeData.contents); // 매장 리스트
          setZoomLevel(16); // 줌 레벨
        } else {
          const response = await getZoneStoreListAPI(regionId, isZoneId, currentPage, 10, "RECOMMEND");
          console.log('수도권 구역 매장 목록: ', response);
          setTotalPages(response.storeData.totalPages);
          setCenterLatAndLng({ // 구역 중앙 좌표
            lat: response.latitudeAvg,
            lng: response.longitudeAvg,
          });
          setStoreList(response.storeData.contents); // 매장 리스트
          setZoomLevel(14); // 줌 레벨
        }
      } catch (error) {
        console.error('구역 매장 목록 데이터를 불러오는 중 오류 발생:', error);
      }
    };
    fetchData();
  }, [isZoneId, currentPage, regionId, setCenterLatAndLng, setStoreList, setZoomLevel]);

  // 페이지 이동
  const handlePageClick = (page) => {
    setCurrentPage(page);
  };
  // 이전 페이지 이동
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  // 다음 페이지 이동
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <ComponentWrapper>
      {/* 타이틀 영역 */}
      <TitleWrapper>
        <StationTitleWrapper>
          <StationTitle>
            {CapitalZoneName}
          </StationTitle>
          <StationDescription>
            총 {CapitalStoreCount}개의 매장, {CapitalThemeCount}개의 테마가 있습니다
          </StationDescription>
        </StationTitleWrapper>
        <StationListWrapper>
          {isZoneId > 0 && isZoneId < 17 ? (
            stationList.map((station, index) => (
              <StationList key={index}>
                {/* 호선 아이콘 렌더링 */}
                {station.stationLineList.map((line, lineIndex) => {
                  const LineIcon = stationLineConversion(line);
                  return LineIcon ? (
                    <StationLineIconWrapper key={lineIndex}>
                      <LineIcon />
                    </StationLineIconWrapper>
                  ) : null;
                })}

                {/* 역 이름 */}
                <StationListName>{station.stationName}</StationListName>
              </StationList>
            ))
          ) : null}
        </StationListWrapper>
      </TitleWrapper>

      {/* 리스트 영역 */}
      <ListWrapper>
        <ListTitleWrapper>
          <ListNumber>
            매장 목록 &#40;{CapitalStoreCount}&#41;
          </ListNumber>
          <FilterWrapper>
            <FilterName>
              추천 순
            </FilterName>
            <StyledDownArrowIcon/>
          </FilterWrapper>
        </ListTitleWrapper>
      </ListWrapper>
      {/* 매장 목록 */}
      <StoreList>
        {storeList.map((store, index) => (
        <ListItem
          key={index}
          onClick={() => {
            handleStoreSelect(store.storeId);
            setCenterLatAndLng({ lat: store.latitude, lng: store.longitude });
            setZoomLevel(18);
          }}
        >
          <ItemTitleWrapper>
            {store.isAwarded && <StyledAwardsIcon/>}
            <ItemName>
              {store.storeName}
            </ItemName>
            <ItemNumber>
              &#40;{store.themeCount}&#41;
            </ItemNumber>
          </ItemTitleWrapper>
          <ArrowWrapper>
            {(isZoneId === 0 || isZoneId > 16) &&
              Array.isArray(store.stationLineList) &&
              store.stationName && (
                <ListStationWrapper>
                  {store.stationLineList.map((line, lineIndex) => {
                    const LineIcon = stationLineConversion(line);
                    return LineIcon ? (
                      <StationLineIconWrapper key={lineIndex}>
                        <LineIcon />
                      </StationLineIconWrapper>
                    ) : null;
                  })}
                  <StationListName>
                    {store.stationName}
                  </StationListName>
                </ListStationWrapper>
              )}
            <StyledArrowIcon />
          </ArrowWrapper>
        </ListItem>
        ))}
      </StoreList>

      {/* 페이징 영역 */}
      <PagingWrapper>
        <StyledLeftArrowIcon
          hasNextPage={currentPage > 1}
          onClick={handlePrevPage}
        />
        <PageNumberWrapper>
          {[...Array(totalPages)].map((_, idx) => (
            <PageNumber
              key={idx}
              pageState={currentPage === idx + 1}
              onClick={() => handlePageClick(idx + 1)}
            >
              {idx + 1}
            </PageNumber>
          ))}
        </PageNumberWrapper>
        <StyledRightArrowIcon
          hasNextPage={currentPage < totalPages}
          onClick={handleNextPage}
        />
      </PagingWrapper>
    </ComponentWrapper>
  )
}

export default StationCard;

// CSS
const ComponentWrapper = styled.div`
  border-radius: 1.25em;
  padding: 1.875em 2.5em;
  box-sizing: border-box;
  display: flex;
  width: 34.375em;
  height: 55.375em;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.875em;
  flex-shrink: 0;
  background: var(--RIU_Monochrome-20, #F0F0F4);
  pointer-events: auto;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25em;
`;

const StationTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.625em;
`;

const StationTitle = styled.div`
  color: var(--RIU_Primary-600, #303281);
  text-align: center;
  font-family: 'Pretendard-Bold';
  font-size: 1.75em;
  line-height: normal;
`;

const StationDescription = styled.div`
  color: var(--RIU_Monochrome-600, #414152);
  text-align: center;
  font-family: 'Pretendard-Medium';
  font-size: 1em;
  line-height: normal;
`;

const StationListWrapper = styled.div`
  display: flex;
  width: 29em;
  height: 1.8125em;
  align-items: center;
  gap: 1.875em;
`;

const StationList = styled.div`
  display: flex;
  height: 1.8125em;
  align-items: center;
  gap: 0.375em;
`;

const StationLineIconWrapper = styled.div`
  width: 1.25em;
  height: 1.25em;
  svg {
    width: 100%;
    height: 100%;
  }
`;

const StationListName = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  text-align: center;
  font-family: 'Pretendard-Medium';
  font-size: 0.875em;
`;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25em;
  align-self: stretch;
`;

const ListTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;

const ListNumber = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  text-align: center;
  font-family: 'Pretendard-SemiBold';
  font-size: 1.125em;
  line-height: 1.25em;
`;

const FilterWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.375em;
  cursor: pointer;
`;

const FilterName = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: 'Pretendard-SemiBold';
  font-size: 0.875em;
  line-height: 1.25em;
`;

const StyledDownArrowIcon = styled(DownArrowIcon)`
  width: 1.25em;
  height: 1.25em;
`;

const StoreList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.625em;
  align-self: stretch;
`;

const ListItem = styled.div`
  border-radius: 3.125em;
  padding: 0em 1.25em;
  display: flex;
  height: 3.125em;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  background: var(--RIU_Monochrome-40, #DFDFE6);
  cursor: pointer;
`;

const ItemTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625em;
`;

const StyledAwardsIcon = styled(AwardsIcon)`
  width: 1.25em;
  height: 1.25em;
`;

const ItemName = styled.div`
  color: var(--RIU_Monochrome-400, #616277);
  font-family: 'Pretendard-Bold';;
  font-size: 1em;
  line-height: normal;
`;

const ItemNumber = styled.div`
  color: var(--RIU_Monochrome-100, #818496);
  font-family: 'Pretendard-Medium';
  font-size: 1em;
  line-height: normal;
`;

const ArrowWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625em;
`;

const ListStationWrapper = styled.div`
  display: flex;
  height: 1.8125em;
  align-items: center;
  gap: 0.375em;
`;

const StyledArrowIcon = styled(ArrowIcon)`
  width: 1.25em;
  height: 1.25em;
`;

const PagingWrapper = styled.div`
  display: flex;
  width: 29em;
  height: 100%;
  justify-content: space-between;
  align-items: end;
`;

const StyledLeftArrowIcon = styled(LeftArrowIcon)`
  width: 1.25em;
  height: 1.25em;
  fill: ${(props) => (props.hasNextPage) ? 'var(--RIU_Primary-300, #5B6ACC)' : 'var(--RIU_Monochrome-80, #A1A4B5)'};
  cursor: ${(props) => (props.hasNextPage) ? 'pointer' : 'default'};
`;
const StyledRightArrowIcon = styled(RightArrowIcon)`
  width: 1.25em;
  height: 1.25em;
  fill: ${(props) => (props.hasNextPage) ? 'var(--RIU_Primary-300, #5B6ACC)' : 'var(--RIU_Monochrome-80, #A1A4B5)'};
  cursor: ${(props) => (props.hasNextPage) ? 'pointer' : 'default'};
`;

const PageNumberWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.875em;
`;

const PageNumber = styled.div`
  color: ${(props) => (props.pageState) ? 'var(--RIU_Primary-300, #5B6ACC)' : 'var(--RIU_Monochrome-80, #A1A4B5)'};
  font-family: 'Pretendard-SemiBold';
  font-size: 0.875em;
  cursor: pointer;
`;
