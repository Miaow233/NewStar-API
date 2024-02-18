import Service from './Service'

const WallpaperCategoryType = {
    girl: "4e4d610cdf714d2966000000",
    animal: "4e4d610cdf714d2966000001",
    landscape: "4e4d610cdf714d2966000002",
    anime: "4e4d610cdf714d2966000003",
    drawn: "4e4d610cdf714d2966000004",
    mechanics: "4e4d610cdf714d2966000005",
    boy: "4e4d610cdf714d2966000006",
    game: "4e4d610cdf714d2966000007",
    text: "5109e04e48d5b9364ae9ac45",
  };

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
 * 壁纸分类: girl, animal, landscape, anime, drawn, mechanics, boy, game, text
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
