import axios from "axios";

const baseurl = 'https://10.21.82.114:5000/'
const apihit = axios.create({
    baseURL: baseurl,
    withCredentials: true,
})

apihit.interceptors.response.use(
    (response) => response,
    (error) => {
        const { status, data } = error.response
        if (status === 409) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: data.msg,
            });
        }
        if (status === 500) {
            Swal.fire({
                icon: "error",
                title: "Internal Server Error",
                text: "Your Request Could Not Be Processed At The Moment...",
            });
        }
        return Promise.reject(error)
    }
)

export default apihit