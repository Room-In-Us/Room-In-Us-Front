import { useEffect, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import ThumbnailImg from '../shared/assets/images/common/thumbnailImg.png';
import {
  formatDateToDot,
  mapRecommendedHeadcount,
  reviewEnumConversion,
} from '../shared/utils/dataUtils';

const sampleReview = {
  themeName: '비밀의 화원',
  storeName: '루미너스 강남점',
  review: 'FLOWER_GARDEN',
  satisfactionLevel: 4.5,
  playedAt: '2026-05-28',
  isEscaped: true,
  remainingTime: '00:12:34',
  usedHint: 2,
  participantList: [
    { proficiency: 'SENIOR', remark: '', isOwner: true },
    { proficiency: 'JUNIOR', remark: '', isOwner: false },
  ],
  minRecommendedHeadcount: 2,
  maxRecommendedHeadcount: 4,
};

const templates = [
  {
    id: 'center-badge',
    name: '센터 배지',
    description: '테마명과 총평을 정중앙에 압축',
  },
  {
    id: 'bottom-record',
    name: '하단 기록',
    description: '사진은 크게, 기록은 하단에 안정적으로',
  },
  {
    id: 'poster',
    name: '포스터',
    description: '방탈출 포스터처럼 강한 제목형',
  },
  {
    id: 'corner-stamp',
    name: '코너 스탬프',
    description: '사진 위에 붙인 작은 엽서 카드',
  },
  {
    id: 'date-card',
    name: '날짜 카드',
    description: '방문일과 탈출 결과를 선명하게',
  },
  {
    id: 'minimal',
    name: '미니멀',
    description: '사진 감상을 방해하지 않는 얇은 정보',
  },
  {
    id: 'score-grid',
    name: '스코어 그리드',
    description: '별점, 힌트, 인원 정보를 한 번에',
  },
  {
    id: 'film',
    name: '필름 로그',
    description: '상하단 필름 프레임으로 기록감 강조',
  },
];

function ReviewPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id);
  const [uploadedImage, setUploadedImage] = useState('');
  const [backgroundMode, setBackgroundMode] = useState('theme');

  const selected = templates.find((template) => template.id === selectedTemplate) ?? templates[0];
  const backgroundImage = backgroundMode === 'upload' && uploadedImage ? uploadedImage : ThumbnailImg;

  const displayData = useMemo(() => {
    const memberCount = sampleReview.participantList.length;
    const remainingTime = formatRemainingTime(sampleReview.remainingTime);
    const result = sampleReview.isEscaped === null
      ? '기록 없음'
      : sampleReview.isEscaped
        ? '탈출 성공'
        : '탈출 실패';

    return {
      themeName: sampleReview.themeName,
      storeName: sampleReview.storeName,
      review: reviewEnumConversion(sampleReview.review),
      playedAt: formatDateToDot(sampleReview.playedAt),
      remainingTime,
      result,
      usedHint: sampleReview.usedHint === null ? '-' : `${sampleReview.usedHint} hint`,
      satisfaction: sampleReview.satisfactionLevel ? sampleReview.satisfactionLevel.toFixed(1) : '-',
      participantCount: `${memberCount}인`,
      recommendedHeadcount: mapRecommendedHeadcount(
        sampleReview.minRecommendedHeadcount,
        sampleReview.maxRecommendedHeadcount,
      ),
    };
  }, []);

  useEffect(() => {
    return () => {
      if (uploadedImage) URL.revokeObjectURL(uploadedImage);
    };
  }, [uploadedImage]);

  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const nextUrl = URL.createObjectURL(file);
    setUploadedImage((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return nextUrl;
    });
    setBackgroundMode('upload');
  };

  return (
    <PageWrapper>
      <Toolbar>
        <TitleGroup>
          <Title>방탈출 후기 템플릿</Title>
          <SubTitle>후기 기록을 사진 위에 얹어 공유 이미지처럼 확인할 수 있어요.</SubTitle>
        </TitleGroup>
        <ActionGroup>
          <SegmentedControl>
            <SegmentButton
              type="button"
              $active={backgroundMode === 'theme'}
              onClick={() => setBackgroundMode('theme')}
            >
              테마 사진
            </SegmentButton>
            <UploadButton $active={backgroundMode === 'upload'}>
              사진 업로드
              <FileInput type="file" accept="image/*" onChange={handleUpload} />
            </UploadButton>
          </SegmentedControl>
        </ActionGroup>
      </Toolbar>

      <Workspace>
        <PreviewPanel>
          <PreviewHeader>
            <PanelLabel>미리보기</PanelLabel>
            <TemplateName>{selected.name}</TemplateName>
          </PreviewHeader>
          <RecordCanvas $backgroundImage={backgroundImage}>
            <Overlay $template={selectedTemplate}>
              <TemplateContent templateId={selectedTemplate} data={displayData} />
            </Overlay>
          </RecordCanvas>
        </PreviewPanel>

        <TemplatePanel>
          <PanelLabel>템플릿</PanelLabel>
          <TemplateGrid>
            {templates.map((template) => (
              <TemplateButton
                key={template.id}
                type="button"
                $active={selectedTemplate === template.id}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <TemplateThumb $backgroundImage={backgroundImage}>
                  <MiniOverlay $template={template.id}>
                    <TemplateContent templateId={template.id} data={displayData} compact />
                  </MiniOverlay>
                </TemplateThumb>
                <TemplateMeta>
                  <TemplateTitle>{template.name}</TemplateTitle>
                  <TemplateDescription>{template.description}</TemplateDescription>
                </TemplateMeta>
              </TemplateButton>
            ))}
          </TemplateGrid>
        </TemplatePanel>
      </Workspace>
    </PageWrapper>
  );
}

