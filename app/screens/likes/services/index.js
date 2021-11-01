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
    likes: (token, params) => {
      return client(token)
          .get(`${domain}/${apiUrl}/likes/?page=${params.current_page}&offset=${params.offset}`)
          .then(res => res.data)
          .catch(err => err.response.data.message)
    }

}

export default  api;
