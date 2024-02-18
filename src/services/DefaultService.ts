import { createCanvas, loadImage } from 'canvas'
import { readFile } from 'fs/promises'
import Service from './Service'
import path from 'path'
import config from '../config'
/**
 * Hitokoto
 *
 * @param encode string (optional)
 * @param type string (optional)
 * @param unicode string 规定返回的json数据是否进行unicode编码。(* 本字段只有在参数encode设置为json时生效！) (optional)
 * @param callback string 设置此字段后 PoisonousAPI 将会以jsonp的形式返回数据，本字段内容将作为函数名。(* 本字段只有在参数encode设置为json时生效！) (optional)
 * @returns Promise
 * */
export const apiHitokotoGET = async ({ encode, type, unicode, callback }: any) => {
    try {
        return Service.successResponse({
            encode,
            type,
            unicode,
            callback,
        })
    } catch (e: any) {
        throw Service.rejectResponse(e.message || 'Invalid input', e.status || 405)
    }
}

/**
 * 占位图
 *
 * size String 设置需要的占位图大小，格式[宽度]x[高度]，最大3000x3000，超过或格式有误将返回404。
 * type String 设置需要的占位图类型，可选值以外的类型将返回404。 (optional)
 * bg String 16进制的颜色代码，规定占位图的背景色。 (optional)
 * fg String 16进制的颜色代码，规定占位图的文字颜色。 (optional)
 * text String 提供展示在占位图中的文字，默认为图片尺寸大小 (optional)
 * returns String
 * */
export const apiImgholderGET = async ({ size, type, bg, fg, text }: any) => {
    try {
        return Service.successResponse({
            size,
            type,
            bg,
            fg,
            text,
        })
    } catch (e: any) {
        throw Service.rejectResponse(e.message || 'Invalid input', e.status || 405)
    }
}
/**
 * IP归属地
 *
 * ip String 需要查询的IP，多个IP可用|连接同时查询，返回json,当此参数内容为my时，返回本机ip。 (optional)
 * returns inline_response_200_1
 * */
export const apiIpGET = async ({ ip }: any) => {
    try {
        return Service.successResponse({
            ip,
        })
    } catch (e: any) {
        throw Service.rejectResponse(e.message || 'Invalid input', e.status || 405)
    }
}
/**
 * Pixel-art
 *
 * p Integer 调色板序号 (optional)
 * s Integer 缩放比例 (optional)
 * a String 颜色相似度算法 (optional)
 * body File  (optional)
 * returns String
 * */
export const apiPixelArtPOST = async ({ p = 0, s = 25, a, file }: any) => {
    try {
        const Pixelit = require('./pixel-art/pixelit').Pixelit
        const img = await loadImage(path.join(config.FILE_UPLOAD_PATH, file))
        const canvas = createCanvas(img.width, img.height)
        const px = new Pixelit({
            from: img,
            to: canvas,
            palette: p,
            scale: s,
            similarColorAlgorithm: a,
        })
        px.pixelate()
        px.convertPalette()
        px.resizeImage()
        const buffer = px.drawto.toBuffer('image/png')
        return Service.successResponse(buffer)
    } catch (e: any) {
        throw Service.rejectResponse(e.message || 'Invalid input', e.status || 405)
    }
}

export const apiKFCCrazyThursdayGET = async () => {
    const TEXT_DATA = (await readFile(path.join(config.ROOT_DIR, 'assets', 'KFC.txt'))).toString()
    // read a random line from the file
    const randomLine = TEXT_DATA.split('\n')[Math.floor(Math.random() * TEXT_DATA.split('\n').length)]
    try {
        return Service.successResponse(randomLine)
    } catch (e: any) {
        throw Service.rejectResponse(e.message || 'Invalid input', e.status || 405)
    }
}

/**
 * Poisonous
 *
 * returns Object
 * */
export const apiPoisonousGET = async () => {
    const TEXT_DATA = (await readFile(path.join(config.ROOT_DIR, 'assets', 'kfcyl.txt'))).toString()
    // read a random line from the file
    const randomLine = TEXT_DATA.split('\n')[Math.floor(Math.random() * TEXT_DATA.split('\n').length)]
    try {
        return Service.successResponse(randomLine)
    } catch (e: any) {
        throw Service.rejectResponse(e.message || 'Invalid input', e.status || 405)
    }
}

/**
 * QRCode
 *
 * text String
 * size Integer  (optional)
 * logo String  (optional)
 * encode String  (optional)
 * level String  (optional)
 * bgcolor String  (optional)
 * fgcolor String  (optional)
 * fun String  (optional)
 * returns inline_response_200
 * */
export const apiQrcodeGET = async ({ text, size, logo, encode, level, bgcolor, fgcolor, fun }: any) => {
    try {
        return Service.successResponse({
            text,
            size,
            logo,
            encode,
            level,
            bgcolor,
            fgcolor,
            fun,
        })
    } catch (e: any) {
        throw Service.rejectResponse(e.message || 'Invalid input', e.status || 405)
    }
}
/**
 * Translate
 *
 * query String
 * from String  (optional)
 * to String  (optional)
 * returns Object
 * */
export const apiTranslateGET = async ({ query, from = 'auto', to = 'zh' }: any) => {
    const APP_ID = '20200403000411421'
    const KEY = 'tb0bCTD9f9_Rq2PKECX8'
    const Endpoint = 'http://api.fanyi.baidu.com/api/trans/vip/translate'
    const axios = require('axios')
    const MD5 = require('md5')
    let salt = new Date().getTime()
    try {
        let res = await axios.post(
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
        return Service.successResponse(res.data)
    } catch (e: any) {
        throw Service.rejectResponse(e.message || 'Invalid input', e.status || 405)
    }
}