function TemplateContent({ templateId, data, compact = false }) {
  const statItems = [
    { label: 'DATE', value: data.playedAt },
    { label: 'TIME', value: data.remainingTime },
    { label: 'HINT', value: data.usedHint },
  ];

  if (templateId === 'center-badge') {
    return (
      <CenterBadge $compact={compact}>
        <SmallLabel>ROOM IN US</SmallLabel>
        <ThemeName>{data.themeName}</ThemeName>
        <ReviewChip>{data.review}</ReviewChip>
        <MetaLine>{data.playedAt} · {data.remainingTime}</MetaLine>
      </CenterBadge>
    );
  }

  if (templateId === 'bottom-record') {
    return (
      <BottomRecord $compact={compact}>
        <RecordTitle>{data.themeName}</RecordTitle>
        <RecordStats>
          {statItems.map((item) => (
            <StatBlock key={item.label}>
              <StatLabel>{item.label}</StatLabel>
              <StatValue>{item.value}</StatValue>
            </StatBlock>
          ))}
        </RecordStats>
      </BottomRecord>
    );
  }

  if (templateId === 'poster') {
    return (
      <PosterBlock $compact={compact}>
        <PosterDate>{data.playedAt}</PosterDate>
        <PosterTitle>{data.themeName}</PosterTitle>
        <PosterReview>{data.review}</PosterReview>
        <PosterFooter>{data.result} · {data.satisfaction}</PosterFooter>
      </PosterBlock>
    );
  }

  if (templateId === 'corner-stamp') {
    return (
      <CornerStamp $compact={compact}>
        <PostcardTop>
          <PostcardLabel>POST CARD</PostcardLabel>
          <PostageStamp>{data.satisfaction}</PostageStamp>
        </PostcardTop>
        <PostcardBody>
          <StampTitle>{data.themeName}</StampTitle>
          <PostcardDivider />
          <StampText>{data.review}</StampText>
          <StampMeta>{data.playedAt} · {data.remainingTime}</StampMeta>
        </PostcardBody>
      </CornerStamp>
    );
  }

  if (templateId === 'date-card') {
    return (
      <DateCard $compact={compact}>
        <DateText>{data.playedAt}</DateText>
        <DateTheme>{data.themeName}</DateTheme>
        <DateResult>{data.result}</DateResult>
      </DateCard>
    );
  }

  if (templateId === 'minimal') {
    return (
      <MinimalLine $compact={compact}>
        <MinimalTitle>{data.themeName}</MinimalTitle>
        <MinimalMeta>{data.review} / {data.remainingTime}</MinimalMeta>
      </MinimalLine>
    );
  }

  if (templateId === 'score-grid') {
    return (
      <ScoreGrid $compact={compact}>
        <ScoreTitle>{data.themeName}</ScoreTitle>
        <ScoreRows>
          <ScoreItem><span>평점</span><strong>{data.satisfaction}</strong></ScoreItem>
          <ScoreItem><span>인원</span><strong>{data.participantCount}</strong></ScoreItem>
          <ScoreItem><span>추천</span><strong>{data.recommendedHeadcount}</strong></ScoreItem>
          <ScoreItem><span>힌트</span><strong>{data.usedHint}</strong></ScoreItem>
        </ScoreRows>
      </ScoreGrid>
    );
  }

  return (
    <FilmLog $compact={compact}>
      <FilmTop>{data.storeName}</FilmTop>
      <FilmCenter>{data.themeName}</FilmCenter>
      <FilmBottom>{data.playedAt} · {data.review} · {data.remainingTime}</FilmBottom>
    </FilmLog>
  );
}

