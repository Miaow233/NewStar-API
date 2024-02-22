import path from 'path'
const { PORT, BAIDU_APP_ID, BAIDU_APP_KEY, PUPPETEER_EXECUTABLE_PATH } = process.env
const config = {
    ROOT_DIR: __dirname,
    URL_PORT: PORT || 8080,
    URL_PATH: 'http://localhost',
    BASE_VERSION: 'v2',
    CONTROLLER_DIRECTORY: path.join(__dirname, 'controllers'),
    PROJECT_DIR: __dirname,
    OPENAPI_YAML: '',
    FULL_PATH: '',
    FILE_UPLOAD_PATH: '',
    BAIDU_APP_ID: BAIDU_APP_ID || '20200403000411421',
    BAIDU_APP_KEY: BAIDU_APP_KEY || 'tb0bCTD9f9_Rq2PKECX8',
    PUPPETEER_EXECUTABLE_PATH: PUPPETEER_EXECUTABLE_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
}

config.OPENAPI_YAML = path.join(config.ROOT_DIR, 'openapi.yaml')
config.FULL_PATH = `${config.URL_PATH}:${config.URL_PORT}/${config.BASE_VERSION}`
config.FILE_UPLOAD_PATH = path.join(config.PROJECT_DIR, 'uploaded')

export default config
