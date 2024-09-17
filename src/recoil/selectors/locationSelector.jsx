import { selector } from "recoil";
import { initialState, stationState } from "../atoms/locationAtom";

export const initialAndStationVisible = selector({
    key: "initialAndStationVisible",
    get: ({ get }) => {
        const initial = get(initialState);
        const station = get(stationState);
        if (station) {
            return station;
        } else {
            return initial;
        }
    }
});
