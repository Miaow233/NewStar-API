import { createCanvas, loadImage } from 'canvas'
import { Request } from 'express'
import { readFile } from 'fs/promises'
import Service from './Service'
import path from 'path'
import config from '../config'

/**
* 颜值评分
*
* returns Object
* */
export const apiFacercgGET = async () => {
    try {
        return Service.successResponse({})
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
        // Parse size parameter
        const [widthStr, heightStr] = size.split('x')
        const width = parseInt(widthStr)
        const height = parseInt(heightStr)

        // Check if size parameter is valid
        if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0 || width > 3000 || height > 3000) {
            throw Service.rejectResponse('Invalid size parameter', 404)
        }

        // Check if type parameter is valid
        const allowedTypes = ['png', 'jpeg', 'webp']
        if (!allowedTypes.includes(type)) {
            throw Service.rejectResponse('Invalid size parameter', 404)
        }

        // Create canvas
        const canvas = createCanvas(width, height)
        const ctx = canvas.getContext('2d')

        // Set background color
        ctx.fillStyle = bg || '#ffffff'
        ctx.fillRect(0, 0, width, height)

        // Set text color and font
        ctx.fillStyle = fg || '#000000'
        ctx.font = `${Math.floor(height / 10)}px Arial`

        // Set text alignment
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        // Draw text
        if (text) ctx.fillText(text, width / 2, height / 2)

        // Convert canvas to buffer
        const buffer = canvas.toBuffer(`image/png`)
        return Service.successResponse(buffer)
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
export const apiIpGET = async ({ ip, request }: any) => {
    const axios = require('axios')
    try {
        const ipParam = ip;

        let ipsToQuery;
        if (ipParam === 'my') {
            // 如果参数是 'my'，则查询本机 IP
            ipsToQuery = [request.ip];
        } else {
            // 否则使用传递的 IP 参数并分割为单独的 IP 地址
            ipsToQuery = ipParam.split('|');
        }

        // 使用 Promise.all() 并行查询每个 IP 的归属地信息
        const ipLocationData = await Promise.all(ipsToQuery.map(async (ip: any) => {
            const response = await axios.get(`http://ip-api.com/json/${ip}`);
            const data = response.data;
            return {
                ip: data.query,
                country: data.country,
                area: data.org
            };
        }));

        return Service.successResponse(ipLocationData);
    } catch (error: any) {
        throw Service.rejectResponse(error.message || 'Internal server error', error.status || 500)
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
* 二维码
*
* text String 二维码内容
* size Integer 生成图片大小 (optional)
* logo String 中心位置Logo (optional)
* encode String 二维码返回的编码方式[raw, json] (optional)
* level String 二维码容错率[L, M, Q, H] (optional)
* bgcolor String 背景颜色 (optional)
* fgcolor String 前景颜色 (optional)
* returns inline_response_200
* */
export const apiQrcodeGET = async ({
    text = 'Hello, World!',
    size = 200,
    logo = null,
    encode = 'raw',
    level = 'M',
    bgcolor = 'white',
    fgcolor = 'black',
}: any) => {
    const qr = require('qrcode')

    // Function to load image from URL
    const loadImageFromUrl = async (url: string) => {
        try {
            return await loadImage(url)
        } catch (error) {
            console.error('Error loading image from URL:', error)
            return null
        }
    }

    function colorNameToHex(color: string) {
        const ctx = createCanvas(1, 1).getContext('2d');
        ctx.fillStyle = color;
        return ctx.fillStyle;
    }

    try {
        const dark = colorNameToHex(bgcolor)
        const light = colorNameToHex(fgcolor)

        // Generate QR Code
        const qrCodeDataUrl = await qr.toDataURL(text, {
            errorCorrectionLevel: level,
            width: size,
            color: {
                dark,
                light,
            },
        })

        // Load logo image if URL is provided
        let logoImage = null
        if (logo) {
            logoImage = await loadImageFromUrl(logo)
        }

        // If logo image is loaded successfully, overlay it on QR Code
        if (logoImage) {
            const canvas = createCanvas(size, size)
            const context = canvas.getContext('2d')

            // Draw QR Code onto canvas
            const qrImage = await loadImage(qrCodeDataUrl)
            context.drawImage(qrImage, 0, 0, size, size)

            // Calculate position for logo
            const logoPositionX = (size - logoImage.width) / 2
            const logoPositionY = (size - logoImage.height) / 2

            // Draw logo onto canvas
            context.drawImage(logoImage, logoPositionX, logoPositionY)

            // Convert canvas to data URL
            const qrCodeWithLogoDataUrl = canvas.toDataURL()

            if (encode === 'raw') {
                // Return raw image
                return Service.successResponse(canvas.toBuffer('image/png'))
            } else {
                // Return JSON response
                return Service.successResponse({
                    qrCodeDataUrl: qrCodeWithLogoDataUrl,
                })
            }
        } else {
            // If logo image could not be loaded, return QR Code without logo
            if (encode === 'raw') {
                // Return raw image
                return Service.successResponse(qrCodeDataUrl)
            } else {
                // Return JSON response
                return Service.successResponse({
                    qrCodeDataUrl: qrCodeDataUrl,
                })
            }
        }
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
