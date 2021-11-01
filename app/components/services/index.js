import axios from 'axios'
import { apiUrl, domain } from './../../config/constants'
import  AppSettings  from './../../config/const'
import { axiosInterceptor, client } from './../../config/axios-utils'

/** Axios initialize interceptor */
axiosInterceptor()

if (!domain) {
    throw new Error('Server url not present. Contact the adminstrator!')
}

const  api =  {
    appAds: (token, type) => {
      return client(token)
          .get(`${domain}/${apiUrl}/appAds/${type}`)
          .then(res => res.data)
          .catch(err => console.warn(err.response.data.message))
    },
    packages: (token) => {
      return client(token)
          .get(`${domain}/${apiUrl}/packages`)
          .then(res => res.data)
          .catch(err => console.warn(err.response.data.message))
    },
    postStorie: (token, params) => {
        console.warn('Envio para a api')
        return client(token)
        .post(`${domain}/${apiUrl}/stories`, {params})
        .then(res => res.data)
        .catch(err => console.warn(err))
    },
    myStorie: (token) => {
        return client(token)
        .get(`${domain}/${apiUrl}/stories/own`)
        .then(res => res.data)
        .catch(err => console.warn(err))
    },
    stories: (token, params) => {
        return client(token)
        .get(`${domain}/${apiUrl}/stories`, {params})
        .then(res => res.data)
        .catch(err => console.warn(err))
    },


}

export default  api;
