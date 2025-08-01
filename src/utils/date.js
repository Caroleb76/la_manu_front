export function convertDateToStandardString(date) {
  return date.toISOString().split("T")[0];
}
export function convertDateToStandardStringPlusOne(date) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + 1); // safer for date overflow
  return newDate.toISOString().split("T")[0]; // returns yyyy-mm-dd
}

export function convertDateToFranceTimeZone(dateParam) {
  try {
    console.log("dateParam is", dateParam);
    
    if(typeof dateParam === "string") dateParam = new Date(dateParam);
    // const date = new Date(dateParam);
    dateParam.setHours(11);
    const convertedDate = dateParam.toLocaleString('fr-FR', {
      timeZone: 'Europe/Paris'
    });

    return convertedDate.split(" ")[0] ?? "";
  } catch (error) {
    return "";
  }
}