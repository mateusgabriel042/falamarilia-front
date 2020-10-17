import axios from 'axios'

export default axios.create({
  // baseURL: `http://127.0.0.1:8080/api`,
  baseURL: `http://192.168.0.23:8081/api`,
  // baseURL: `http://177.85.33.222:8081/api`,
})