function formatRemainingTime(timeString) {
  if (!timeString) return '-';
  const [, minutes = '00', seconds = '00'] = timeString.split(':');
  return `${minutes}'${seconds}"`;
}

export default ReviewPage;

const PageWrapper = styled.main`
  width: min(70rem, calc(100vw - 2rem));
  margin: 7.5rem auto 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 768px) {
    width: min(22.5rem, calc(100vw - 1.5rem));
    margin-top: 5rem;
  }
`;

const Toolbar = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;

  @media (max-width: 768px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Title = styled.h1`
  margin: 0;
  color: #35384a;
  font-family: Pretendard-Bold;
  font-size: 1.75rem;
`;

const SubTitle = styled.p`
  margin: 0;
  color: #696c7e;
  font-family: Pretendard-Regular;
  font-size: 0.95rem;
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
`;

const SegmentedControl = styled.div`
  display: flex;
  padding: 0.25rem;
  border: 1px solid #c4c6d1;
  border-radius: 0.5rem;
  background: #f9f9fb;
`;

const segmentStyle = css`
  position: relative;
  border: 0;
  border-radius: 0.375rem;
  padding: 0.625rem 0.875rem;
  color: ${({ $active }) => ($active ? '#f9f9fb' : '#515467')};
  background: ${({ $active }) => ($active ? '#718ff2' : 'transparent')};
  font-family: Pretendard-Bold;
  font-size: 0.8125rem;
  line-height: 1;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
`;

const SegmentButton = styled.button`
  ${segmentStyle}
`;

const UploadButton = styled.label`
  ${segmentStyle}
  overflow: hidden;
`;

const FileInput = styled.input`
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
`;

const Workspace = styled.section`
  display: grid;
  grid-template-columns: minmax(20rem, 29rem) 1fr;
  gap: 1.5rem;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const PreviewPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`;

const PreviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PanelLabel = styled.div`
  color: #515467;
  font-family: Pretendard-Bold;
  font-size: 1rem;
`;

const TemplateName = styled.div`
  color: #818496;
  font-family: Pretendard-Medium;
  font-size: 0.875rem;
`;

const RecordCanvas = styled.div`
  aspect-ratio: 1 / 1;
  width: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 0.5rem;
  background-image: ${({ $backgroundImage }) =>
    `linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.45)), url(${$backgroundImage})`};
  background-size: cover;
  background-position: center;
  box-shadow: 0 1rem 2.5rem rgba(53, 56, 74, 0.18);
`;

const TemplatePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`;

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.875rem;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const TemplateButton = styled.button`
  display: grid;
  grid-template-columns: 6rem 1fr;
  gap: 0.75rem;
  align-items: center;
  border: 1px solid ${({ $active }) => ($active ? '#718ff2' : '#d6d6df')};
  border-radius: 0.5rem;
  padding: 0.625rem;
  background: ${({ $active }) => ($active ? '#f3f5ff' : '#f9f9fb')};
  text-align: left;
  cursor: pointer;
  box-shadow: ${({ $active }) => ($active ? '0 0 0 2px rgba(113,143,242,0.16)' : 'none')};
`;

const TemplateThumb = styled.div`
  aspect-ratio: 1 / 1;
  position: relative;
  overflow: hidden;
  border-radius: 0.375rem;
  background-image: ${({ $backgroundImage }) =>
    `linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.52)), url(${$backgroundImage})`};
  background-size: cover;
  background-position: center;
