import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import ThumbnailImg from '../shared/assets/images/common/thumbnailImg.png';
import ShareIcon from '../shared/assets/icons/themeDetail/shareIcon.svg?react';
import CopyIcon from '../shared/assets/icons/location/copyIcon.svg?react';
import CloseIcon from '../shared/assets/icons/common/cancelIcon.svg?react';
import { formatDateToDot, mapRecommendedHeadcount, reviewEnumConversion } from '../shared/utils/dataUtils';

const fallbackReview = {
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

function ReviewSharePage() {
  const { state } = useLocation();
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id);
  const [uploadedImage, setUploadedImage] = useState('');
  const [backgroundMode, setBackgroundMode] = useState('theme');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSharePending, setIsSharePending] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const [shareMessageTone, setShareMessageTone] = useState('default');

  const selected = templates.find((template) => template.id === selectedTemplate) ?? templates[0];
  const reviewData = state?.reviewData ?? fallbackReview;
  const [themeImageUrl, setThemeImageUrl] = useState(reviewData.thumbnailUrl || ThumbnailImg);
  const backgroundImage = backgroundMode === 'upload' && uploadedImage ? uploadedImage : themeImageUrl;

  const displayData = useMemo(() => {
    const memberCount = Array.isArray(reviewData.participantList)
      ? reviewData.participantList.length
      : reviewData.participantCnt;
    const remainingTime = formatRemainingTime(reviewData.remainingTime);
    const result = reviewData.isEscaped == null ? '기록 없음' : reviewData.isEscaped ? '탈출 성공' : '탈출 실패';
    const satisfaction =
      typeof reviewData.satisfactionLevel === 'number' && !Number.isNaN(reviewData.satisfactionLevel)
        ? reviewData.satisfactionLevel.toFixed(1)
        : '-';

    return {
      themeName: reviewData.themeName,
      storeName: reviewData.storeName,
      review: reviewEnumConversion(reviewData.review),
      playedAt: formatDateToDot(reviewData.playedAt),
      remainingTime,
      result,
      usedHint: reviewData.usedHint === null || reviewData.usedHint === undefined ? '-' : `${reviewData.usedHint} hint`,
      satisfaction,
      participantCount: memberCount ? `${memberCount}인` : '-',
      recommendedHeadcount: mapRecommendedHeadcount(
        reviewData.minRecommendedHeadcount,
        reviewData.maxRecommendedHeadcount,
      ),
    };
  }, [reviewData]);

  useEffect(() => {
    if (!reviewData.thumbnailUrl) {
      setThemeImageUrl(ThumbnailImg);
      return;
    }

    setThemeImageUrl(reviewData.thumbnailUrl);
  }, [reviewData.thumbnailUrl]);

  useEffect(() => {
    return () => {
      if (uploadedImage) URL.revokeObjectURL(uploadedImage);
    };
  }, [uploadedImage]);

  const handleThemeImageError = () => {
    setThemeImageUrl(ThumbnailImg);
  };

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

  const updateShareMessage = (message, tone = 'default') => {
    setShareMessage(message);
    setShareMessageTone(tone);
  };

  const handleOpenShareModal = () => {
    updateShareMessage('지원 기기에서는 바로 공유할 수 있고, 그렇지 않으면 다운로드로 이어져요.');
    setIsShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    if (isSharePending) return;
    setIsShareModalOpen(false);
    updateShareMessage('');
  };

  const handleImageDownload = async () => {
    setIsSharePending(true);
    updateShareMessage('이미지를 만드는 중이에요.', 'default');

    try {
      const blob = await exportReviewImage({
        templateId: selectedTemplate,
        data: displayData,
        backgroundImage,
      });
      downloadBlob(blob, createShareFileName(displayData.themeName, selectedTemplate));
      updateShareMessage('이미지를 다운로드했어요.', 'success');
    } catch (error) {
      console.error('[ReviewSharePage] 이미지 다운로드 실패:', error);
      updateShareMessage('이미지 다운로드에 실패했어요. 잠시 후 다시 시도해 주세요.', 'error');
    } finally {
      setIsSharePending(false);
    }
  };

  const handleInstagramStoryShare = async () => {
    setIsSharePending(true);
    updateShareMessage('공유를 준비하고 있어요.', 'default');

    try {
      const blob = await exportReviewImage({
        templateId: selectedTemplate,
        data: displayData,
        backgroundImage,
      });
      const shareFile = new File([blob], createShareFileName(displayData.themeName, selectedTemplate), {
        type: 'image/png',
      });

      if (navigator.share && navigator.canShare?.({ files: [shareFile] })) {
        await navigator.share({
          files: [shareFile],
          title: `${displayData.themeName} 후기 공유`,
          text: 'ROOM IN US에서 만든 후기 이미지를 공유해 보세요.',
        });
        updateShareMessage('공유 메뉴가 열렸어요. 원하는 앱을 선택해 주세요.', 'success');
        return;
      }

      downloadBlob(blob, shareFile.name);
      updateShareMessage('이 기기에서는 직접 공유가 어려워 먼저 이미지를 저장했어요.', 'default');
    } catch (error) {
      if (error?.name === 'AbortError') {
        updateShareMessage('공유가 취소되었어요.', 'default');
      } else {
        console.error('[ReviewSharePage] 인스타 공유 실패:', error);
        updateShareMessage('공유를 준비하지 못했어요. 이미지 다운로드를 이용해 주세요.', 'error');
      }
    } finally {
      setIsSharePending(false);
    }
  };

  return (
    <PageWrapper>
      <Toolbar>
        <TitleGroup>
          <Title>방탈출 후기 템플릿</Title>
          <SubTitle>
            {state?.reviewData
              ? '내 후기 정보를 템플릿에 얹어 공유 이미지처럼 확인할 수 있어요.'
              : '후기 정보가 없어 예시 템플릿으로 미리보기를 보여주고 있어요.'}
          </SubTitle>
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
          <ShareButton type="button" onClick={handleOpenShareModal}>
            <StyledShareIcon />
            공유하기
          </ShareButton>
        </ActionGroup>
      </Toolbar>

      <Workspace>
        <PreviewPanel>
          <PreviewHeader>
            <PanelLabel>미리보기</PanelLabel>
            <TemplateName>{selected.name}</TemplateName>
          </PreviewHeader>
          <RecordCanvas $backgroundImage={backgroundImage}>
            <HiddenImage
              src={backgroundImage}
              alt=""
              onError={backgroundMode === 'theme' ? handleThemeImageError : undefined}
            />
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
                  <HiddenImage
                    src={backgroundImage}
                    alt=""
                    onError={backgroundMode === 'theme' ? handleThemeImageError : undefined}
                  />
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

      {isShareModalOpen && (
        <ModalBackdrop onClick={handleCloseShareModal}>
          <ShareModal onClick={(event) => event.stopPropagation()}>
            <ModalTop>
              <ModalHeader>
                <ModalTitle>후기 공유</ModalTitle>
                <ModalDescription>
                  현재 선택한 템플릿을 이미지로 저장하거나,
                  <br />
                  다른 앱으로 바로 공유할 수 있어요.
                </ModalDescription>
              </ModalHeader>
              <ModalCloseButton type="button" onClick={handleCloseShareModal} disabled={isSharePending}>
                <StyledCloseIcon />
              </ModalCloseButton>
            </ModalTop>

            <ShareOptionGrid>
              <ShareOptionButton
                type="button"
                onClick={handleInstagramStoryShare}
                disabled={isSharePending}
                $variant="instagram"
              >
                <ShareOptionIconWrapper $variant="instagram">
                  <StyledShareIcon2 />
                </ShareOptionIconWrapper>
                <ShareOptionTitle>다른 앱으로 공유</ShareOptionTitle>
                <ShareOptionDescription>현재 템플릿을 원하는 앱으로 바로 공유할 수 있어요.</ShareOptionDescription>
              </ShareOptionButton>

              <ShareOptionButton
                type="button"
                onClick={handleImageDownload}
                disabled={isSharePending}
                $variant="download"
              >
                <ShareOptionIconWrapper $variant="download">
                  <StyledDownloadIcon />
                </ShareOptionIconWrapper>
                <ShareOptionTitle>이미지 다운로드</ShareOptionTitle>
                <ShareOptionDescription>현재 템플릿을 PNG 이미지로 저장해요.</ShareOptionDescription>
              </ShareOptionButton>
            </ShareOptionGrid>

            <ShareStatus $tone={shareMessageTone}>{shareMessage || '공유 방식을 선택해 주세요.'}</ShareStatus>
          </ShareModal>
        </ModalBackdrop>
      )}
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
        <MetaLine>
          {data.playedAt} · {data.remainingTime}
        </MetaLine>
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
        <PosterFooter>
          {data.result} · {data.satisfaction}
        </PosterFooter>
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
          <StampMeta>
            {data.playedAt} · {data.remainingTime}
          </StampMeta>
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
        <MinimalMeta>
          {data.review} / {data.remainingTime}
        </MinimalMeta>
      </MinimalLine>
    );
  }

  if (templateId === 'score-grid') {
    return (
      <ScoreGrid $compact={compact}>
        <ScoreTitle>{data.themeName}</ScoreTitle>
        <ScoreRows>
          <ScoreItem>
            <span>평점</span>
            <strong>{data.satisfaction}</strong>
          </ScoreItem>
          <ScoreItem>
            <span>인원</span>
            <strong>{data.participantCount}</strong>
          </ScoreItem>
          <ScoreItem>
            <span>추천</span>
            <strong>{data.recommendedHeadcount}</strong>
          </ScoreItem>
          <ScoreItem>
            <span>힌트</span>
            <strong>{data.usedHint}</strong>
          </ScoreItem>
        </ScoreRows>
      </ScoreGrid>
    );
  }

  return (
    <FilmLog $compact={compact}>
      <FilmTop>{data.storeName}</FilmTop>
      <FilmCenter>{data.themeName}</FilmCenter>
      <FilmBottom>
        {data.playedAt} · {data.review} · {data.remainingTime}
      </FilmBottom>
    </FilmLog>
  );
}

