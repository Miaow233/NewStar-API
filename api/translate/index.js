const APP_ID = "20200403000411421";
const KEY = "tb0bCTD9f9_Rq2PKECX8";
const Endpoint = "http://api.fanyi.baidu.com/api/trans/vip/translate";

const axios = require("axios");
const MD5 = require("md5");
const express = require("express");
const router = express.Router();

/**
 * Asynchronous function to translate text from one language to another.
 *
 * @param {string} query - the text to be translated, can be connected with \n
 * @param {string} [from="auto"] - the source language (default is auto-detection)
 * @param {string} [to="zh"] - the target language (default is Chinese)
 * @return {Promise} the translated text
 */
async function translate(query, from = "auto", to = "zh") {
  let salt = new Date().getTime();
  let res = await axios.post(
    Endpoint,
    {
      q: query,
      appid: APP_ID,
      salt: salt,
      from: from,
      to: to,
      sign: MD5(APP_ID + query + salt + KEY),
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return res.data;
}

router.get("/", async (req, res) => {
  console.log(req.query);
  let from = req.query.from;
  let to = req.query.to;
  let query = req.query.query;
  res.send(await translate(query, from, to));
});

module.exports = router;
