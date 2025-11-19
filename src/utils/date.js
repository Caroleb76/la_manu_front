import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

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
    if (typeof dateParam === "string") dateParam = new Date(dateParam);
    // const date = new Date(dateParam);
    dateParam.setHours(11);
    const convertedDate = dateParam.toLocaleString("fr-FR", {
      timeZone: "Europe/Paris",
    });

    return convertedDate.split(" ")[0] ?? "";
  } catch (error) {
    return "";
  }
}

export function getInterventionStartDate(dateParam, shift) {
  if (shift === "pm") {
    const dayJs = dayjs(dateParam);
    const newDate = dayJs.add(7, "hour").utc();
    return newDate.toDate();
  } else {
    const dayJs = dayjs(dateParam);
    const newDate = dayJs.add(12, "hour").utc();
    return newDate.toDate();
  }
}
export function getInterventionEndDate(dateParam, shift, hours) {
  const startDate = getInterventionStartDate(dateParam, shift);
  const dayJs = dayjs(startDate);
  const newDate = dayJs.add(hours * 60, "minute").utc();

  return newDate.toDate();
}