function formatRemainingTime(timeString) {
  if (!timeString) return '-';
  const [, minutes = '00', seconds = '00'] = timeString.split(':');
  return `${minutes}'${seconds}"`;
}

function createShareFileName(themeName, templateName) {
  const safeThemeName = (themeName || 'review-share')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase();

  return `${safeThemeName || 'review-share'}-${templateName}.png`;
}

async function exportReviewImage({ templateId, data, backgroundImage }) {
  const size = 1080;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('canvas context를 만들 수 없습니다.');
  }

  await drawReviewBackground(context, backgroundImage, size);
  drawTemplateOnCanvas(context, templateId, data, size);

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      if (!file) {
        reject(new Error('이미지 변환에 실패했습니다.'));
        return;
      }
      resolve(file);
    }, 'image/png');
  });

  return blob;
}

async function drawReviewBackground(context, backgroundImage, size) {
  const imageSource = backgroundImage || ThumbnailImg;
  let image;

  try {
    image = await loadImage(imageSource);
  } catch (error) {
    if (imageSource !== ThumbnailImg) {
      image = await loadImage(ThumbnailImg);
    } else {
      throw error;
    }
  }

  drawCoverImage(context, image, size, size);

  const overlay = context.createLinearGradient(0, 0, 0, size);
  overlay.addColorStop(0, 'rgba(0, 0, 0, 0.10)');
  overlay.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
  context.fillStyle = overlay;
  context.fillRect(0, 0, size, size);
}

