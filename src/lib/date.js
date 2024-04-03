function parseDate(dateString) {
  const [datePart, timePart] = dateString.split("T");
  const [year, month, day] = datePart.split("-");
  const [hour, minute, second] = timePart.split(":");
  return new Date(year, month - 1, day, hour, minute, second);
}

function dateDifferenceInDecimal(startDate, endDate) {
  const startTimestamp = startDate.getTime();
  const endTimestamp = endDate.getTime();
  const timeDifference = endTimestamp - startTimestamp;
  const decimalDays = timeDifference / (1000 * 60 * 60 * 24);
  return decimalDays;
}

function convertDate(inputDate) {
  const dateObj = new Date(inputDate);
  const year = dateObj.getFullYear();
  const month = ("0" + (dateObj.getMonth() + 1)).slice(-2); // Add leading zero if necessary
  const day = ("0" + dateObj.getDate()).slice(-2); // Add leading zero if necessary
  const outputDate = `${year}-${month}-${day}`;

  return outputDate;
}

// Example usage
export function NoOfDaysForExpiry(EndDate) {
  const currentDate = new Date();
  const startDateString = currentDate.toISOString().slice(0, 19);
  const endDateString = `${convertDate(EndDate)}T15:30:00`;

  // const x = "2024-03-13T15:29:00";

  const startDate = parseDate(startDateString);
  const endDate = parseDate(endDateString);

  return dateDifferenceInDecimal(startDate, endDate);
}

// const x = NoOfDaysForExpiry("2024-Mar-12");

// console.log("Difference in decimal days:", x);
