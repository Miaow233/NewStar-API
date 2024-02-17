import Service from './Service'

/**
 * vertical
 *
 * category String Enum: \"girl\" \"animal\" \"landscape\" \"anime\" \"drawn\" \"mechanics\" \"boy\" \"game\" \"text\"
 * limit Integer  (optional)
 * skip Integer  (optional)
 * adult Boolean  (optional)
 * order String  (optional)
 * returns Object
 * */
export const apiWallpaperVerticalGET = async ({ category, limit, skip, adult, order }: any) => {
    try {
        return Service.successResponse({
            category,
            limit,
            skip,
            adult,
            order,
        })
    } catch (e: any) {
        throw Service.rejectResponse(e.message || 'Invalid input', e.status || 405)
    }
}

/**
 * wallpaper
 *
 * category String Enum: \"girl\" \"animal\" \"landscape\" \"anime\" \"drawn\" \"mechanics\" \"boy\" \"game\" \"text\"
 * limit Integer  (optional)
 * skip Integer  (optional)
 * adult Boolean  (optional)
 * order String  (optional)
 * returns Object
 * */
export const apiWallpaperWallpaperGET = async ({ category, limit, skip, adult, order }: any) => {
    try {
        return Service.successResponse({
            category,
            limit,
            skip,
            adult,
            order,
        })
    } catch (e: any) {
        throw Service.rejectResponse(e.message || 'Invalid input', e.status || 405)
    }
}
