import { API_URL } from "../constants";
import type { FetcherContext } from "./types";

export class ApiError extends Error {
  res?: Response;
  constructor(message: string, response?: Response) {
    super(message);
    this.res = response;
  }
}

export const fetcher =
  <T>(path: string, init?: Omit<RequestInit, "body"> & { body?: unknown }) =>
  (context: FetcherContext): Promise<T> =>
    fetch(API_URL + path, {
      ...init,
      body: init?.body ? JSON.stringify(init.body) : undefined,
      headers: {
        Authorization: context.token ? `Bearer ${context.token}` : "",
        "Content-Type": "application/json",
        ...init?.headers,
      },
    }).then(async (res) => {
      const resBody = (await res.json()) as undefined | { message: string };
      if (!res.ok) throw new ApiError(resBody?.message || res.statusText, res);
      return resBody as T;
    });
