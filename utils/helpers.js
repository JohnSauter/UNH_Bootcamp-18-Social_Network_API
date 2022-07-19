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

module.exports = { format_time, format_date };
