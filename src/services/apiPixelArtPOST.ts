import { createCanvas, loadImage } from 'canvas'
import Service from './Service'
import path from 'path'
import config from '../config'
import { Pixelit } from './pixel-art/pixelit'

/**
 * Pixel-art
 *
 * p Integer 调色板序号 (optional)
 * s Integer 缩放比例 (optional)
 * a String 颜色相似度算法 (optional)
 * body File  (optional)
 * returns String
 **/
export const apiPixelArtPOST = async ({ p = 0, s = 25, a, file }: any) => {
    try {
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
