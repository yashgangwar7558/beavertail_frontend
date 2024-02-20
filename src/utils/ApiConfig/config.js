import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:8080' }); // https://beavertail-backend.onrender.com'

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Axios Error:', error.message)
    console.error('Error Details:', error.response)
    return Promise.reject(error)
  }
);

export default api