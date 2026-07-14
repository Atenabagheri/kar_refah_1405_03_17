export const convertDateToFa = (date: string) => {
    if (!date) return;
    return new Date(date).toLocaleDateString("fa-IR");
};
