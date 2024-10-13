import { AxiosError } from 'axios';

export const errorToString = (err) => {
  if (err instanceof AxiosError) {
    return err.response?.data?.msg ?? err.message;
  } else if (typeof err === 'string') {
    return err;
  } else if (err instanceof Error) {
    return err.message;
  } else {
    console.error(err);
    return 'An unexpected occurred';
  }
};
