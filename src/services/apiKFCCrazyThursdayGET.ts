import { readFileSync } from 'fs'
import Service from './Service'
import path from 'path'
import config from '../config'
const TEXT_DATA = readFileSync(path.join(config.ROOT_DIR, 'assets', 'KFC.txt')).toString()

export const apiKFCCrazyThursdayGET = async () => {
    // read a random line from the file
    const randomLine = TEXT_DATA.split('\n')[Math.floor(Math.random() * TEXT_DATA.split('\n').length)]
    try {
        return Service.successResponse(randomLine)
    } catch (e: any) {
        throw Service.rejectResponse(e.message || 'Invalid input', e.status || 405)
    }
}