function drawTemplateOnCanvas(context, templateId, data, size) {
  switch (templateId) {
    case 'center-badge':
      drawCenterBadgeTemplate(context, data, size);
      return;
    case 'bottom-record':
      drawBottomRecordTemplate(context, data, size);
      return;
    case 'poster':
      drawPosterTemplate(context, data, size);
      return;
    case 'corner-stamp':
      drawCornerStampTemplate(context, data, size);
      return;
    case 'date-card':
      drawDateCardTemplate(context, data, size);
      return;
    case 'minimal':
      drawMinimalTemplate(context, data, size);
      return;
    case 'score-grid':
      drawScoreGridTemplate(context, data, size);
      return;
    default:
      drawFilmTemplate(context, data, size);
  }
}

function drawCenterBadgeTemplate(context, data, size) {
  drawRoundedRect(
    context,
    size * 0.16,
    size * 0.28,
    size * 0.68,
    size * 0.44,
    160,
    'rgba(10, 12, 18, 0.42)',
    'rgba(249, 249, 251, 0.5)',
  );
  drawCanvasText(context, 'ROOM IN US', size / 2, size * 0.4, {
    font: '700 30px Pretendard',
    color: 'rgba(249, 249, 251, 0.82)',
    align: 'center',
  });
  drawWrappedCanvasText(context, data.themeName, size / 2, size * 0.49, size * 0.5, {
    font: '900 84px Pretendard',
    color: '#F9F9FB',
    align: 'center',
    lineHeight: 88,
    maxLines: 2,
  });
  drawRoundedRect(context, size * 0.36, size * 0.58, size * 0.28, size * 0.07, 999, '#F9F9FB');
  drawCanvasText(context, data.review, size / 2, size * 0.625, {
    font: '700 28px Pretendard',
    color: '#35384A',
    align: 'center',
  });
  drawCanvasText(context, `${data.playedAt} · ${data.remainingTime}`, size / 2, size * 0.69, {
    font: '700 28px Pretendard',
    color: '#F9F9FB',
    align: 'center',
  });
}

