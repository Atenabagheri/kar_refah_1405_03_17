export const convertDateToFaWithTime = (date: string) => {
  if (!date) return;
  return new Date(date).toLocaleDateString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};
