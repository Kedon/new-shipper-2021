import axios from 'axios'

let CancelToken = axios.CancelToken

const withCancel = (cancelFn) => {
    return {
        cancelToken: new CancelToken(function executor(c) { cancelFn && cancelFn(c) })
    }
}


const client = (token) => {
    const defaultOptions = {
        headers: {
            authorization: token ? `Bearer ${token}` : ''
        }
    }

    return {
        get: (url, options = {}) => axios.get(url, { ...defaultOptions, ...options }),
        post: (url, data, options = {}) => {
            return axios.post(url, data, { ...defaultOptions, ...options })
        },
        put: (url, data, options = {}) => axios.put(url, data, { ...defaultOptions, ...options }),
        delete: (url, options = {}) => axios.delete(url, { ...defaultOptions, ...options }),
    }
}

const axiosInterceptor = () => {
    // return axios.interceptors.response.use((response) => { return response }, (error) => {
    //     alert(error)
    //     if (401 === (error && error.response.status)) {
    //         error.response.data.code  = 401
    //         return Promise.reject(error.response.data);
    //     } else if (403 === (error && error.response.status)) {
    //         error.response.data.code  = 403
    //         return Promise.reject(error.response.data);
    //     } else if (400 === (error && error.response.status)) {
    //         error.response.data.code  = 400
    //         return Promise.reject(error.response.data);
    //     } else if (404 === (error && error.response.status)) {
    //         error.response.data.code  = 404
    //         return Promise.reject(error.response.data);
    //     } else {
    //         return Promise.reject({message: error.message, status: 'FAIL'});
    //     }
    // })

        axios.interceptors.response.use(undefined, err => {
        let res = err.response;
        if (res.status > 300 && res.config && !res.config.__isRetryRequest) {
            //  if(res.status === 403 &&)
            // alert(JSON.stringify(err.response))
            // alert(JSON.stringify(err.response.status))
            if (err && err.response) {
                // alert(JSON.stringify(err))
                return  Promise.reject(err);
            }
        }
      })
}
// var getFormData = function(obj, form, namespace) {
//     var fd = form || new FormData(),
//         formKey;

//     for (let property in obj) {
//         if (obj.hasOwnProperty(property)) {
//             let val = obj[property]
//             formKey = (namespace) ? `${namespace}[${property}]` : property

//             if (_.isArray(val) || (_.isObject(val) && !(val instanceof File))) {
//                 getFormData(val, fd, formKey)
//             } else {
//                 fd.append(formKey, val)
//             }
//         }
//     }
//     return fd;
// }

export {
    client,
    axiosInterceptor,
    // getFormData,
    withCancel
}
