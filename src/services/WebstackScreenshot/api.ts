import type { Browser, Page, Viewport } from 'puppeteer-core'
import puppeteer from 'puppeteer-core'
import { TtypeOptions } from './types'
import { isHttp, launch, goto, screenshot, isString, isObject, parseViewportString, cache } from './utils'
import Service from '../Service'
export { TtypeOptions } from './types'

let browser: Browser | null
let page: Page | null

const DEFAULT_VIEWPORT = {
    width: 1920,
    height: 1080,
}

async function takeScreenshot(data: TtypeOptions): Promise<string | Buffer> {
    try {
        let { viewport, isMobile = false } = data
        //@ts-ignore
        if (isMobile === 'true') isMobile = true
        //@ts-ignore
        if (isMobile === 'false') isMobile = false

        // Whether or not it starts with the http protocol
        data.url = isHttp(data.url) ? data.url : `http://${data.url}`

        const launchOpt = await launch()
        if (!browser)
            browser = await puppeteer.launch({
                executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
                ...launchOpt,
            })

        // Creating a new tab
        page = await browser.newPage()

        // Setting the screenshot aspect ratio
        if (isString(viewport)) {
            const parsedViewport = parseViewportString(viewport as string)
            // parse failed, when using default values
            if (parsedViewport) {
                await page.setViewport({ ...parsedViewport, isMobile }) // Setting the page size
            } else {
                console.warn(
                    `viewport parameter parsing exception, please check whether it is passed in accordance with "width x height" rules, or using viewport object ${viewport}`
                )
                await page.setViewport({ ...DEFAULT_VIEWPORT, isMobile })
            }
        } else if (isObject(viewport)) {
            // is viewport type
            const modifiedViewport: Viewport = {
                ...(viewport as Viewport),
                isMobile, // override isMobile property
            }
            await page.setViewport(modifiedViewport)
        } else {
            // No viewport passed in
            await page.setViewport({ ...DEFAULT_VIEWPORT, isMobile }) // Setting the page size
        }

        // open a website
        const gotoOpt = goto(data)
        await page.goto(data.url, gotoOpt)

        const screenshotOpt = screenshot(data)
        // Wait after page rendering is complete (milliseconds)
        //@ts-ignore
        page.waitForTimeout((gotoOpt.await || 0) + 1000)
        return (await page.screenshot(screenshotOpt)) as Buffer | string
    } catch (error) {
        // eslint-disable-next-line
        console.error(error)
        if (browser) {
            browser.close()
            browser = null
        }
    } finally {
        if (page) {
            await page.close()
            page = null
        }
    }
    return ''
}

export async function apiScreenshotGET(data: TtypeOptions) {
    try {
        const projectUrl = 'https://github.com/Lete114/WebStack-Screenshot#properties'
        if (!data.url) {
            const msg = { msg: 'URL not detected , Using parameters: ' + projectUrl }
            throw Service.rejectResponse(JSON.stringify(msg))
        }

        const screenshotOpt = screenshot(data)
        const content = await takeScreenshot(data)

        if (screenshotOpt.encoding === 'base64') {
            const base64 = `data:image/${screenshotOpt.type};base64,${content}`
            return Service.successResponse({ data: base64 })
        } else {
            return Service.successResponse(content)
        }
    } catch (e: any) {
        throw Service.rejectResponse(e.message || 'Invalid input', e.status || 405)
    }
}
