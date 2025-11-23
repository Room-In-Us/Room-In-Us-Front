import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimeClock } from "@mui/x-date-pickers/TimeClock";
import dayjs from "dayjs";
import styled from "styled-components";
import { Popover } from "@mui/material";
import leftArrow from '../../../shared/assets/icons/common/arrow/leftArrow.svg?react';
import Clock from "../../../shared/assets/icons/reviewWrite/clock.svg?react";
import DropDown from "../../../shared/assets/icons/common/arrow/downArrow.svg?react";

export default function ScheduleTimePicker({ onTimeChange, initialTime }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [value, setValue] = React.useState(
    initialTime ? dayjs(initialTime, "HH:mm:ss") : dayjs()
  );
  const [step, setStep] = React.useState("hour");
  const [tempHour, setTempHour] = React.useState(value.hour());
  const [isSelected, setIsSelected] = React.useState(!!initialTime);

  const handleBoxClick = (event) => {
    setAnchorEl(event.currentTarget);
    setStep("hour");
  };

  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);

  // 시 선택 → 분 선택 단계 전환
  const handleHourSelect = (newValue) => {
    if (!newValue) return;
    setTempHour(newValue.hour());
    setStep("minute"); 
  };

  // 분 선택 → 최종 확정
  const handleMinuteSelect = (newValue) => {
    if (!newValue) return;
    const finalValue = dayjs().hour(tempHour).minute(newValue.minute()).second(0);
    setValue(finalValue);
    setIsSelected(true);
    onTimeChange(finalValue.format("HH:mm:ss"));
    handleClose();
  };

  React.useEffect(() => {
    if (initialTime) {
      setValue(dayjs(initialTime, "HH:mm:ss"));
      setIsSelected(true);
    }
  }, [initialTime]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box onClick={handleBoxClick}>
        <Wrap>
          <ClockIcon />
          <TimeText>{isSelected ? value.format("HH:mm") : "시간 선택"}</TimeText>
        </Wrap>
        <DropDownIcon />
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        disablePortal
        slotProps={{
          paper: { sx: { zIndex: 2000, padding: 2 } },
        }}
      >
        {step === "hour" ? (
          <>
            <Title>시간 선택</Title>
            <TimeClock
              value={dayjs().hour(tempHour).minute(0)}
              onChange={handleHourSelect}
              ampm={false} // 24시간제
              views={["hours"]}
              clockSize={window.innerWidth < 768 ? 100 : 180}
              sx={{
              "& .MuiClock-clock": {
                backgroundColor: "#F9F9FB",
                border: "1px solid #C4C6D1",
              },
              // 숫자
              "& .MuiClockNumber-root": {
                fontSize: "0.875em",
                fontFamily: "Pretendard-Medium",
                color: "#717486",
                "@media (max-width: 768px)": {
                  // 추후 수정
                },
              },
              // 선택된 숫자
              "& .Mui-selected": {
                color: "#718ff2 !important",
                border: "2px solid #718ff2",
                backgroundColor: "#F9F9FB",
              },
              // 중앙 핀
              "& .MuiClock-pin": {
                backgroundColor: "#718ff2",
                width: "0.625em",
                height: "0.625em",
                "@media (max-width: 768px)": {
                  // 추후 수정
                },
              },
              // 시계 바늘
              "& .MuiClockPointer-root": {
                backgroundColor: "#718ff2",
              },
              "& .MuiClockPointer-thumb": {
                  display: "none",
                },
              }}
            />
          </>
        ) : (
          <>
            <BackWrapper>
              <LeftArrowIcon onClick={() => setStep("hour")} />
            </BackWrapper>
              
            <Title>분 선택</Title>
            <TimeClock
              value={value}
              onChange={handleMinuteSelect}
              ampm={false}
              views={["minutes"]}
              minutesStep={5} 
              clockSize={window.innerWidth < 768 ? 100 : 180}
              sx={{
                "& .MuiClock-clock": {
                  backgroundColor: " #E8EAFF",
                  border: "1px solid #B9C3FF",
                },
                // 숫자
                "& .MuiClockNumber-root": {
                  fontSize: "0.875em",
                  fontFamily: "Pretendard-Medium",
                  color: "#717486",
                  "@media (max-width: 768px)": {
                    // 추후 수정
                  },
                },
                // 선택된 숫자
                "& .Mui-selected": {
                  color: "#718ff2 !important",
                  border: "2px solid #718ff2",
                  backgroundColor: "#F9F9FB",
                },
                // 중앙 핀
                "& .MuiClock-pin": {
                  backgroundColor: "#718ff2",
                  width: "0.625em",
                  height: "0.625em",
                  "@media (max-width: 768px)": {
                    // 추후 수정
                  },
                },
                // 시계 바늘
                "& .MuiClockPointer-root": {
                  backgroundColor: "#718ff2",
                },
                "& .MuiClockPointer-thumb": {
                  display: "none",
                },
              }}
            />
          </>
        )}
      </Popover>
    </LocalizationProvider>
  );
};

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3125em;
`;

const Box = styled.div`
  width: 17.1875em;
  height: 2.5em;
  border-radius: 0.3125em;
  border: 1px solid var(--RIU_Monochrome-60, #C4C6D1);
  padding: 0.625em 0.875em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  box-sizing: border-box;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    width: 100%;
    height: 1.875em;
  }
`;

const TimeText = styled.div`
  color: var(--RIU_Monochrome-100, #818496);
  font-family: Pretendard-Medium;
  font-size: 0.75em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.625em;
  }
`;

const Title = styled.div`
  text-align: center;
  font-family: Pretendard-Bold;
  font-size: 0.875em;
  color: var(--RIU_Monochrome-200, #717486);
`;

const BackWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
`;

const LeftArrowIcon = styled(leftArrow)`
  width: 1.25em;
  height: 1.25em;
  cursor: pointer;
`;

const ClockIcon = styled(Clock)`
  width: 0.9375em;
  height: 0.9375em;
  cursor: pointer;
`;

const DropDownIcon = styled(DropDown)`
  width: 0.9375em;
  height: 0.9375em;
  
  path {
    fill: var(--RIU_Monochrome-60, #C4C6D1);
  }
`;