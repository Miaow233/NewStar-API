const cheerio = require('cheerio')
const axios = require('axios')

const SEARCH_LINK = "https://store.steampowered.com/search/?term=";
const INFO_LINK = "https://store.steampowered.com/api/appdetails?appids=";
const INFO_FIX = "&l=schinese&cc=CN";

function searchId(search) {
    const url = SEARCH_LINK + search;

    axios({
        method: 'get',
        url: url,
        headers: {
            "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2"
        },
        proxy: {
            protocol: 'http',
            host: '127.0.0.1',
            port: 7890,
        },
    }).then((res) => {
        const $ = cheerio.load(res.data)
        const url = $("#search_resultsRows > a.search_result_row")[2].attribs
        return url
    })

    return url
}

function getJson(id) {
    const url = INFO_LINK + id + INFO_FIX;
    axios({
        method: 'get',
        url: url,
        proxy: {
            protocol: 'http',
            host: '127.0.0.1',
            port: 7890,
        },
    }).then((res) => {
        console.log(res.data)
    })
}
getJson(1127400)