function drawBottomRecordTemplate(context, data, size) {
  const gradient = context.createLinearGradient(0, size * 0.45, 0, size);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.78)');
  context.fillStyle = gradient;
  context.fillRect(0, size * 0.45, size, size * 0.55);

  drawWrappedCanvasText(context, data.themeName, 76, size * 0.72, size - 152, {
    font: '900 76px Pretendard',
    color: '#F9F9FB',
    lineHeight: 82,
    maxLines: 2,
  });

  const stats = [
    ['DATE', data.playedAt],
    ['TIME', data.remainingTime],
    ['HINT', data.usedHint],
  ];

  stats.forEach(([label, value], index) => {
    const width = 286;
    const gap = 24;
    const x = 76 + (width + gap) * index;
    const y = size * 0.83;
    drawCanvasText(context, label, x, y, {
      font: '700 24px Pretendard',
      color: 'rgba(249, 249, 251, 0.68)',
    });
    drawWrappedCanvasText(context, value, x, y + 42, width, {
      font: '900 34px Pretendard',
      color: '#F9F9FB',
      lineHeight: 38,
      maxLines: 2,
    });
  });
}

function drawPosterTemplate(context, data, size) {
  const gradient = context.createLinearGradient(0, 0, size * 0.72, 0);
  gradient.addColorStop(0, 'rgba(6, 9, 20, 0.72)');
  gradient.addColorStop(1, 'rgba(6, 9, 20, 0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  drawCanvasText(context, data.playedAt, 72, 94, {
    font: '700 32px Pretendard',
    color: '#F9F9FB',
  });
  drawWrappedCanvasText(context, data.themeName, 72, 350, size * 0.62, {
    font: '900 116px Pretendard',
    color: '#F9F9FB',
    lineHeight: 112,
    maxLines: 3,
  });
  drawRoundedRect(context, 72, size * 0.72, 290, 64, 12, 'rgba(0, 0, 0, 0.18)', 'rgba(249, 249, 251, 0.6)');
  drawCanvasText(context, data.review, 104, size * 0.764, {
    font: '700 30px Pretendard',
    color: '#F9F9FB',
  });
  drawCanvasText(context, `${data.result} · ${data.satisfaction}`, 72, size * 0.9, {
    font: '700 32px Pretendard',
    color: '#F9F9FB',
  });
}

function drawCornerStampTemplate(context, data, size) {
  context.save();
  context.translate(size * 0.74, size * 0.74);
  context.rotate((-2 * Math.PI) / 180);
  drawRoundedRect(context, -250, -170, 360, 260, 20, 'rgba(249, 249, 251, 0.92)', 'rgba(53, 56, 74, 0.18)');
  drawCanvasText(context, 'POST CARD', -214, -120, {
    font: '900 24px Pretendard',
    color: '#718FF2',
  });
  drawRoundedRect(context, 38, -145, 62, 54, 6, 'rgba(249, 249, 251, 0.72)', 'rgba(53, 56, 74, 0.45)', [6, 6]);
  drawCanvasText(context, data.satisfaction, 69, -110, {
    font: '900 22px Pretendard',
    color: '#515467',
    align: 'center',
  });
  drawWrappedCanvasText(context, data.themeName, -214, -48, 250, {
    font: '900 42px Pretendard',
    color: '#35384A',
    lineHeight: 46,
    maxLines: 2,
  });
  context.strokeStyle = 'rgba(53, 56, 74, 0.28)';
  context.setLineDash([10, 6]);
  context.beginPath();
  context.moveTo(-214, 26);
  context.lineTo(82, 26);
  context.stroke();
  context.setLineDash([]);
  drawCanvasText(context, data.review, -214, 70, {
    font: '700 26px Pretendard',
    color: '#515467',
  });
  drawCanvasText(context, `${data.playedAt} · ${data.remainingTime}`, -214, 112, {
    font: '700 22px Pretendard',
    color: '#818496',
  });
  context.restore();
}

