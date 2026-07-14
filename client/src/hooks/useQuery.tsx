import { useSearchParams } from "react-router";

type QueryUpdate = Record<string, string | null | undefined>;

export const useQuery = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const get = (key: string): string | null => {
    return searchParams.get(key);
  };

  const set = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(key, value);
    setSearchParams(newParams);
  };

  const remove = (key: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    setSearchParams(newParams);
  };

  /**
   * آپدیت همزمان چند کوئری
   * اگر مقدار null یا undefined باشه → حذف میشه
   */
  const update = (values: QueryUpdate) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(values).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });

    setSearchParams(newParams);
  };

  const clear = () => {
    setSearchParams({});
  };

  return { get, set, remove, update, clear, searchParams };
};