/* eslint-disable no-console */
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { FetcherRequestKeys } from 'shared/types/internal';

interface FetcherRequestProps<T> extends AxiosRequestConfig {
  data: Partial<T>;
}

const fetcher = async <T>(
  entity: FetcherRequestKeys,
  reqOptions?: FetcherRequestProps<T>,
): Promise<AxiosResponse<T>> => {
  const url = ['/api', ...entity].join('/');

  if (process.env.NODE_ENV !== 'production') {
    console.log('-------->', url, reqOptions);
  }

  const req = await axios({
    url: url,
    method: reqOptions ? 'POST' : 'GET',
    ...reqOptions,
  });

  return req;
};

export default fetcher;
