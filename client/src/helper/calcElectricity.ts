export const calcElectricity = (avgCost: number, totalDays: number) => {
  if (totalDays <= 0) return 0;

  const dailyConsumption = avgCost / 30;
  const result = dailyConsumption * totalDays;

  return Math.round(result);
};
