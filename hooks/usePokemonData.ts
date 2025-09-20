"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function usePokemonData(size: number) {
  const { data, error, isLoading } = useSWR(`/api/pokemon/${size}`, fetcher);

  return {
    data,
    isLoading,
    isError: error,
  };
}
