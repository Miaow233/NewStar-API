import axios from 'axios'
import Service from './Service'


/**
 * IP归属地
 *
 * ip String 需要查询的IP，多个IP可用|连接同时查询，返回json,当此参数内容为my时，返回本机ip。 (optional)
 * returns inline_response_200_1
 * */

export const apiIpGET = async ({ ip, request }: any) => {
    try {
        const ipParam = ip

        let ipsToQuery
        if (ipParam === 'my') {
            // 如果参数是 'my'，则查询本机 IP
            ipsToQuery = [request.ip]
        } else {
            // 否则使用传递的 IP 参数并分割为单独的 IP 地址
            ipsToQuery = ipParam.split('|')
        }

        // 使用 Promise.all() 并行查询每个 IP 的归属地信息
        const ipLocationData = await Promise.all(
            ipsToQuery.map(async (ip: any) => {
                const response = await axios.get(`http://ip-api.com/json/${ip}`)
                const data = response.data
                return {
                    ip: data.query,
                    country: data.country,
                    area: data.org,
                }
            })
        )

        return Service.successResponse(ipLocationData)
    } catch (error: any) {
        throw Service.rejectResponse(error.message || 'Internal server error', error.status || 500)
    }
}