`;

const TemplateMeta = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const TemplateTitle = styled.div`
  color: #35384a;
  font-family: Pretendard-Bold;
  font-size: 0.875rem;
`;

const TemplateDescription = styled.div`
  color: #818496;
  font-family: Pretendard-Regular;
  font-size: 0.75rem;
  line-height: 1.35;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  color: #f9f9fb;
  text-shadow: 0 0.125rem 0.875rem rgba(0, 0, 0, 0.45);
  ${({ $template }) => getTemplatePlacement($template)}
`;

const MiniOverlay = styled(Overlay)`
  transform: scale(0.38);
  transform-origin: center;
  inset: -80%;
`;

function getTemplatePlacement(template) {
  const placements = {
    'center-badge': css`align-items: center; justify-content: center;`,
    'bottom-record': css`align-items: flex-end; justify-content: stretch;`,
    poster: css`align-items: stretch; justify-content: stretch;`,
    'corner-stamp': css`align-items: flex-end; justify-content: flex-end;`,
    'date-card': css`align-items: flex-start; justify-content: flex-start;`,
    minimal: css`align-items: flex-end; justify-content: flex-start;`,
    'score-grid': css`align-items: center; justify-content: center;`,
    film: css`align-items: stretch; justify-content: stretch;`,
  };

  return placements[template] ?? placements['center-badge'];
}

const compactScale = css`
  ${({ $compact }) =>
    $compact &&
    css`
      transform: scale(0.92);
    `}
`;

const CenterBadge = styled.div`
  width: 68%;
  min-height: 42%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  border: 1px solid rgba(249, 249, 251, 0.5);
  border-radius: 999rem;
  background: rgba(10, 12, 18, 0.42);
  backdrop-filter: blur(10px);
  ${compactScale}
`;

const SmallLabel = styled.div`
  font-family: Pretendard-Bold;
  font-size: 0.7rem;
  letter-spacing: 0;
  opacity: 0.82;
`;

const ThemeName = styled.div`
  max-width: 86%;
  overflow-wrap: anywhere;
  text-align: center;
  font-family: Pretendard-Black;
  font-size: 2rem;
  line-height: 1.1;
`;

const ReviewChip = styled.div`
  padding: 0.45rem 0.75rem;
  border-radius: 999rem;
  background: #f9f9fb;
  color: #35384a;
  font-family: Pretendard-Bold;
  font-size: 0.8rem;
  text-shadow: none;
`;

const MetaLine = styled.div`
  font-family: Pretendard-Bold;
  font-size: 0.85rem;
`;

const BottomRecord = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.78));
  ${compactScale}
`;

const RecordTitle = styled.div`
  font-family: Pretendard-Black;
  font-size: 2rem;
  line-height: 1.05;
`;

const RecordStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.5rem;
`;

const StatBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const StatLabel = styled.div`
  color: rgba(249, 249, 251, 0.68);
  font-family: Pretendard-Bold;
  font-size: 0.7rem;
`;

const StatValue = styled.div`
  font-family: Pretendard-Black;
  font-size: 1rem;
`;

const PosterBlock = styled.div`
  width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(90deg, rgba(6, 9, 20, 0.72), transparent 72%);
  ${compactScale}
`;

const PosterDate = styled.div`
  font-family: Pretendard-Bold;
  font-size: 1rem;
`;

const PosterTitle = styled.div`
  max-width: 72%;
  overflow-wrap: anywhere;
  font-family: Pretendard-Black;
  font-size: 3rem;
  line-height: 1;
`;

const PosterReview = styled.div`
  width: fit-content;
  padding: 0.5rem 0.75rem;
  border: 1px solid rgba(249, 249, 251, 0.6);
  border-radius: 0.375rem;
  font-family: Pretendard-Bold;
`;

const PosterFooter = styled.div`
  font-family: Pretendard-Bold;
