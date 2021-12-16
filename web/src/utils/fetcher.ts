/* eslint-disable no-console */
import axios, { AxiosRequestConfig } from "axios";
import { FetcherRequestKeys } from "../types";

interface FetcherRequestProps<T> extends AxiosRequestConfig {
  data: Partial<T>;
}

const fetcher = async <T>(
  entity: FetcherRequestKeys,
  reqOptions?: FetcherRequestProps<T>
): Promise<T> => {
  const url = ["/api", ...entity].join("/");

  if (process.env.NODE_ENV !== "production") {
    console.log("-------->", url, reqOptions);

    console.log(entity);
  }

  let res: T;
  const req = await axios({
    url: url,
    method: reqOptions?.method
      ? reqOptions?.method
      : reqOptions
      ? "POST"
      : "GET",
    ...reqOptions,
  });
  res = req.data;

  return res;
};

export default fetcher;