function drawDateCardTemplate(context, data) {
  drawRoundedRect(context, 56, 56, 360, 250, 24, 'rgba(249, 249, 251, 0.90)');
  drawCanvasText(context, data.playedAt, 92, 128, {
    font: '900 42px Pretendard',
    color: '#718FF2',
  });
  drawWrappedCanvasText(context, data.themeName, 92, 192, 288, {
    font: '900 54px Pretendard',
    color: '#35384A',
    lineHeight: 58,
    maxLines: 2,
  });
  drawCanvasText(context, data.result, 92, 274, {
    font: '700 30px Pretendard',
    color: '#515467',
  });
}

function drawMinimalTemplate(context, data, size) {
  context.strokeStyle = 'rgba(249, 249, 251, 0.72)';
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(56, size - 150);
  context.lineTo(size - 56, size - 150);
  context.moveTo(56, size - 56);
  context.lineTo(size - 56, size - 56);
  context.stroke();

  drawCanvasText(context, data.themeName, 56, size - 112, {
    font: '900 52px Pretendard',
    color: '#F9F9FB',
  });
  drawCanvasText(context, `${data.review} / ${data.remainingTime}`, 56, size - 72, {
    font: '700 28px Pretendard',
    color: 'rgba(249, 249, 251, 0.82)',
  });
}

function drawScoreGridTemplate(context, data, size) {
  drawRoundedRect(context, size * 0.15, size * 0.24, size * 0.7, size * 0.52, 24, 'rgba(10, 12, 18, 0.58)');
  drawWrappedCanvasText(context, data.themeName, size / 2, size * 0.34, size * 0.54, {
    font: '900 62px Pretendard',
    color: '#F9F9FB',
    align: 'center',
    lineHeight: 68,
    maxLines: 2,
  });

  const items = [
    ['평점', data.satisfaction],
    ['인원', data.participantCount],
    ['추천', data.recommendedHeadcount],
    ['힌트', data.usedHint],
  ];

  items.forEach(([label, value], index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = 210 + col * 252;
    const y = 430 + row * 154;
    drawRoundedRect(context, x, y, 208, 118, 12, 'transparent', 'rgba(249, 249, 251, 0.24)');
    drawCanvasText(context, label, x + 104, y + 36, {
      font: '700 24px Pretendard',
      color: 'rgba(249, 249, 251, 0.68)',
      align: 'center',
    });
    drawWrappedCanvasText(context, value, x + 104, y + 76, 168, {
      font: '900 32px Pretendard',
      color: '#F9F9FB',
      align: 'center',
      lineHeight: 36,
      maxLines: 2,
    });
  });
}

function drawFilmTemplate(context, data, size) {
  context.fillStyle = 'rgba(0, 0, 0, 0.80)';
  context.fillRect(0, 0, size, 170);
  context.fillRect(0, size - 170, size, 170);

  drawCanvasText(context, data.storeName, 56, 92, {
    font: '700 34px Pretendard',
    color: '#F9F9FB',
  });
  drawWrappedCanvasText(context, data.themeName, size / 2, size * 0.54, size * 0.72, {
    font: '900 86px Pretendard',
    color: '#F9F9FB',
    align: 'center',
    lineHeight: 92,
    maxLines: 2,
  });
  drawCanvasText(context, `${data.playedAt} · ${data.review} · ${data.remainingTime}`, size / 2, size - 90, {
    font: '700 30px Pretendard',
    color: '#F9F9FB',
    align: 'center',
  });
}

function drawCoverImage(context, image, width, height) {
  const imageRatio = image.width / image.height;
  const boxRatio = width / height;
  let drawWidth = width;
  let drawHeight = height;
  let offsetX = 0;
  let offsetY = 0;

  if (imageRatio > boxRatio) {
    drawHeight = height;
    drawWidth = height * imageRatio;
    offsetX = (width - drawWidth) / 2;
  } else {
    drawWidth = width;
    drawHeight = width / imageRatio;
    offsetY = (height - drawHeight) / 2;
  }

  context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
}

