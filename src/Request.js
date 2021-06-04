import axios from 'axios'

const service = axios.create({
    baseURL: '', // process.env.VUE_APP_BASE_API, // url = base url + request url
    withCredentials: true, // send cookies when cross-domain requests
    timeout: 200000 // request timeout
})

export default service