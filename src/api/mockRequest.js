import axios from "axios"

const requests = axios.create({
    baseURL: "/mock",
    timeout: 5000
})

export default requests