function drawRoundedRect(context, x, y, width, height, radius, fillStyle, strokeStyle = null, lineDash = []) {
  context.save();
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();

  if (fillStyle) {
    context.fillStyle = fillStyle;
    context.fill();
  }

  if (strokeStyle) {
    context.strokeStyle = strokeStyle;
    context.lineWidth = 2;
    context.setLineDash(lineDash);
    context.stroke();
  }
  context.restore();
}

function drawCanvasText(context, text, x, y, options = {}) {
  const { font = '700 32px Pretendard', color = '#F9F9FB', align = 'left', baseline = 'middle' } = options;

  context.save();
  context.font = font;
  context.fillStyle = color;
  context.textAlign = align;
  context.textBaseline = baseline;
  context.fillText(text || '-', x, y);
  context.restore();
}

function drawWrappedCanvasText(context, text, x, y, maxWidth, options = {}) {
  const {
    font = '700 32px Pretendard',
    color = '#F9F9FB',
    align = 'left',
    baseline = 'top',
    lineHeight = 36,
    maxLines = 2,
  } = options;

  context.save();
  context.font = font;
  context.fillStyle = color;
  context.textAlign = align;
  context.textBaseline = baseline;

  const lines = wrapCanvasText(context, text || '-', maxWidth, maxLines);
  lines.forEach((line, index) => {
    context.fillText(line, x, y + lineHeight * index);
  });
  context.restore();
}

function wrapCanvasText(context, text, maxWidth, maxLines) {
  const words = tokenizeCanvasText(String(text || '-'));
  const lines = [];
  let current = '';

  words.forEach((word) => {
    const spacer = current && !isPunctuationToken(word) && !current.endsWith(' ') ? ' ' : '';
    const next = `${current}${spacer}${word}`;
    if (context.measureText(next).width <= maxWidth) {
      current = next;
      return;
    }

    if (current) {
      lines.push(current);
    } else {
      const slicedWord = trimCanvasLine(sliceCanvasTextByWidth(context, word, maxWidth));
      lines.push(slicedWord);
      current = word.slice(slicedWord.length).trimStart();
      return;
    }
    current = word;
  });

  if (current) {
    lines.push(current);
  }

  if (lines.length <= maxLines) {
    return lines;
  }

  const truncated = lines.slice(0, maxLines);
  const lastIndex = maxLines - 1;
  let lastLine = truncated[lastIndex];

  while (context.measureText(`${lastLine}...`).width > maxWidth && lastLine.length > 0) {
    lastLine = lastLine.slice(0, -1);
  }

  truncated[lastIndex] = `${lastLine}...`;
  return truncated;
}

function tokenizeCanvasText(text) {
  if (text.includes(' ')) {
    return text.split(/\s+/);
  }

  return Array.from(text);
}

function isPunctuationToken(token) {
  return /^[.,!?/:;)]$/.test(token);
}

function sliceCanvasTextByWidth(context, text, maxWidth) {
  let result = '';

  for (const char of Array.from(text)) {
    const next = `${result}${char}`;
    if (context.measureText(next).width > maxWidth) {
      return result || char;
    }
    result = next;
  }

  return result;
}

function trimCanvasLine(text) {
  return text.replace(/\s+$/g, '');
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('이미지 로드에 실패했습니다.'));
    image.src = src;
  });
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export default ReviewSharePage;

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
  gap: 0.75rem;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }
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
  transition:
    background 0.15s ease,
    color 0.15s ease;
`;

const SegmentButton = styled.button`
  ${segmentStyle}
`;

const UploadButton = styled.label`
  ${segmentStyle}
  overflow: hidden;
`;

const ShareButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 8.75rem;
  border: 1px solid var(--RIU_Primary-20, #c7d0ff);
  border-radius: 999rem;
  padding: 0.75rem 1rem;
  background: var(--RIU_Primary-0, #e8eaff);
  color: var(--RIU_Primary-100, #718ff2);
  font-family: Pretendard-Bold;
  font-size: 0.875rem;
  cursor: pointer;
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledShareIcon = styled(ShareIcon)`
  width: 1rem;
  height: 1rem;

  path {
    fill: #718ff2;
  }
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

const HiddenImage = styled.img`
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
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

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 3500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.6);
`;

