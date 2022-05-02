import { playerValueMapper } from "./playerValueMapper";

export const buildValue = (perGameStats: any) => {
    const value = playerValueMapper(perGameStats && perGameStats.nbaFantasyPts ? perGameStats.nbaFantasyPts : null)
    return value;

}