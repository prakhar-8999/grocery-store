import axios from "axios";

const baseurl = 'http://10.21.82.114:5000/'
const apihit = axios.create({
    baseURL: baseurl,
    withCredentials: true
    // headers: {
    //     'content-type': 'application/json',
    //     'Access-Control-Allow-Origin': '*',
    //     'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    // },
})

export default apihit