const ShareModal = styled.div`
  width: 25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.5rem;
  border-radius: 0.625rem;
  background: var(--RIU_Monochrome-10, #f9f9fb);
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: 18.75rem;
    padding: 1.25rem;
  }
`;

const ModalTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
`;

const ModalCloseButton = styled.button`
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--RIU_Monochrome-30, #e7e8ed);
  border-radius: 999rem;
  background: var(--RIU_Monochrome-10, #f9f9fb);
  cursor: pointer;
  opacity: ${({ disabled }) => (disabled ? 0.45 : 1)};
  flex-shrink: 0;
`;

const StyledCloseIcon = styled(CloseIcon)`
  width: 1rem;
  height: 1rem;

  path {
    fill: #818496;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: var(--RIU_Primary-100, #718ff2);
  font-family: Pretendard-Bold;
  font-size: 1.25rem;
`;

const ModalDescription = styled.p`
  margin: 0;
  color: var(--RIU_Monochrome-100, #818496);
  font-family: Pretendard-Medium;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const ShareOptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.875rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ShareOptionButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid ${({ $variant }) => ($variant === 'instagram' ? '#F1D7E4' : '#D9E0FF')};
  border-radius: 0.625rem;
  background: ${({ $variant }) => ($variant === 'instagram' ? '#FFF8FB' : '#F5F7FF')};
  text-align: left;
  cursor: pointer;
  opacity: ${({ disabled }) => (disabled ? 0.55 : 1)};
  box-sizing: border-box;
`;

const ShareOptionIconWrapper = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999rem;
  background: ${({ $variant }) =>
    $variant === 'instagram' ? 'rgba(255, 188, 214, 0.4)' : 'rgba(113, 143, 242, 0.16)'};
`;

const StyledShareIcon2 = styled(ShareIcon)`
  width: 1.125rem;
  height: 1.125rem;

  path {
    fill: #717486;
  }
`;

const StyledDownloadIcon = styled(CopyIcon)`
  width: 1.125rem;
  height: 1.125rem;

  path {
    fill: #717486;
  }
`;

const ShareOptionTitle = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: Pretendard-Bold;
  font-size: 0.9375rem;
`;

const ShareOptionDescription = styled.div`
  color: var(--RIU_Monochrome-100, #818496);
  font-family: Pretendard-Medium;
  font-size: 0.75rem;
  line-height: 1.45;
`;

const ShareStatus = styled.div`
  padding: 0.875rem 1rem;
  border-radius: 0.625rem;
  border: 1px solid
    ${({ $tone }) =>
      $tone === 'success'
        ? 'rgba(113, 200, 156, 0.32)'
        : $tone === 'error'
          ? 'rgba(255, 132, 132, 0.28)'
          : 'var(--RIU_Monochrome-30, #E7E8ED)'};
  background: ${({ $tone }) =>
    $tone === 'success'
      ? 'rgba(120, 217, 168, 0.10)'
      : $tone === 'error'
        ? 'rgba(255, 132, 132, 0.08)'
        : 'var(--RIU_Monochrome-20, #F0F0F4)'};
  color: ${({ $tone }) =>
    $tone === 'success' ? '#398A63' : $tone === 'error' ? '#D05E5E' : 'var(--RIU_Monochrome-200, #717486)'};
  font-family: Pretendard-Medium;
  font-size: 0.875rem;
  line-height: 1.45;
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
    'center-badge': css`
      align-items: center;
      justify-content: center;
    `,
    'bottom-record': css`
      align-items: flex-end;
      justify-content: stretch;
    `,
    poster: css`
      align-items: stretch;
      justify-content: stretch;
    `,
    'corner-stamp': css`
      align-items: flex-end;
      justify-content: flex-end;
    `,
    'date-card': css`
      align-items: flex-start;
      justify-content: flex-start;
    `,
    minimal: css`
      align-items: flex-end;
      justify-content: flex-start;
    `,
    'score-grid': css`
      align-items: center;
      justify-content: center;
    `,
    film: css`
      align-items: stretch;
      justify-content: stretch;
    `,
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
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(239, 241, 247, 0.84)),
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
  background: repeating-linear-gradient(90deg, rgba(53, 56, 74, 0.28) 0 0.5rem, transparent 0.5rem 0.75rem);
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
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0 16%, transparent 16% 84%, rgba(0, 0, 0, 0.8) 84% 100%);
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
