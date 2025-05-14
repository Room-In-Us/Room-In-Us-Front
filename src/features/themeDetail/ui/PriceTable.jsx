import styled from "styled-components";

function PriceTable() {
  // 임시 데이터
  const data = [
    { count: "2인", price: "200,000", perPerson: "100,000" },
    { count: "3인", price: "200,000", perPerson: "100,000" },
    { count: "4인", price: "200,000", perPerson: "100,000" },
    { count: "5인", price: "200,000", perPerson: "100,000" },
    { count: "6인", price: "200,000", perPerson: "100,000" },
    { count: "7인", price: "200,000", perPerson: "100,000" },
  ];

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
        {data.map(({ count, price, perPerson }, index) => (
          <tr key={index}>
            <CountTd index={index}>
              <TdText type="count">
                {count}
              </TdText>
            </CountTd>
            <PriceTd>
              <TdText type="price">
                {price}
              </TdText>
            </PriceTd>
            <PerPersonTd index={index}>
              <TdText type="perPerson">
                {perPerson}
              </TdText>
            </PerPersonTd>
          </tr>
        ))}
      </tbody>
    </TableWrapper>
  )
}

export default PriceTable;

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
`;

const TitleText = styled.div`
  color: var(--RIU_Monochrome-100, #818496);
  text-align: center;
  font-family: 'Pretendard-Medium';
  font-size: 0.875rem;
  line-height: normal;
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
`;

const CountTd = styled.td`
  border-bottom-left-radius: ${(props) => (props.index === 5) ? '0.625rem' : '0'};
  padding: 0.625rem 0rem;
  box-sizing: border-box;
  width: 5rem;
  height: 3.125rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  background: var(--RIU_Monochrome-30, #E7E8ED);
`;

const PriceTd = styled.td`
  height: 3.125rem;
  padding: 0.625rem 0rem;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  background: #F0F0F4;
`;

const PerPersonTd = styled.td`
  border-bottom-right-radius: ${(props) => (props.index === 5) ? '0.625rem' : '0'};
  height: 3.125rem;
  padding: 0.625rem 0rem;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  background: #F0F0F4;
`;

const TdText = styled.div`
  color: ${(props) => (props.type === 'price') ? 'var(--RIU_Primary-100, #718FF2)' : 'var(--RIU_Monochrome-500, #515467)'};
  text-align: center;
  font-family: 'Pretendard-Medium';
  font-size: 0.875rem;
  line-height: normal;
`;
