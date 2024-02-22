import axios from 'axios'
import Service from '../Service'

const WallpaperCategoryId = {
    girl: '4e4d610cdf714d2966000000',
    animal: '4e4d610cdf714d2966000001',
    landscape: '4e4d610cdf714d2966000002',
    anime: '4e4d610cdf714d2966000003',
    drawn: '4e4d610cdf714d2966000004',
    mechanics: '4e4d610cdf714d2966000005',
    boy: '4e4d610cdf714d2966000006',
    game: '4e4d610cdf714d2966000007',
    text: '5109e04e48d5b9364ae9ac45',
}

export interface WallpaperApiModel {
    /**
     * [true, false]
     */
    adult?: boolean
    /**
     * 壁纸分类[girl, animal, landscape, anime, drawn, mechanics, boy, game, text]
     */
    category: string
    /**
     * 要获取几张
     */
    limit?: number
    /**
     * 壁纸排序方式[hot, new]
     */
    order: string
    /**
     * 从第几张开始
     */
    skip?: number
    [property: string]: any
}

/**
 * Fetches vertical wallpapers based on the specified category and optional parameters.
 *
 * @param category The category of the wallpaper (e.g. "girl", "animal", "landscape").
 * @param limit The maximum number of wallpapers to retrieve (optional).
 * @param skip The number of wallpapers to skip (optional).
 * @param adult Indicates if adult content should be included (optional).
 * @param order The order in which the wallpapers should be retrieved (optional).
 * @returns Object
 */
export const apiWallpaperVerticalGET = async ({ category, limit, skip, adult, order }: WallpaperApiModel) => {
    try {
        //@ts-ignore
        let categoryId = WallpaperCategoryId[category]

        let baseUrl = `http://service.aibizhi.adesk.com/v1/vertical/category/${categoryId}/vertical`
        let params = {
            limit: limit,
            skip: skip,
            adult: adult,
            order: order,
            first: 0,
        }

        let response = await axios.get(baseUrl, {
            params: params,
        })
        return Service.successResponse(response.data)
    } catch (e: any) {
        throw Service.rejectResponse(e.message || 'Invalid input', e.status || 405)
    }
}

export const apiWallpaperWallpaperGET = async ({ category, limit, skip, adult, order }: WallpaperApiModel) => {
    try {
        //@ts-ignore
        let categoryId = WallpaperCategoryId[category]

        let baseUrl = `http://service.aibizhi.adesk.com/v1/wallpaper/category/${categoryId}/wallpaper`
        let params = {
            limit: limit,
            skip: skip,
            adult: adult,
            order: order,
            first: 0,
        }

        let response = await axios.get(baseUrl, {
            params: params,
        })
        return Service.successResponse(response.data)
    } catch (e: any) {
        throw Service.rejectResponse(e.message || 'Invalid input', e.status || 405)
    }
}