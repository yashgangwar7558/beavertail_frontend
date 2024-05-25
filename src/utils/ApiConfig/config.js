import axios from 'axios'
import Constants from 'expo-constants'

const api = axios.create({ baseURL: Constants.expoConfig.extra.backendUrl }); // http://localhost:8080 https://35.209.240.116:9091

let controller = new AbortController();

api.interceptors.request.use(
  config => {
    if (config.cancelToken !== 'logout') {
      config.signal = controller.signal;
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  error => {
    console.error('Axios Error:', error.message);
    console.error('Error Details:', error.response);
    return Promise.reject(error);
  }
);

const cancelAllRequests = () => {
  if (controller) {
    controller.abort();
    controller = new AbortController(); 
  }
};

const createLogoutApi = () => {
  return axios.create({
    baseURL: Constants.expoConfig.extra.backendUrl,
  });
};

export default api;
export { cancelAllRequests, createLogoutApi };