/* eslint-disable no-console */
import axios, { AxiosRequestConfig } from "axios";
import { FetcherRequestKeys } from "../types";

interface FetcherRequestProps<T> extends AxiosRequestConfig {
  data?: Partial<T>;
  params?: Record<string, string | number>;
}

const fetcher = async <T>(
  entity: FetcherRequestKeys,
  reqOptions?: FetcherRequestProps<T>
): Promise<T> => {
  const url = ["/api/v1", ...entity].join("/");

  if (import.meta.env.DEV) {
    console.log("-------->", url, reqOptions);

    console.log(entity);
  }

  let res: T;
  const req = await axios({
    url: `http://localhost:5432${url}`,
    method: reqOptions?.method
      ? reqOptions?.method
      : reqOptions?.data
      ? "POST"
      : "GET",
    params: reqOptions?.params,
    ...reqOptions,
  });
  console.log("-------->", req);
  res = req.data;

  return res;
};

export default fetcher;
