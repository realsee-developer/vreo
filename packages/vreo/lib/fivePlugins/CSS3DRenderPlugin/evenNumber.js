export default function evenNumber(num, config) {
  var roundNum = Math.round(num);
  return roundNum % 2 === 0 ? roundNum : roundNum + Number(config !== null && config !== void 0 && config.smaller ? -1 : 1);
}