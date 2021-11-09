import axios from 'axios'
import { apiUrl, domain } from './../../../config/constants'
import  AppSettings  from './../../../config/const'
import { axiosInterceptor, client } from './../../../config/axios-utils'

/** Axios initialize interceptor */
// axiosInterceptor()

if (!domain) {
    throw new Error('Server url not present. Contact the adminstrator!')
}

const  api =  {
    authentication:  (params) => {
        return new Promise((resolve, reject) => {
            return  client()
            .post(`${domain}/${apiUrl}/login/`, { ...params })
            .then(res => resolve(res))
            .catch(error=> reject(error.response))
        })

    },
    newAuthenticationFB:  (userID) => {
        console.log(`${domain}/${apiUrl}/login/facebook-login/${userID}`)
        return new Promise((resolve, reject) => {
            return  client()
            .get(`${domain}/${apiUrl}/login/facebook-login/${userID}`)
            .then(res => resolve(res))
            .catch(error=> reject(error))
        })
    },
    authenticationFB:  (url) => {
        return new Promise((resolve, reject) => {
            return  client()
            .get(url, { })
            .then(res => resolve(res))
            .catch(error=> reject(error))
        })
    },
    authorizationFB: ()=> {
        return new Promise((resolve, reject) => {
            return  client()
            .get(`${domain}/${apiUrl}/login/auth/facebook`, { })
            .then(res => resolve(res))
            .catch(error=> reject(error))
        })
    },
    hobbies: () => {
        return new Promise((resolve, reject) => {
            return client()
                .get(`${domain}/${apiUrl}/hobbies/`)
                .then(res => resolve(res.data))
                .catch(error=> reject(error))
        })
    },
    photos: (params) => {
        return new Promise((resolve, reject) => {
            return client()
                .post(`${domain}/${apiUrl}/uploads/files/`, {...params})
                .then(res => resolve(res.data))
                .catch(error=> reject(error))
        })
    },
    create: (params) => {
        return new Promise((resolve, reject) => {
            return client()
                .post(`${domain}/${apiUrl}/users/`, {...params})
                .then(res => resolve(res.data))
                .catch(error=> reject(error))
        })
    },
    userPhotos: (params) => {
        return new Promise((resolve, reject) => {
            return client()
                .post(`${domain}/${apiUrl}/users/${params.userId}/images`, {...params})
                .then(res => resolve(res.data))
                .catch(error=> reject(error))
        })
    },
    getUserByEmail: (params) => {
        return new Promise((resolve, reject) => {
            return  client()
            .get(`${domain}/${apiUrl}/users/userByEmail/${params.email}`, {...params})
            .then(res => resolve(res))
            .catch(error=> reject(error))
        })
    },
    passrecover: (params) => {
        return new Promise((resolve, reject) => {
            return  client()
            .post(`${domain}/${apiUrl}/pass/recover/`, {...params})
            .then(res => resolve(res))
            .catch(error=> reject(error))
        })
    },
    recoverCode: (params) => {
        return new Promise((resolve, reject) => {
            return  client()
            .post(`${domain}/${apiUrl}/pass/confirm/`, {...params})
            .then(res => resolve(res))
            .catch(error=> reject(error))
        })
    },
    getUserInfo: (token) => {
        return new Promise((resolve, reject) => {
            return client(token)
            .get(`${domain}/${apiUrl}/users/profile/loggedInfo`, {})
            .then(res =>  resolve(res.data))
            .catch(err => reject(err.message))
        })
    },
    userPreferences: (token, params) => {
        return new Promise((resolve, reject) => {
            return client(token)
            .get(`${domain}/${apiUrl}/users/profile/preferences`, {})
            .then(res =>  resolve(res.data))
            .catch(err => reject(err.response))
        })
    },
    location: (token, params) => {
        return new Promise((resolve, reject) => {
            return  client(token)
            .post(`${domain}/${apiUrl}/timeline/setLocation`, { ...params })
            .then(res =>resolve(res))
            .catch(error=> reject(error))
        })
    },

}

export default  api;
