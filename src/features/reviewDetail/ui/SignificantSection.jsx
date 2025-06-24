import styled from "styled-components";
import TagIcon1 from "../../../shared/assets/icons/reviewDetail/tagIcon1.svg?react";
import TagIcon2 from "../../../shared/assets/icons/reviewDetail/tagIcon2.svg?react";
import TagIcon3 from "../../../shared/assets/icons/reviewDetail/tagIcon3.svg?react";
import TagIcon4 from "../../../shared/assets/icons/reviewDetail/tagIcon4.svg?react";
import TagIcon5 from "../../../shared/assets/icons/reviewDetail/tagIcon5.svg?react";
import { reviewTagConversion } from "../../../shared/utils/dataUtils";
import PropTypes from "prop-types";

function SignificantSection({ tagList }) {
  return (
    <SectionWrapper>
      <SectionTitle>
        특이사항
      </SectionTitle>
      <ListWrapper>
        {tagList.map((tag, index) => (
          <TagWrapper key={index}>
            {tag === "AGING" ? (
              <StyledTagIcon1 />
            ) : tag === "DEVICE_ERROR" ? (
              <StyledTagIcon2 />
            ) : tag === "ENTRY_DELAY" ? (
              <StyledTagIcon3 />
            ) : tag === "SAME_DAY_BOOKING" ? (
              <StyledTagIcon4 />
            ) : (
              <StyledTagIcon5 />
            )}
            <TagName>
              {reviewTagConversion(tag)}
            </TagName>
          </TagWrapper>
        ))}
      </ListWrapper>
    </SectionWrapper>
  )
}

SignificantSection.propTypes = {
  tagList: PropTypes.arrayOf(PropTypes.string),
};

export default SignificantSection;

// CSS
const SectionWrapper = styled.div`
  border-radius: 0.625rem;
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  align-self: stretch;
  background: var(--RIU_Monochrome-10, #F9F9FB);
`;

const SectionTitle = styled.div`
  color: var(--RIU_Primary-100, #718FF2);
  text-align: center;
  font-family: 'Pretendard-Bold';
  font-size: 1rem;
  line-height: normal;
`;

const ListWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

const TagWrapper = styled.div`
  width: 4.3125rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.3125rem;
`;

const StyledTagIcon1 = styled(TagIcon1)`
  width: 1.875rem;
  height: 1.875rem;
`;
const StyledTagIcon2 = styled(TagIcon2)`
  width: 1.875rem;
  height: 1.875rem;
`;
const StyledTagIcon3 = styled(TagIcon3)`
  width: 1.875rem;
  height: 1.875rem;
`;
const StyledTagIcon4 = styled(TagIcon4)`
  width: 1.875rem;
  height: 1.875rem;
`;
const StyledTagIcon5 = styled(TagIcon5)`
  width: 1.875rem;
  height: 1.875rem;
`;

const TagName = styled.div`
  color: var(--RIU_Monochrome-300, #696C7E);
  font-family: 'Pretendard-Medium';
  font-size: 0.75rem;
  line-height: 1.25rem;
  letter-spacing: -0.01875rem;
`;
