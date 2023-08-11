import apihit from "./axios"
import axios from "axios";


const request = (
    method,
    url,
    params,
    requestData,
) =>
    (async () => {
        try {
            const response = await apihit({
                method,
                url,
                data: requestData,
                params,
            })

            const { data, status } = response

            return {
                data,
                status,
            }
        } catch (err) {
            // const error = err as AxiosError
            if (!axios.isAxiosError(err)) {
                return { status: undefined }
            }
            return { status: err.response?.status }
        }
    })()

export default request