import { createCanvas } from 'canvas';
import Service from './Service';

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
        const [widthStr, heightStr] = size.split('x');
        const width = parseInt(widthStr);
        const height = parseInt(heightStr);

        // Check if size parameter is valid
        if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0 || width > 3000 || height > 3000) {
            throw Service.rejectResponse('Invalid size parameter', 404);
        }

        // Check if type parameter is valid
        const allowedTypes = ['png', 'jpeg', 'webp'];
        if (!allowedTypes.includes(type)) {
            throw Service.rejectResponse('Invalid size parameter', 404);
        }

        // Create canvas
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Set background color
        ctx.fillStyle = bg || '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // Set text color and font
        ctx.fillStyle = fg || '#000000';
        ctx.font = `${Math.floor(height / 10)}px Arial`;

        // Set text alignment
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Draw text
        if (text) ctx.fillText(text, width / 2, height / 2);

        // Convert canvas to buffer
        const buffer = canvas.toBuffer(`image/png`);
        return Service.successResponse(buffer);
    } catch (e: any) {
        throw Service.rejectResponse(e.message || 'Invalid input', e.status || 405);
    }
};
