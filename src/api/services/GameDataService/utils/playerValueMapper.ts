export const playerValueMapper = (fantasyPtsPerGame: number) => {
    let builtValue;
    if (fantasyPtsPerGame && fantasyPtsPerGame > 0) {
        if (fantasyPtsPerGame > 55) {
            builtValue = 2000000;
        } else if (fantasyPtsPerGame >= 50 && fantasyPtsPerGame < 55) {
            builtValue = 1800000;
        } else if (fantasyPtsPerGame >= 45 && fantasyPtsPerGame < 50) {
            builtValue = 1600000;
        } else if (fantasyPtsPerGame >= 40 && fantasyPtsPerGame < 45) {
            builtValue = 1400000;
        } else if (fantasyPtsPerGame >= 35 && fantasyPtsPerGame < 40) {
            builtValue = 1200000;
        } else if (fantasyPtsPerGame >= 30 && fantasyPtsPerGame < 35) {
            builtValue = 1000000;
        } else if (fantasyPtsPerGame >= 25 && fantasyPtsPerGame < 30) {
            builtValue = 800000;
        } else if (fantasyPtsPerGame >= 20 && fantasyPtsPerGame < 25) {
            builtValue = 600000;
        } else if (fantasyPtsPerGame >= 15 && fantasyPtsPerGame < 20) {
            builtValue = 400000;
        } else if (fantasyPtsPerGame >= 10 && fantasyPtsPerGame < 15) {
            builtValue = 200000;
        } else if (fantasyPtsPerGame >= 5 && fantasyPtsPerGame < 10) {
            builtValue = 100000;
        } else if (fantasyPtsPerGame >= 2.5 && fantasyPtsPerGame < 5) {
            builtValue = 50000;
        } else if (fantasyPtsPerGame >= 0 && fantasyPtsPerGame < 2.5) {
            builtValue = 20000;
        }
    } else {
        builtValue = null;
    }
    return builtValue;
}