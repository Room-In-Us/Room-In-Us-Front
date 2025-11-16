import { FinalWrapper, ThemeImg, ThemeSubText, ThemeTitle, Wrap2 } from "../../../shared/styles/ReviewStyles"

export default function ReviewLast({ themeData, isEditMode }) {
  return (
    <FinalWrapper>
      <ThemeImg src={themeData?.img || themeData?.themeImg || ''} />
      <Wrap2 $isLast={true}>
        <ThemeTitle>{themeData?.themeName || '테마명'}</ThemeTitle>
        <ThemeSubText>{isEditMode ? "후기 수정이 완료되었습니다!" : "후기 작성이 완료되었습니다!"}</ThemeSubText>
      </Wrap2>
    </FinalWrapper>
  )
}