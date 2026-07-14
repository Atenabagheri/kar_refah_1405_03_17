const jalaali = require("jalaali-js");

function convertJalaliToDate(jalaliDateStr) {
  // ورودی مثل "1403-03-15"
  const [jy, jm, jd] = jalaliDateStr.split("-").map(Number);

  // تبدیل به میلادی
  const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);

  // برگردوندن تاریخ ISO
  return new Date(Date.UTC(gy, gm - 1, gd));
}

module.exports = convertJalaliToDate;
