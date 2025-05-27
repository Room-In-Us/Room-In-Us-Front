import { FinalWrapper, ThemeImg, ThemeSubText, ThemeTitle, Wrap2 } from "../../../shared/components/ReviewStyle"

export default function ReviewLast() {
  return (
    <FinalWrapper>
      <ThemeImg />
      <Wrap2 isLast={true}>
        <ThemeTitle>테마명</ThemeTitle>
        <ThemeSubText>후기 작성이 완료되었습니다!</ThemeSubText>
      </Wrap2>
    </FinalWrapper>
  )
}