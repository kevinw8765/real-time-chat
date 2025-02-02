import axios from 'axios'

// create an instance throughout our app
export const axiosInstance = axios.create({
    baseURL: 'http://localhost:5001/api',
    withCredentials: true,
})