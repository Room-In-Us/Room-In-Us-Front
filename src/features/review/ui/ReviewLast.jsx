import { FinalWrapper, ThemeImg, ThemeSubText, ThemeTitle, Wrap2 } from "../../../shared/styles/ReviewStyles"

export default function ReviewLast({themeData}) {
  return (
    <FinalWrapper>
      <ThemeImg src={themeData?.img || ''} />
      <Wrap2 $isLast={true}>
        <ThemeTitle>{themeData?.themeName || '테마명'}</ThemeTitle>
        <ThemeSubText>후기 작성이 완료되었습니다!</ThemeSubText>
      </Wrap2>
    </FinalWrapper>
  )
}