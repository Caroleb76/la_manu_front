export function convertDateToStandardString(date){
    return date.toISOString().split("T")[0];
}
export function convertDateToStandardStringPlusOne(date) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + 1); // safer for date overflow
  return newDate.toISOString().split("T")[0]; // returns yyyy-mm-dd
}