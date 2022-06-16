import requests from "./request"
import mockRequest from './mockRequest'

export default {
    getProvinceDataList : () => {
        return mockRequest.get('/area')
    },

    getOverall: () => {
        return mockRequest.get('/overall')
    },

    
}