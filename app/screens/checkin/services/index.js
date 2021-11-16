import axios from 'axios'
import { apiUrl, domain } from './../../../config/constants'
import  AppSettings  from './../../../config/const'
import { axiosInterceptor, client } from './../../../config/axios-utils'

/** Axios initialize interceptor */
axiosInterceptor()

if (!domain) {
    throw new Error('Server url not present. Contact the adminstrator!')
}

const  api =  {
    checkins: (token, params) => {
      return new Promise((resolve, reject) => {
        return  client(token)
        .get(`${domain}/${apiUrl}/companies/checkins/?page=${params.current_page}&offset=${params.offset}`)
        .then(res => resolve(res.data))
        .catch(error=> reject(error))
    })

      // return client(token)
      //     .get(`${domain}/${apiUrl}/companies/checkins/?page=${params.current_page}&offset=${params.offset}`)
      //     .then(res => res.data)
      //     .catch(err => console(err.response.data.message))
    },
    checkin: (token, companyId) => {
      return client(token)
          .get(`${domain}/${apiUrl}/companies/checkins/${companyId}`)
          .then(res => res.data)
          .catch(err => err.response.data.message)
    },
    doCheck: (token, companyId, action, checkinId) => {
      return client(token)
          .post(`${domain}/${apiUrl}/companies/checkins/${companyId}/${action}`, {checkinId})
          .then(res => res)
          .catch(err => err.response.data.message)
    },
    companyCoupons: (token, companyId) => {
      return client(token)
          .get(`${domain}/${apiUrl}/coupons/company/${companyId}`)
          .then(res => res.data)
          .catch(err => err.response.data.message)
    },



}

export default  api;
