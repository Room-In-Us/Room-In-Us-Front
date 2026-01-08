import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components"
import { getThemeDetailAPI } from "../../../themeDetail/api/themeDetailAPI";
import DefaultThumbnail from '../../../../shared/assets/images/common/thumbnailImg.png';
import BlueStar from "../../../../shared/assets/icons/themeDetail/blueStar.svg?react";
import { createReviewInfoItems } from "../../model/reviewDataList";
import useDevice from "../../../../shared/hooks/useDevice";
import { formatDateToDot } from "../../../../shared/utils/dataUtils";
import Pen from '../../../../shared/assets/icons/myPage/pen.svg?react';
import Trash from '../../../../shared/assets/icons/reviewWrite/trashicon.svg?react';
import { deleteMyReviewAPI } from "../../api/myReviewAPI";
import PopUpModal from '../../../../shared/components/PopUpModal';
import { useSetRecoilState } from "recoil";
import { reviewStateFamily } from "../../../themeDetail/model/reviewAtom";
import { getReviewDetailAPI } from "../../../reviewDetail/api/reviewDetailAPI";
import More from './../../../../shared/assets/icons/common/more.svg?react';
import ReviewActionDropDown from "./ReviewActionDropDown";

export default function ReviewCard({ data, onDeleted, onEdit }) {

  const { isMobile } = useDevice();
  const navigate = useNavigate();
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const moreRef = useRef(null);

  const {
    reviewId,
    themeId,
    storeName,
    themeName,
    satisfactionLevel,
    reviewComment,
    playedAt,
    createdAt,
    isEscaped,
    usedHint,
    remainingTime,
    participantCnt,
    review
  } = data;

  const infoItems = createReviewInfoItems({
    review,
    participantCnt,
    usedHint,
    remainingTime,
    isEscaped
  });

  const setReviewData = useSetRecoilState(reviewStateFamily(themeId));

  useEffect(() => {
    if (!themeId) return;

    getThemeDetailAPI(themeId)
      .then((themeData) => {
        setThumbnailUrl(themeData.img);
      })
      .catch((error) => {
        console.error('썸네일 로딩 실패:', error);
        setThumbnailUrl(null);
      });
  }, [themeId]);

  const handleDelete = async () => {
    setIsOpen(false);
    try {
      await deleteMyReviewAPI(themeId, reviewId);
      setIsDeleteSuccess(true);
    } catch (error) {
      console.error('[ReviewCard] 후기 삭제 실패:', error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleEdit = async () => {
    setIsOpen(false);
    try {
      const themeData = await getThemeDetailAPI(themeId);
      const reviewDetail = await getReviewDetailAPI(themeId, reviewId);
      console.log("[ReviewCard] reviewDetail:", reviewDetail);

      // null 상태 기반으로 토글 체크박스 상태 복원
      const uiState = {
        checkedDate: reviewDetail.playedAt === null,
        checkedHint: reviewDetail.usedHint === null,
        checkedPeople:
          reviewDetail.minRecommendedHeadcount === null &&
          reviewDetail.maxRecommendedHeadcount === null,
      };

      const mergedData = {
        ...reviewDetail,
        img: themeData.img || "",
        uiState,
      };

      setReviewData(mergedData);

      onEdit({
        ...mergedData,
        themeName: themeName,
        storeName: storeName,
      });
    } catch (error) {
      console.error("[ReviewCard] 후기 수정 모드 진입 실패:", error);
      alert("후기 정보를 불러오는 중 오류가 발생했습니다.");
    }
  };

  return (
    <Wrapper>
      <Img src={thumbnailUrl || DefaultThumbnail} />

      {isMobile && (
        <MoreWrapper ref={moreRef}>
          <MoreIcon onClick={() => setIsOpen((v) => !v)} />

          <ReviewActionDropDown
            isOpen={isOpen}
            anchorRef={moreRef}
            onEdit={handleEdit}
            onDelete={() => {
              setIsOpen(false);          
              setIsDeleteSuccess(false);  
              setIsDeleteModalOpen(true);  
            }}
            onClose={() => setIsOpen(false)}
          />
        </MoreWrapper>
      )}

      <ItemsBox>
        { !isMobile && (
        <>
          <RoomLocation>{storeName || '지점명'}</RoomLocation>
          <RoomTitleWrapper>
            <RoomTitle>{themeName || '테마명'}</RoomTitle>
            <StarRateBox>
              <StarIcon />
              <RateValue>{satisfactionLevel?.toFixed(1) || '0.0'}</RateValue>
            </StarRateBox>
          </RoomTitleWrapper>
        </>
        )}
        {isMobile && (
        <RoomInfoWrapper>
          <RoomLocation>{storeName || '지점명'}</RoomLocation>
          <RoomTitleWrapper>
            <RoomTitle>{themeName || '테마명'}</RoomTitle>
            <StarRateBox>
              <StarIcon />
              <RateValue>{satisfactionLevel?.toFixed(1) || '0.0'}</RateValue>
            </StarRateBox>
          </RoomTitleWrapper>
        </RoomInfoWrapper>
        )}
        <ReviewInfoBox>
        {infoItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <ReviewInfo key={index}>
              <ReviewIcon><IconComponent /></ReviewIcon>
              { !isMobile && (
                <ReviewMenu>{item.label || '메뉴'}</ReviewMenu>
              )}
              <ReviewAnswer>{item.value || '-'}</ReviewAnswer>
            </ReviewInfo>
          );
        })}
        </ReviewInfoBox>
        <ReviewDetail>{reviewComment || '-'}</ReviewDetail>
        <DateBox>
          <Date>방문일자 : {formatDateToDot(playedAt) || '-'}</Date>
          <Date>작성일자 : {formatDateToDot(createdAt) || '-'}</Date>
        </DateBox>
        { !isMobile && (
          <BtnWrapper>
            <Btn onClick={() => navigate(`/theme/${themeId}/review/${reviewId}`)}>
              <BtnText>
                후기 상세보기
              </BtnText>
            </Btn>
            <ModifyBtn onClick={handleEdit}><PenIcon /></ModifyBtn>
            <ModifyBtn onClick={() => setIsDeleteModalOpen(true)}><TrashIcon /></ModifyBtn>
          </BtnWrapper>
        )}
      </ItemsBox>
      <PopUpModal
        isOpen={isDeleteModalOpen}
        title={isDeleteSuccess ? "삭제 완료" : "후기 삭제"}
        message={isDeleteSuccess ? "후기가 삭제되었습니다." : "이 후기를 삭제하시겠습니까?"}
        subMessage={isDeleteSuccess ? null : "삭제 후에는 복구할 수 없습니다."}
        confirmText={isDeleteSuccess ? "확인" : "삭제"}
        cancelText={isDeleteSuccess ? null : "취소"}
        showCancel={!isDeleteSuccess}
        onConfirm={() => {
          if (isDeleteSuccess) {
            setIsDeleteModalOpen(false);
            setIsDeleteSuccess(false);
            onDeleted(reviewId);
          } else {
            handleDelete();
          }
        }}
        onCancel={() => {
          if (!isDeleteSuccess) setIsDeleteModalOpen(false);
        }}
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  padding: 0.875em;
  align-items: flex-start;
  gap: 1.25em;
  border-radius: 0.625em;
  border: 1px solid var(--RIU_Monochrome-50, #D6D6DF);
  background: var(--RIU_Monochrome-10, #F9F9FB);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.625em;
  }
`;

const Img = styled.img`
  width: 10em;
  height: 10em;
  border-radius: 0.5625em;
  border: 0.75px solid #87ADB5;
  background: url(<path-to-image>) lightgray 50% / cover no-repeat, url(<path-to-image>) lightgray 50% / cover no-repeat;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 8.75em;
    height: 8.75em;
  }
`;

const ItemsBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.625em;
  box-sizing: border-box;
`;

const RoomLocation = styled.div`
  color: var(--RIU_Monochrome-300, #696C7E);
  font-family: Pretendard-Bold;
  font-size: 0.875em;

  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;

const RoomTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const RoomInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25em;
  width: 100%;
`;

const RoomTitle = styled.div`
  color: var(--RIU_Primary-500, #4648A7);
  font-family: Pretendard-ExtraBold;
  font-size: 1em;
`;

const StarRateBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25em;
`;

const StarIcon = styled(BlueStar)`
  display: flex;
  width: 1.25em;
  height: 1.25em;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    width: 0.9375em;
    height: 0.9375em;
  }
`;

const RateValue = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: Pretendard-SemiBold;
  font-size: 1.125em;

  @media (max-width: 768px) {
    font-size: 1em;
  }
`;

const ReviewInfoBox = styled.div`
  display: flex;
  padding: 0.5em;
  gap: 0.5em;
  justify-content: space-between;
  align-items: flex-start;
  border-radius: 0.625em;
  background: var(--RIU_Monochrome-30, #E7E8ED);
`;

const ReviewInfo = styled.div`
  display: flex;
  width: 3.9375em;
  padding: 0.5em 0.625em;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.25em;
  border-radius: 0.25em;
  background: var(--RIU_Monochrome-10, #F9F9FB);
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: 3em;
    height: 3em;
    padding: 0.25em 0.5em;
    gap: 0.125em;
  }
`;

const ReviewIcon = styled.div`
  display: flex;
  width: 1.5625em;
  height: 1.5625em;
  justify-content: center;
  align-items: center;
`;

const ReviewMenu = styled.div`
  color: var(--RIU_Monochrome-100, #818496);
  font-family: Pretendard-SemiBold;
  font-size: 0.5625rem;
`;

const ReviewAnswer = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: Pretendard-SemiBold;
  font-size: 0.625em;

  @media (max-width: 768px) {
    font-size: 0.5rem;
  }
`;

const ReviewDetail = styled.div`
  color: var(--RIU_Monochrome-400, #616277);
  font-family: Pretendard-Medium;
  font-size: 0.875em;

  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;

const DateBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25em;
`;

const Date = styled.div`
  color: var(--RIU_Monochrome-90, #9192A5);
  font-family: Pretendard-Medium;
  font-size: 0.75em;

  @media (max-width: 768px) {
    font-size: 0.625em;
  }
`;

const BtnWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  align-self: stretch;
`;

const Btn = styled.div`
  display: flex;
  flex: 1;
  height: 2.5em;
  padding: 0.875em 0em;
  justify-content: center;
  align-items: center;
  gap: 0.625em;
  border-radius: 2.5em;
  background: var(--RIU_Primary-0, #E8EAFF);
  box-sizing: border-box;
  cursor: pointer;
`;

const BtnText = styled.div`
  color: var(--RIU_Primary-100, #718FF2);
  font-family: Pretendard-Bold;
  font-size: 0.875em;
`;

const ModifyBtn = styled.div`
  display: flex;
  width: 2.5em;
  height: 2.5em;
  padding: 0.875em 0;
  justify-content: center;
  align-items: center;
  gap: 0.625em;
  border-radius: 2.5em;
  border: 1px solid var(--RIU_Monochrome-80, #A1A4B5);
  background: var(--RIU_Monochrome-10, #F9F9FB);
  box-sizing: border-box;
  cursor: pointer;
`;

const PenIcon = styled(Pen)`
  display: flex;
  width: 1.25em;
  height: 1.25em;
  justify-content: center;
  align-items: center;

  path {
    fill: #717486;
  }
`;

const TrashIcon = styled(Trash)`
  display: flex;
  width: 1.75em;
  height: 1.75em;
  justify-content: center;
  align-items: center;
  object-fit: contain;

  path {
    fill: #717486;
  }
`;

const MoreWrapper = styled.div`
  position: absolute;
  top: 0.875em; 
  right: 0.875em; 
`;

const MoreIcon = styled(More)`
  display: flex;
  width: 1rem;
  height: 1rem;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;

  path {
    fill: #717486;
  }
`;