export default function evenNumber(num: number, config?: { smaller?: boolean }): number {
  const roundNum = Math.round(num)
  return roundNum % 2 === 0 ? roundNum : roundNum + Number(config?.smaller ? -1 : 1)
}
