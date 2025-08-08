export const excelSerialDateToJSDate = (serial) => {
  const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // Excel's epoch is December 30, 1899
  const msPerDay = 24 * 60 * 60 * 1000;
  const jsDate = new Date(excelEpoch.getTime() + serial * msPerDay);
  return jsDate;
};