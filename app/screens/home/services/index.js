import axios from 'axios'
import { apiUrl, domain } from './../../../config/constants'
import AppSettings from './../../../config/const'
import { axiosInterceptor, client } from './../../../config/axios-utils'
import { pushClient } from './../../../config/send-push-notification'
/** Axios initialize interceptor */
axiosInterceptor()

if (!domain) {
    throw new Error('Server url not present. Contact the adminstrator!')
}

const api = {
    timeline: (token, params, preferences) => {
        return client(token)
            .get(`${domain}/${apiUrl}/timeline/?page=${params.current_page}&offset=${params.offset}&adsOffset=${params.adsOffset}&ageFrom=${preferences.ageFrom}&ageTo=${preferences.ageTo}&looking=${preferences.looking}&distance=${preferences.distance}`)
            .then(res => res.data)
            .catch(err => err.response)
    },
    location: (token, params) => {
        return client(token)
            .post(`${domain}/${apiUrl}/timeline/setLocation`, { ...params })
            .then(res => res.data)
            .catch(err => err.response)
    },
    rating: (token, params) => {
        return client(token)
            .post(`${domain}/${apiUrl}/timeline/rating`, { ...params })
            .then(res => res.data)
            .catch(err => err.response)
    },
    remove: (token, id) => {
        return client(token)
            .post(`${domain}/${apiUrl}/timeline/remove/${id}`)
            .then(res => res.data)
            .catch(err => console.warn(err.response.data.message))
    },
    removeAd: (token, id) => {
        return client(token)
            .post(`${domain}/${apiUrl}/timeline/remove/ad/${id}`)
            .then(res => res.data)
            .catch(err => console.warn(err.response.data.message))
    },
    like: (token, params) => {
        return client(token)
            .post(`${domain}/${apiUrl}/matches`, { ...params })
            .then(res => res.data)
            .catch(err => console.warn(err.message))
    },
    unlike: (token, userId) => {
        return client(token)
            .delete(`${domain}/${apiUrl}/matches/${userId}`, {})
            .then(res => res.data)
            .catch(err => console.warn(err.message))
    },
    block: (token, userId, action) => {
        return client(token)
            .post(`${domain}/${apiUrl}/timeline/block/${userId}`, { ...action })
            .then(res => res.data)
            .catch(err => console.warn(err.message))
    },
    coupons: (token, params) => {
        return client(token)
            .get(`${domain}/${apiUrl}/coupons/timeline?offset=${params.offset}&page=${params.page}`, {})
            .then(res => res.data)
            .catch(err => err.response)
    },
    couponsCount: (token, couponId) => {
        console.warn(couponId)
            .post(`${domain}/${apiUrl}/coupons/stats`, { ...couponId })
            .then(res => res.data)
            .catch(err => err.response)
    },
    getUserInfo: (token) => {
        return client(token)
            .get(`${domain}/${apiUrl}/users/profile/loggedInfo`, {})
            .then(res => res.data)
            .catch(err => err.response)
    },
    sendPushNotification: ({ title, tagValue, icon, message }) => {
        return pushClient(title, tagValue, icon, message)
            .post(`https://onesignal.com/api/v1/notifications`, {})
            .then(res => res.data)
            .catch(err => console.warn(err.response.data.message))
    },
    stories: (token, params) => {
        return client(token)
        .get(`${domain}/${apiUrl}/stories`, {params})
        .then(res => res.data)
        .catch(err => console.warn(err))
    },
    userPreferences: (token, params) => {
        return client(token)
            .get(`${domain}/${apiUrl}/users/profile/preferences`, {})
            .then(res => res.data)
            .catch(err => err.response)
      },


}

export default api;
