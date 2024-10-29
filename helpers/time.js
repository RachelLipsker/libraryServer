
const futureDate = (days) => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + days);
    return futureDate;
}

function isMoreThanDays(givenDateInMs, number) {
    const currentDateInMs = Date.now();

    const differenceInTime = currentDateInMs - givenDateInMs;
    const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24);

    return differenceInDays > number;
}


module.exports = { futureDate, isMoreThanDays }