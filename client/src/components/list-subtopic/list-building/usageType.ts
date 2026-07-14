type UsageType = {
  name?: string;
  faName?: string | false;
  bgColor?: string;
};

export const usageType = (text: string): UsageType => {
  const usageData: UsageType =
    text === "other"
      ? { name: "other", faName: "سایر", bgColor: "bg-danger/20" }
      : text === "welfare"
        ? { name: "welfare", faName: "رفاهی", bgColor: "bg-green-200" }
        : text === "educational"
          ? {
              name: "educational",
              faName: "آموزشی",
              bgColor: "bg-secondary/20",
            }
          : text === "sports"
            ? { name: "sports", faName: "ورزشی", bgColor: "bg-primary/20" }
            : text === "cultural"
              ? { name: "cultural", faName: "فرهنگی", bgColor: "bg-yellow-200" }
              : text === "administrative"
                ? {
                    name: "administrative",
                    faName: "اداری",
                    bgColor: "bg-amber-100",
                  }
                : {};
  return usageData;
};
