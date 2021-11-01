import axios from 'axios'
import {ONE_SIGNAL_API_KEY, ONE_SIGNAL_APP_ID} from './constants'

const pushClient = (title, tagValue, icon, message) => {
    const defaultOptions = {
        headers: {
            authorization: `Basic ${ONE_SIGNAL_API_KEY}`,
            'Content-Type': 'application/json'
        }
    }
    const body = {
        "app_id": ONE_SIGNAL_APP_ID,
        "headings": {"en": title},
         "filters": [   // Will send notification only to specific device
          {          // Optional
            "field": "tag",
            "key": "USER",
            "relation": "=",
            "value": tagValue
          }
        ],
        "large_icon": icon,
        "contents": { "en": message }
  }
  console.log(body)
    return {
        post: (url) => axios.post(url, body, { ...defaultOptions }),
    }
}

export {
    pushClient
}