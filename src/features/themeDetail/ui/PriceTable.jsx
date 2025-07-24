import styled from "styled-components";
import PropTypes from 'prop-types';
import { formatNumberWithCommas } from "../../../shared/utils/formatUtils";

function PriceTable({ themePrice }) {
  return (
    <TableWrapper>
      <thead>
        <tr>
          <NumberTitle>
            <TitleText>
              인원
            </TitleText>
          </NumberTitle>
          <PriceTitle>
            <TitleText>
              가격
            </TitleText>
          </PriceTitle>
          <SinglePriceTitle>
            <TitleText>
              1인가
            </TitleText>
          </SinglePriceTitle>
        </tr>
      </thead>
      <tbody>
        {themePrice.map(({ headcount, price }, index) => (
          <tr key={index}>
            <CountTd isLast={index === themePrice.length - 1}>
              <TdText type="count">
                {headcount}인
              </TdText>
            </CountTd>
            <PriceTd>
              <TdText type="price">
                {formatNumberWithCommas(headcount * price)}
              </TdText>
            </PriceTd>
            <PerPersonTd isLast={index === themePrice.length - 1}>
              <TdText type="perPerson">
                {formatNumberWithCommas(price)}
              </TdText>
            </PerPersonTd>
          </tr>
        ))}
      </tbody>
    </TableWrapper>
  )
}

export default PriceTable;

// eslint 오류 방지
PriceTable.propTypes = {
  themePrice: PropTypes.arrayOf(
    PropTypes.shape({
      headcount: PropTypes.number,
      price: PropTypes.number,
    })
  ),
};

// CSS
const TableWrapper = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const NumberTitle = styled.th`
  border-bottom: 1px solid var(--RIU_Monochrome-70, #B3B6C3);
  border-radius: 0.625rem 0 0 0;
  padding: 0.625rem 0rem;
  box-sizing: border-box;
  width: 5rem;
  height: 3.125rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  background: var(--RIU_Monochrome-30, #E7E8ED);

  @media (max-width: 768px) {
    width: 4.0625rem;
    height: 2.75rem;
  }
`;

const TitleText = styled.div`
  color: var(--RIU_Monochrome-100, #818496);
  text-align: center;
  font-family: 'Pretendard-Medium';
  font-size: 0.875rem;
  line-height: normal;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const PriceTitle = styled.th`
  border-bottom: 1px solid var(--RIU_Monochrome-70, #B3B6C3);
  padding: 0.625rem 0rem;
  box-sizing: border-box;
  height: 3.125rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  background: #F0F0F4;

  @media (max-width: 768px) {
    height: 2.75rem;
  }
`;

const SinglePriceTitle = styled.th`
  border-bottom: 1px solid var(--RIU_Monochrome-70, #B3B6C3);
  border-radius: 0 0.625rem 0 0;
  padding: 0.625rem 0rem;
  box-sizing: border-box;
  height: 3.125rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  background: #F0F0F4;

  @media (max-width: 768px) {
    height: 2.75rem;
  }
`;

const CountTd = styled.td`
  border-bottom-left-radius: ${(props) => (props.isLast) ? '0.625rem' : '0'};
  padding: 0.625rem 0rem;
  box-sizing: border-box;
  width: 5rem;
  height: 3.125rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  background: var(--RIU_Monochrome-30, #E7E8ED);

  @media (max-width: 768px) {
    height: 2.75rem;
  }
`;

const PriceTd = styled.td`
  height: 3.125rem;
  padding: 0.625rem 0rem;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  background: #F0F0F4;

  @media (max-width: 768px) {
    height: 2.75rem;
  }
`;

const PerPersonTd = styled.td`
  border-bottom-right-radius: ${(props) => (props.isLast) ? '0.625rem' : '0'};
  height: 3.125rem;
  padding: 0.625rem 0rem;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  background: #F0F0F4;

  @media (max-width: 768px) {
    height: 2.75rem;
  }
`;

const TdText = styled.div`
  color: ${(props) => (props.type === 'price') ? 'var(--RIU_Primary-100, #718FF2)' : 'var(--RIU_Monochrome-500, #515467)'};
  text-align: center;
  font-family: 'Pretendard-Medium';
  font-size: 0.875rem;
  line-height: normal;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;
