export const getPtsBeforeLastWeek = (statsPerGame: any, fantasyPtsPerGameLastWeek: any) => {
    if (statsPerGame && statsPerGame.length > 0 && statsPerGame[0].nbaFantasyPts && statsPerGame[0].nbaFantasyPts > 0) {
        return ((statsPerGame[0].nbaFantasyPts * statsPerGame[0].gp) - fantasyPtsPerGameLastWeek) / statsPerGame[0].gp;
    } else {
        return 0;
    }
}  