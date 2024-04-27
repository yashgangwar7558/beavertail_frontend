import axios from 'axios'
// import { EXPO_PUBLIC_BACKEND_URL } from 'react-native-dotenv'
const api = axios.create({ baseURL: 'http://localhost:8080' }); // https://beavertail-backend.onrender.com http://localhost:8080

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Axios Error:', error.message)
    console.error('Error Details:', error.response)
    return Promise.reject(error)
  }
);

export default api