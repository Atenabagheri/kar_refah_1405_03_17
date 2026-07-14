import React, { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import { handleApiError } from "../utils/handleApiError";
import axios from "axios";

interface UseFetchProps<T> {
  url: string;
  token?: string | null;
  dependencies?: React.DependencyList;
  initialData: T;
}

interface UseFetchReturn<T> {
  data: T;
  loading: boolean;
  error: null | string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  controllerRef?: React.RefObject<AbortController | null>;
}

export const useFetch = <T>({
  url,
  token,
  dependencies = [],
  initialData = {} as T,
}: UseFetchProps<T>): UseFetchReturn<T> => {
  const controllerRef = useRef<AbortController | null>(null);
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current = controller;
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get(url, {
          headers: { Authorization: `Bearer ${token}` },
          signal,
        });
        // console.log(res?.data);;
        setData(res.data);
      } catch (error: unknown) {
        handleApiError(error);
        if (axios.isAxiosError(error)) {
          if (error.response?.data?.message) {
            setError(error.response.data.message);
          }
        }
      } finally {
        setLoading(false);
        controllerRef.current = null;
      }
    };

    fetchData();

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, loading, error, setLoading, controllerRef };
};
