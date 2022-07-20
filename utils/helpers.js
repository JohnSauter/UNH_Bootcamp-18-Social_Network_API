/* Format a date as just the time.  */
const format_time = (date) => {
  return date.toLocaleTimeString();
};

/* Format a date as mm/dd/yyyy.  */
const format_date = (date) => {
  const the_date = date;
  const the_month = the_date.getMonth();
  const the_mday = the_date.getDate();
  const the_year = the_date.getFullYear();

  const result =
    String(the_month + 1) + "/" + String(the_mday) + "/" + String(the_year);
  return result;
};

/* Format a date as mm/dd/yyyy hh:mm.  */
const format_date_time = (date) => {
  const the_date = date;
  const the_month = the_date.getMonth();
  const the_mday = the_date.getDate();
  const the_year = the_date.getFullYear();
  const the_hour = the_date.getHours();
  const the_minute = the_date.getMinutes();

  const result =
    (the_month + 1).toLocaleString("en-us", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    }) +
    "/" +
    the_mday.toLocaleString("en-us", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    }) +
    "/" +
    the_year.toLocaleString("en-us", {
      minimumIntegerDigits: 4,
      useGrouping: false,
    }) +
    " " +
    the_hour.toLocaleString("en-us", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    }) +
    ":" +
    the_minute.toLocaleString("en-us", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
  return result;
};

module.exports = { format_time, format_date, format_date_time };
