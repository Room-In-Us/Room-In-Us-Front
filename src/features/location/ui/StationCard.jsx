import styled from "styled-components";
import DownArrowIcon from "../../../shared/assets/icons/location/downArrowIcon.svg?react";
import AwardsIcon from "../../../shared/assets/icons/common/awards.svg?react";
import ArrowIcon from "../../../shared/assets/icons/location/arrowIcon.svg?react";
import RightArrowIcon from "../../../shared/assets/icons/survey/rightArrowIcon.svg?react";
import LeftArrowIcon from "../../../shared/assets/icons/survey/leftArrowIcon.svg?react";
import { useRecoilState } from "recoil";
import { stationCardVisible, storeCardVisible } from "../../../features/location/model/locationAtom";

function StationCard() {
  // 상태 관리
  const [, setIsStationCardVisible] = useRecoilState(stationCardVisible);
  const [, setIsStoreCardVisible] = useRecoilState(storeCardVisible);
  
  // 임시 역 리스트
  const stationList = [
    { stationName: "역삼역", stationLineList: [2] },
    { stationName: "강남역", stationLineList: [2, 14] },
    { stationName: "신논현역", stationLineList: [9, 14] },
  ];

  // 임시 매장 리스트
  const storeList = [
    { name: "키이스케이프 메모리컴퍼니점", themeCount: 3 },
    { name: "단편선 강남", themeCount: 2 },
    { name: "제로월드 강남", themeCount: 9 },
    { name: "키이스케이프 우주라이크점", themeCount: 2 },
    { name: "비트포비아 강남던전", themeCount: 4 },
    { name: "키이스케이프 강남 더오름점", themeCount: 2 },
    { name: "제로월드 블랙 강남점", themeCount: 1 },
    { name: "키이스케이프 LOG_IN 1", themeCount: 2 },
    { name: "도어이스케이프 블루 신논현점", themeCount: 2 },
    { name: "비밀의 화원 리버타운 강남점", themeCount: 6 },
  ];

  // 매장 선택 핸들러
  const handleStoreSelect = () => {
    setIsStoreCardVisible(true);
    setIsStationCardVisible(false);
  };

  return (
    <ComponentWrapper>
      {/* 타이틀 영역 */}
      <TitleWrapper>
        <StationTitleWrapper>
          <StationTitle>
            강남
          </StationTitle>
          <StationDescription>
            총 48개의 매장, 176개의 테마가 있습니다
          </StationDescription>
        </StationTitleWrapper>
        <StationListWrapper>
          {stationList.map((station, index) => (
            <StationList key={index}>
              {/* 노선 번호 리스트 */}
              {station.stationLineList.map((line, lineIndex) => (
                <StationListName key={lineIndex}>
                  {line}
                </StationListName>
              ))}
              {/* 역 이름 */}
              <StationListName>
                {station.stationName}
              </StationListName>
            </StationList>
          ))}
        </StationListWrapper>
      </TitleWrapper>

      {/* 리스트 영역 */}
      <ListWrapper>
        <ListTitleWrapper>
          <ListNumber>
            매장 목록 &#40;48&#41;
          </ListNumber>
          <FilterWrapper>
            <FilterName>
              추천 순
            </FilterName>
            <StyledDownArrowIcon/>
          </FilterWrapper>
        </ListTitleWrapper>
      </ListWrapper>
      <StoreList>
        {storeList.map((store, index) => (
        <ListItem
          key={index}
          onClick={handleStoreSelect}
        >
          <ItemTitleWrapper>
            <StyledAwardsIcon/>
            <ItemName>
              {store.name}
            </ItemName>
            <ItemNumber>
              &#40;{store.themeCount}&#41;
            </ItemNumber>
          </ItemTitleWrapper>
          <StyledArrowIcon/>
        </ListItem>
        ))}
      </StoreList>

      {/* 페이징 영역 */}
      <PagingWrapper>
        <StyledLeftArrowIcon hasNextPage={false}/>
        <PageNumberWrapper>
          <PageNumber pageState={true}>1</PageNumber>
          <PageNumber pageState={false}>2</PageNumber>
          <PageNumber pageState={false}>3</PageNumber>
          <PageNumber pageState={false}>4</PageNumber>
          <PageNumber pageState={false}>5</PageNumber>
        </PageNumberWrapper>
        <StyledRightArrowIcon hasNextPage={true}/>
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
  align-items: center;
  gap: 1.875em;
`;

const StationList = styled.div`
  display: flex;
  height: 1.8125em;
  align-items: center;
  gap: 0.375em;
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

const StyledArrowIcon = styled(ArrowIcon)`
  width: 1.25em;
  height: 1.25em;
`;

const PagingWrapper = styled.div`
  display: flex;
  width: 29em;
  justify-content: space-between;
  align-items: center;
`;

const StyledLeftArrowIcon = styled(LeftArrowIcon)`
  width: 1.25em;
  height: 1.25em;
  fill: ${(props) => (props.hasNextPage) ? 'var(--RIU_Primary-300, #5B6ACC)' : 'var(--RIU_Monochrome-80, #A1A4B5)'};
  cursor: default;
`;
const StyledRightArrowIcon = styled(RightArrowIcon)`
  width: 1.25em;
  height: 1.25em;
  fill: ${(props) => (props.hasNextPage) ? 'var(--RIU_Primary-300, #5B6ACC)' : 'var(--RIU_Monochrome-80, #A1A4B5)'};
  cursor: pointer;
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