`;

const CornerStamp = styled.div`
  margin: 1.5rem;
  width: 13.75rem;
  min-height: 9rem;
  padding: 0.85rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.75rem;
  border: 1px solid rgba(53, 56, 74, 0.22);
  border-radius: 0.5rem;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(239, 241, 247, 0.84)),
    repeating-linear-gradient(0deg, transparent 0 0.7rem, rgba(113, 143, 242, 0.09) 0.7rem 0.75rem);
  color: #35384a;
  text-shadow: none;
  box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, 0.18);
  transform: rotate(-2deg);
  ${compactScale}
`;

const PostcardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const PostcardLabel = styled.div`
  color: #718ff2;
  font-family: Pretendard-Black;
  font-size: 0.72rem;
`;

const PostageStamp = styled.div`
  width: 2.45rem;
  height: 2.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed rgba(53, 56, 74, 0.45);
  border-radius: 0.18rem;
  color: #515467;
  font-family: Pretendard-Black;
  font-size: 0.78rem;
  background: rgba(249, 249, 251, 0.72);
`;

const PostcardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const PostcardDivider = styled.div`
  width: 100%;
  height: 1px;
  background: repeating-linear-gradient(
    90deg,
    rgba(53, 56, 74, 0.28) 0 0.5rem,
    transparent 0.5rem 0.75rem
  );
`;

const StampTitle = styled.div`
  font-family: Pretendard-Black;
  font-size: 1.25rem;
  line-height: 1.08;
  overflow-wrap: anywhere;
`;

const StampText = styled.div`
  color: #515467;
  font-family: Pretendard-Bold;
  font-size: 0.82rem;
`;

const StampMeta = styled.div`
  color: #818496;
  font-family: Pretendard-Bold;
  font-size: 0.72rem;
`;

const DateCard = styled.div`
  margin: 1.5rem;
  width: 13rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border-radius: 0.5rem;
  background: rgba(249, 249, 251, 0.9);
  color: #35384a;
  text-shadow: none;
  ${compactScale}
`;

const DateText = styled.div`
  color: #718ff2;
  font-family: Pretendard-Black;
  font-size: 1.3rem;
`;

const DateTheme = styled.div`
  font-family: Pretendard-Black;
  font-size: 1.65rem;
  line-height: 1.08;
`;

const DateResult = styled.div`
  color: #515467;
  font-family: Pretendard-Bold;
`;

const MinimalLine = styled.div`
  margin: 1.5rem;
  padding: 0.75rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  border-top: 1px solid rgba(249, 249, 251, 0.72);
  border-bottom: 1px solid rgba(249, 249, 251, 0.72);
  ${compactScale}
`;

const MinimalTitle = styled.div`
  font-family: Pretendard-Black;
  font-size: 1.25rem;
`;

const MinimalMeta = styled.div`
  font-family: Pretendard-Bold;
  font-size: 0.875rem;
  color: rgba(249, 249, 251, 0.82);
`;

const ScoreGrid = styled.div`
  width: 70%;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 0.5rem;
  background: rgba(10, 12, 18, 0.58);
  backdrop-filter: blur(8px);
  ${compactScale}
`;

const ScoreTitle = styled.div`
  font-family: Pretendard-Black;
  font-size: 1.55rem;
  text-align: center;
`;

const ScoreRows = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
`;

const ScoreItem = styled.div`
  min-height: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.2rem;
  border: 1px solid rgba(249, 249, 251, 0.24);
  border-radius: 0.375rem;

  span {
    color: rgba(249, 249, 251, 0.68);
    font-family: Pretendard-Bold;
    font-size: 0.75rem;
  }

  strong {
    max-width: 100%;
    overflow-wrap: anywhere;
    text-align: center;
    font-family: Pretendard-Black;
    font-size: 1rem;
  }
`;

const FilmLog = styled.div`
  width: 100%;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background:
    linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0 16%, transparent 16% 84%, rgba(0, 0, 0, 0.8) 84% 100%);
  ${compactScale}
`;

const FilmTop = styled.div`
  font-family: Pretendard-Bold;
  font-size: 0.95rem;
`;

const FilmCenter = styled.div`
  align-self: center;
  max-width: 78%;
  overflow-wrap: anywhere;
  text-align: center;
  font-family: Pretendard-Black;
  font-size: 2.6rem;
  line-height: 1.05;
`;

const FilmBottom = styled.div`
  align-self: flex-end;
  font-family: Pretendard-Bold;
  font-size: 0.9rem;
`;
