import axios from 'axios'
import { apiUrl, domain } from './../../../config/constants'
import  AppSettings  from './../../../config/const'
import { axiosInterceptor, client } from './../../../config/axios-utils'
import { pushClient } from  './../../../config/send-push-notification'

/** Axios initialize interceptor */
axiosInterceptor()

if (!domain) {
    throw new Error('Server url not present. Contact the adminstrator!')
}

const  api =  {
    matches: (token, page, offset) => {
      return client(token)
          .get(`${domain}/${apiUrl}/matches/?page=${page}&offset=${offset}`)
          .then(res => res.data)
          .catch(err => console.warn('error: -- '+ err))
    },
    chatCoverPhotos: (token) => {
        return new Promise((resolve, reject) => {
            return client(token)
            .get(`${domain}/${apiUrl}/chats/photos`)
            .then(res => resolve(res.data))
            .catch(err => reject(err.response))
        })


        // return client(token)
        //     .get(`${domain}/${apiUrl}/chats/photos`)
        //     .then(res => res.data)
        //     .catch(err => err)
      },
      chatCoverPhotos: (token) => {
        return new Promise((resolve, reject) => {
            return client(token)
            .get(`${domain}/${apiUrl}/chats/photos`)
            .then(res => resolve(res.data))
            .catch(err => reject(err.response))
        })


        // return client(token)
        //     .get(`${domain}/${apiUrl}/chats/photos`)
        //     .then(res => res.data)
        //     .catch(err => err)
      },
    ratingScore: (token, receiverUserId) => {
        return client(token)
        .get(`${domain}/${apiUrl}/matches/posRating/${receiverUserId}`)
        .then(res => res.data)
        .catch(err => alert(err.response.data.message))
    },
    posRating: (token, params) => {
        return client(token)
            .post(`${domain}/${apiUrl}/matches/posRating`, { ...params })
            .then(res => res.data)
            .catch(err => alert(err.response.data.message))
    },
    like: (token, params) => {
      console.warn(params)
        return client(token)
            .post(`${domain}/${apiUrl}/matches`, { ...params })
            .then(res => res.data)
            .catch(err => alert(err.response.data.message))
    },
    roomHistory: (token, params) => {
        return client(token)
            .post(`${domain}/${apiUrl}/chats/room-history/`, { ...params })
            .then(res => res.data)
            .catch(err => alert(err.response.data.message))
    },
    sendPushNotification: ({title, tagValue, icon, message}) => {
        console.log(title)
        console.log(tagValue)
        console.log(icon)
        console.log(message)
      return pushClient(title, tagValue, icon, message)
          .post(`https://onesignal.com/api/v1/notifications`, {})
          .then(res => res.data)
          .catch(err => console.warn(err.response.data.message))
    },
}

export default  api;
