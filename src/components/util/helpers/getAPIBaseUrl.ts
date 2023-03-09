import { ANALYTICS_URL } from '../../../constants';

let SET_BASE_URL = '';

const getAPIBaseUrl = () => {
  if (SET_BASE_URL !== '') {
    return SET_BASE_URL;
  }

  const envURL: string | undefined = import.meta.env.VITE_ANALYTICS_URL;
  if (envURL === '' || envURL === undefined) {
    SET_BASE_URL = ANALYTICS_URL;
    return ANALYTICS_URL;
  }
  SET_BASE_URL = envURL;
  return envURL;
};

export default getAPIBaseUrl;
