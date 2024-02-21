import axios from 'axios'
import Service from './Service'
import MD5 from 'md5'
import config from '../config'
const APP_ID = config.BAIDU_APP_ID
const KEY = config.BAIDU_APP_KEY
const Endpoint = 'http://api.fanyi.baidu.com/api/trans/vip/translate'

/**
 * Translates text using a third-party API
 *
 * @param query - The text to be translated
 * @param from - The source language (default: 'auto')
 * @param to - The target language (default: 'zh')
 * @returns The translated text
 **/
export const apiTranslateGET = async ({ query, from = 'auto', to = 'zh' }: { query: string, from?: string, to?: string }) => {
    try {
        const salt = new Date().getTime()
        const response = await axios.post(
            Endpoint,
            {
                q: query,
                appid: APP_ID,
                salt,
                from,
                to,
                sign: MD5(APP_ID + query + salt + KEY),
            },
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        )
        return Service.successResponse(response.data)
    } catch (error: any) {
        throw Service.rejectResponse(error.message || 'Invalid input', error.status || 405)
    }
}
