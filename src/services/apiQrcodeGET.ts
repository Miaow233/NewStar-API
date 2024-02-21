import { createCanvas, loadImage } from 'canvas'
import Service from './Service'
import qr from 'qrcode'

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
    const ctx = createCanvas(1, 1).getContext('2d')
    ctx.fillStyle = color
    return ctx.fillStyle
}
