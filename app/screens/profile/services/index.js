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
    details: (token, couponId) => {
      return client(token)
          .get(`${domain}/${apiUrl}/coupons/details/${couponId}`)
          .then(res => res.data)
          .catch(err => err.response)
    },
    activate: (token, couponId) => {
      return client(token)
          .post(`${domain}/${apiUrl}/coupons/${couponId}`)
          .then(res => res.data)
          .catch(err => err.response)
    },
    autoActivate: (token, params) => {
        return client(token)
            .post(`${domain}/${apiUrl}/coupons/auto/activate`, {...params})
            .then(res => res.data)
            .catch(err => console.log(err.response.data.message))
    },
    rating: (token, params) => {
        return client(token)
            .post(`${domain}/${apiUrl}/timeline/rating`, { ...params })
            .then(res => res.data)
            .catch(err => err.response)
    },
    like: (token, params) => {

        return client(token)
            .post(`${domain}/${apiUrl}/matches`, { ...params })
            .then(res => res.data)
            .catch(err => err.response)
    },
    coupons: (token, params) => {
      return client(token)
          .get(`${domain}/${apiUrl}/coupons/timeline?offset=${params.offset}&page=${params.page}`, {})
          .then(res => res.data)
          .catch(err => err.response)
    },
    userCoupons: (token, params) => {
      return client(token)
          .get(`${domain}/${apiUrl}/coupons/userCoupons?offset=${params.offset}&page=${params.page}`, {})
          .then(res => res.data)
          .catch(err => err.response)
    },

    couponsCount: (token, couponId) => {
      return client(token)
          .post(`${domain}/${apiUrl}/coupons/stats`, {...couponId})
          .then(res => res.data)
          .catch(err => err.response)
    },
    userPreferences: (token, params) => {
        return new Promise((resolve, reject) => {
            return  client(token)
            .get(`${domain}/${apiUrl}/users/profile/preferences`, {})
            .then(res => resolve(res.data))
            .catch(error=> reject(error))
        })
    },
    updateUserPreferences: (token, params) => {
      return client(token)
          .put(`${domain}/${apiUrl}/users/profile/preferences`, {params})
          .then(res => res.data)
          .catch(err => err.response)
    },
    userConfigurations: (token, params) => {
      return client(token)
          .get(`${domain}/${apiUrl}/users/profile/configurations`, {})
          .then(res => res.data)
          .catch(err => err.response)
    },
    updateUserConfigurations: (token, params) => {
      return client(token)
          .put(`${domain}/${apiUrl}/users/profile/configurations`, {params})
          .then(res => res.data)
          .catch(err => err.response)
    },
    terminateAccount: (token, userId) => {
        return client(token)
            .post(`${domain}/${apiUrl}/users/${userId}/terminate/account`)
            .then(res => res.data)
            .catch(err => err.response)
      },
    userDetails: (token, userId) => {
      return client(token)
          .get(`${domain}/${apiUrl}/users/profile/userDetails/${userId}`, {})
          .then(res => res.data)
          .catch(err => err.response)
    },
    hobbies: (token) => {
        return client(token)
            .get(`${domain}/${apiUrl}/hobbies/profile`)
            .then(res => res.data)
    },
    updateHobbies: (token, params) => {
        return client(token)
            .post(`${domain}/${apiUrl}/hobbies/profile`, {params})
            .then(res => res.data)
    },
    loggedInfo: (token) => {
        return client(token)
            .get(`${domain}/${apiUrl}/users/profile/loggedInfo`)
            .then(res => res.data)
    },
    changePhoto: (token, params) => {
        return client(token)
            .post(`${domain}/${apiUrl}/users/profile/changePhoto`, {params})
            .then(res => res.data)
    },
    userPhotos: (token ) => {
        return client(token)
            .get(`${domain}/${apiUrl}/users/profile/photos`, {})
            .then(res => res.data)
    },

    deletePhoto: (token, params) => {
        return client(token)
            .delete(`${domain}/${apiUrl}/users/profile/deletePhoto`, {params})
            .then(res => res.data)
    }









}

export default  api;
