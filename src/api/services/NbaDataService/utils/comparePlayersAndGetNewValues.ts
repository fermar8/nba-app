export const comparePlayerValuesAndGetNewValues = (playerValueLastWeek: number, playerValue: number) => {
    console.log('valueLastWeek', playerValueLastWeek);
    console.log('value', playerValue);
    const newValue = {
        value: 0,
        increment: 0
    };
    const increment = ((playerValue - playerValueLastWeek) / playerValue) * 100;
    console.log('increment', increment);
    const multiplicator = playerValue * 0.15;
    console.log('multiplicator', multiplicator);
    if (increment > 15) {
        newValue.value = Number(playerValue) + Number(multiplicator);
        newValue.increment = 15;
    } else if (increment < 15 && increment > -15) {
        newValue.value = playerValueLastWeek;
        newValue.increment = increment;
    } else if (increment < -15) {
        newValue.value = Number(playerValue) - Number(multiplicator);
        newValue.increment = -15;
    }
 return newValue;
}