import axios from 'axios'

// import { EXPO_PUBLIC_BACKEND_URL } from 'react-native-dotenv'

console.log(process.env.EXPO_PUBLIC_BACKEND_URL)

const api = axios.create({ baseURL: 'http://localhost:8080' }); // http://localhost:8080 https://34.134.183.167:9090

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
    baseURL: 'http://localhost:8080',
  });
};

export default api;
export { cancelAllRequests, createLogoutApi };